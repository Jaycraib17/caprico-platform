import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Heart,
  ExternalLink,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../../utils/auth/useUser";
import { fetchJson, getApiUrl } from "../../utils/api";
import { useFilters } from "../../utils/useFilters";
import ErrorState from "@/components/ErrorState";
import SkeletonJobCard from "@/components/SkeletonJobCard";
import { trackEngagement, ENGAGEMENT_EVENTS } from "@/utils/analytics";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  // Get filter state
  const searchQuery = useFilters((state) => state.searchQuery);
  const setSearchQuery = useFilters((state) => state.setSearchQuery);
  const getFilterParams = useFilters((state) => state.getFilterParams);
  const hasActiveFilters = useFilters((state) => state.hasActiveFilters());
  const loadFilters = useFilters((state) => state.loadFilters);

  // Load saved filters on mount and track app open
  useEffect(() => {
    loadFilters();
    trackEngagement(ENGAGEMENT_EVENTS.APP_OPEN);
  }, []);

  // Fetch jobs with React Query (including filters)
  const {
    data: jobsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["jobs", getFilterParams()],
    queryFn: async () => {
      let params = getFilterParams();
      if (user?.applicant_country && !params.includes("applicant_country")) {
        params +=
          (params ? "&" : "") + `applicant_country=${user.applicant_country}`;
      }
      return fetchJson(getApiUrl(`/api/jobs${params ? "?" + params : ""}`));
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  // Fetch saved job IDs with React Query
  const { data: savedData } = useQuery({
    queryKey: ["savedJobIds"],
    queryFn: async () => {
      const jobs = jobsData?.jobs || [];
      if (!user || jobs.length === 0) return { saved: {} };

      const jobIds = jobs.map((j) => j.id);
      return fetchJson(getApiUrl("/api/saved-jobs/check"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_ids: jobIds }),
      });
    },
    enabled: !!user && !!jobsData?.jobs?.length,
    staleTime: 1000 * 60 * 5,
  });

  // Save/unsave mutation
  const saveMutation = useMutation({
    mutationFn: async ({ jobId, shouldSave }) => {
      if (shouldSave) {
        return fetchJson(getApiUrl("/api/saved-jobs"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: jobId }),
        });
      } else {
        return fetchJson(getApiUrl(`/api/saved-jobs/${jobId}`), {
          method: "DELETE",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    },
  });

  // Save search mutation
  const saveSearchMutation = useMutation({
    mutationFn: async (name) => {
      const filters = useFilters.getState();
      return fetchJson(getApiUrl("/api/saved-searches"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          filters: {
            search: filters.searchQuery,
            category: filters.categories,
            experience_level: filters.experienceLevels,
            employment_type: filters.employmentTypes,
            countries: filters.hiringCountries,
            salary_min: filters.minSalary,
            salary_max: filters.maxSalary,
            worldwide_only: filters.worldwideOnly,
          },
          alert_frequency: "off",
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedSearches"] });
      Alert.alert("Saved", "Your search has been saved");
    },
    onError: () => {
      Alert.alert("Error", "Failed to save search. Please try again.");
    },
  });

  const handleSaveSearch = () => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to save searches");
      return;
    }

    Alert.prompt(
      "Save Search",
      "Give this search a name",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Save",
          onPress: (name) => {
            if (name && name.trim()) {
              saveSearchMutation.mutate(name.trim());
            }
          },
        },
      ],
      "plain-text",
    );
  };

  const handleToggleSave = (jobId, currentlySaved) => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to save jobs");
      return;
    }
    saveMutation.mutate({ jobId, shouldSave: !currentlySaved });
  };

  const jobs = jobsData?.jobs || [];
  const savedJobs = savedData?.saved || {};

  const formatSalary = (job) => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || "USD";
    const symbol = currency === "USD" ? "$" : currency;
    if (job.salary_min && job.salary_max) {
      return `${symbol}${(job.salary_min / 1000).toFixed(0)}k - ${symbol}${(job.salary_max / 1000).toFixed(0)}k`;
    }
    if (job.salary_min)
      return `${symbol}${(job.salary_min / 1000).toFixed(0)}k+`;
    return `Up to ${symbol}${(job.salary_max / 1000).toFixed(0)}k`;
  };

  const formatPostedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const renderJobCard = ({ item: job, index }) => (
    <TouchableOpacity
      onPress={() => router.push(`/job/${job.id}`)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
      }}
    >
      {/* Company & Save Heart */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 8,
        }}
      >
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text
            style={{
              fontSize: 14,
              color: "#666666",
              fontWeight: "500",
              marginBottom: 6,
            }}
          >
            {job.company_name}
          </Text>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#111111",
              letterSpacing: -0.4,
              lineHeight: 26,
            }}
          >
            {job.title}
          </Text>
        </View>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            handleToggleSave(job.id, savedJobs[job.id]);
          }}
          style={{
            padding: 8,
            marginTop: -4,
          }}
        >
          <Heart
            size={22}
            color={savedJobs[job.id] ? "#FF2D75" : "#CCCCCC"}
            fill={savedJobs[job.id] ? "#FF2D75" : "transparent"}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Remote Badge */}
      <View
        style={{
          alignSelf: "flex-start",
          backgroundColor: "#FFE6F0",
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 100,
          marginBottom: 16,
        }}
      >
        <Text
          style={{
            fontSize: 12,
            fontWeight: "600",
            color: "#FF2D75",
          }}
        >
          🌍 Remote
        </Text>
      </View>

      {/* Job Details */}
      <View style={{ gap: 10, marginBottom: 18 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MapPin size={16} color="#666666" strokeWidth={2} />
          <Text style={{ fontSize: 14, color: "#666666", marginLeft: 8 }}>
            {job.hiring_countries?.length > 0
              ? `${job.hiring_countries.length} ${job.hiring_countries.length === 1 ? "country" : "countries"}`
              : "Worldwide"}
          </Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Briefcase size={16} color="#666666" strokeWidth={2} />
          <Text style={{ fontSize: 14, color: "#666666", marginLeft: 8 }}>
            {job.employment_type} • {job.experience_level}
          </Text>
        </View>

        {formatSalary(job) && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <DollarSign size={16} color="#FF2D75" strokeWidth={2} />
            <Text
              style={{
                fontSize: 14,
                color: "#FF2D75",
                marginLeft: 6,
                fontWeight: "600",
              }}
            >
              {formatSalary(job)}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Clock size={16} color="#666666" strokeWidth={2} />
          <Text style={{ fontSize: 14, color: "#666666", marginLeft: 8 }}>
            Posted {formatPostedDate(job.posted_at)}
          </Text>
        </View>
      </View>

      {/* Gradient Apply Button */}
      <LinearGradient
        colors={["#FF2D75", "#6A0DAD"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 100,
          paddingVertical: 14,
          shadowColor: "#FF2D75",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 4,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "600",
              color: "#FFFFFF",
              marginRight: 6,
            }}
          >
            View Details
          </Text>
          <ExternalLink size={16} color="#FFFFFF" strokeWidth={2} />
        </View>
      </LinearGradient>

      {/* Free tier ad every 5 jobs */}
      {!user?.is_premium && (index + 1) % 5 === 0 && (
        <View
          style={{
            marginTop: 14,
            padding: 14,
            backgroundColor: "#FFE6F0",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "#FF2D75",
            borderStyle: "dashed",
          }}
        >
          <Text
            style={{
              fontSize: 9,
              fontWeight: "700",
              color: "#999999",
              textAlign: "center",
              marginBottom: 4,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            ADVERTISEMENT
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#FF2D75",
              textAlign: "center",
            }}
          >
            ✨ Upgrade to Premium for ad-free browsing
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View
      style={{
        paddingVertical: 60,
        paddingHorizontal: 20,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#111111",
          marginBottom: 8,
        }}
      >
        No jobs found
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#666666",
          textAlign: "center",
          paddingHorizontal: 40,
        }}
      >
        Try adjusting your filters or check back later
      </Text>
    </View>
  );

  const renderHeader = () => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      {/* Logo Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: "#F0F0F0",
          }}
        >
          <Image
            source="https://raw.createusercontent.com/d48434a6-9605-4879-92f4-4e5cf252424b/"
            style={{ width: 28, height: 28 }}
            contentFit="contain"
            transition={100}
          />
        </View>
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111111",
            letterSpacing: -0.3,
          }}
        >
          Capri Remote
        </Text>
      </View>

      <Text
        style={{
          fontSize: 15,
          color: "#666666",
          marginBottom: 20,
          lineHeight: 22,
        }}
      >
        {user?.applicant_country
          ? `Jobs available in ${user.applicant_country}`
          : "Curated remote jobs updated daily"}
      </Text>

      {/* Search Bar */}
      <View
        style={{
          flexDirection: "row",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F8F8F8",
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}
        >
          <Search size={20} color="#999999" strokeWidth={2} />
          <TextInput
            placeholder="Search jobs..."
            placeholderTextColor="#999999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: "#111111",
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => router.push("/filter")}
          style={{
            width: 52,
            height: 52,
            backgroundColor: hasActiveFilters ? "#FF2D75" : "#F8F8F8",
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            shadowColor: hasActiveFilters ? "#FF2D75" : "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: hasActiveFilters ? 0.3 : 0.05,
            shadowRadius: 6,
            elevation: hasActiveFilters ? 3 : 1,
          }}
        >
          <SlidersHorizontal
            size={20}
            color={hasActiveFilters ? "#FFFFFF" : "#666666"}
            strokeWidth={2}
          />
          {hasActiveFilters && (
            <View
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#FFFFFF",
              }}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Save search button */}
      {(hasActiveFilters || searchQuery) && (
        <TouchableOpacity
          onPress={handleSaveSearch}
          disabled={saveSearchMutation.isPending}
          style={{
            alignSelf: "flex-start",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 100,
            backgroundColor: "#FFE6F0",
          }}
        >
          <Text style={{ fontSize: 13, fontWeight: "600", color: "#FF2D75" }}>
            💾 Save this search
          </Text>
        </TouchableOpacity>
      )}

      {/* Pink accent line */}
      <View
        style={{
          height: 2,
          backgroundColor: "#FF2D75",
          opacity: 0.15,
          marginTop: 18,
          borderRadius: 1,
        }}
      />
    </View>
  );

  if (isError) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
        <StatusBar style="dark" />
        {renderHeader()}
        <ErrorState message="Failed to load jobs" onRetry={() => refetch()} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      <FlatList
        data={jobs}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          isLoading ? (
            <View style={{ padding: 20 }}>
              <SkeletonJobCard />
              <SkeletonJobCard />
              <SkeletonJobCard />
            </View>
          ) : (
            renderEmpty
          )
        }
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 84,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => refetch()}
            tintColor="#FF2D75"
          />
        }
      />
    </View>
  );
}
