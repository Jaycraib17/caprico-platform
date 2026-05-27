import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Heart,
  ExternalLink,
  Clock,
  DollarSign,
  Bookmark,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import useUser from "../../utils/auth/useUser";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedJobs, setSavedJobs] = useState({});

  const fetchJobs = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (user?.applicant_country) {
        params.append("applicant_country", user.applicant_country);
      }

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);

      // Check which jobs are saved
      if (user && data.jobs?.length > 0) {
        const jobIds = data.jobs.map((j) => j.id);
        const savedRes = await fetch("/api/saved-jobs/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_ids: jobIds }),
        });
        const savedData = await savedRes.json();
        setSavedJobs(savedData.saved || {});
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.applicant_country]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchJobs();
  }, [fetchJobs]);

  const formatSalary = (job) => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || "USD";
    if (job.salary_min && job.salary_max) {
      return `${currency} ${(job.salary_min / 1000).toFixed(0)}k - ${(job.salary_max / 1000).toFixed(0)}k`;
    }
    if (job.salary_min)
      return `${currency} ${(job.salary_min / 1000).toFixed(0)}k+`;
    return `Up to ${currency} ${(job.salary_max / 1000).toFixed(0)}k`;
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

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#2D2D2D",
            marginBottom: 4,
            letterSpacing: -0.5,
          }}
        >
          Discover
        </Text>
        <Text style={{ fontSize: 15, color: "#6B6B6B" }}>
          {user?.applicant_country
            ? `Jobs available in ${user.applicant_country}`
            : "Find your next remote opportunity"}
        </Text>

        {/* Search Bar - kept for future implementation */}
        {/* rest of search bar code */}
      </View>

      {/* Job Feed */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 84,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#D4A5A5"
          />
        }
      >
        {loading ? (
          <View style={{ paddingVertical: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#D4A5A5" />
            <Text style={{ marginTop: 12, color: "#6B6B6B" }}>
              Loading jobs...
            </Text>
          </View>
        ) : jobs.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: "center" }}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#2D2D2D",
                marginBottom: 8,
              }}
            >
              No jobs found
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#6B6B6B",
                textAlign: "center",
                paddingHorizontal: 40,
              }}
            >
              Try adjusting your filters or check back later
            </Text>
          </View>
        ) : (
          jobs.map((job, index) => (
            <TouchableOpacity
              key={job.id}
              onPress={() => router.push(`/job/${job.id}`)}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 16,
                padding: 20,
                marginBottom: 16,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              {/* Company & Save */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#D4A5A5",
                      fontWeight: "600",
                      marginBottom: 4,
                    }}
                  >
                    {job.company_name}
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: "700",
                      color: "#2D2D2D",
                      letterSpacing: -0.3,
                      lineHeight: 26,
                    }}
                  >
                    {job.title}
                  </Text>
                </View>

                {savedJobs[job.id] && (
                  <Bookmark color="#D4A5A5" size={20} fill="#D4A5A5" />
                )}
              </View>

              {/* Job Details */}
              <View style={{ gap: 10, marginBottom: 16 }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <MapPin size={16} color="#6B6B6B" strokeWidth={2} />
                  <Text
                    style={{ fontSize: 14, color: "#6B6B6B", marginLeft: 8 }}
                  >
                    {job.hiring_countries?.length > 0
                      ? `${job.hiring_countries.length} ${job.hiring_countries.length === 1 ? "country" : "countries"}`
                      : "Worldwide"}
                  </Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Briefcase size={16} color="#6B6B6B" strokeWidth={2} />
                  <Text
                    style={{ fontSize: 14, color: "#6B6B6B", marginLeft: 8 }}
                  >
                    {job.employment_type} • {job.experience_level}
                  </Text>
                </View>

                {formatSalary(job) && (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <DollarSign size={16} color="#6B6B6B" strokeWidth={2} />
                    <Text
                      style={{ fontSize: 14, color: "#6B6B6B", marginLeft: 6 }}
                    >
                      {formatSalary(job)}
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Clock size={16} color="#6B6B6B" strokeWidth={2} />
                  <Text
                    style={{ fontSize: 14, color: "#6B6B6B", marginLeft: 8 }}
                  >
                    Posted {formatPostedDate(job.posted_at)}
                  </Text>
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: "#2D2D2D",
                  paddingVertical: 14,
                  borderRadius: 12,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#FFFFFF",
                    marginRight: 8,
                  }}
                >
                  View Details
                </Text>
                <ExternalLink size={18} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>

              {/* Free tier ad every 5 jobs */}
              {!user?.is_premium && (index + 1) % 5 === 0 && (
                <View
                  style={{
                    marginTop: 12,
                    padding: 12,
                    backgroundColor: "#F5E6E8",
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: "#D4A5A5",
                    borderStyle: "dashed",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: "#D4A5A5",
                      textAlign: "center",
                    }}
                  >
                    ✨ Upgrade to Premium for ad-free browsing
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
