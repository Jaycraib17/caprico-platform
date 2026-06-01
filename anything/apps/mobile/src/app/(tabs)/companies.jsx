import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useCallback, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Search,
  MapPin,
  Briefcase,
  ChevronRight,
  Building2,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { fetchJson, getApiUrl } from "../../utils/api";
import ErrorState from "@/components/ErrorState";
import SkeletonJobCard from "@/components/SkeletonJobCard";

const LIMIT = 50;

export default function CompaniesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [companies, setCompanies] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isError, setIsError] = useState(false);
  const searchTimeout = useRef(null);
  const currentSearch = useRef("");

  const fetchCompanies = useCallback(
    async (search, currentOffset, reset = false) => {
      if (reset) setIsLoading(true);
      else setIsLoadingMore(true);
      setIsError(false);
      try {
        const params = new URLSearchParams();
        if (search) params.append("search", search);
        params.append("limit", String(LIMIT));
        params.append("offset", String(currentOffset));
        const data = await fetchJson(getApiUrl(`/api/companies?${params}`));
        const newCompanies = data.companies || [];
        setCompanies((prev) =>
          reset ? newCompanies : [...prev, ...newCompanies],
        );
        setTotal(data.total || 0);
        setHasMore(data.hasMore || false);
        setOffset(currentOffset + newCompanies.length);
      } catch (e) {
        console.error("Error fetching companies:", e);
        setIsError(true);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
        setIsRefreshing(false);
      }
    },
    [],
  );

  // Initial load
  useState(() => {
    fetchCompanies("", 0, true);
  });

  const handleSearchChange = (text) => {
    setSearchQuery(text);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      currentSearch.current = text;
      setCompanies([]);
      setOffset(0);
      setHasMore(true);
      fetchCompanies(text, 0, true);
    }, 400);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setOffset(0);
    setHasMore(true);
    fetchCompanies(currentSearch.current, 0, true);
  };

  const handleLoadMore = () => {
    if (isLoadingMore || !hasMore) return;
    fetchCompanies(currentSearch.current, offset, false);
  };

  const renderCompanyCard = ({ item: company }) => (
    <TouchableOpacity
      onPress={() => router.push(`/company/${company.slug}`)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        marginHorizontal: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            backgroundColor: "#F5E6E8",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 16,
          }}
        >
          <Text style={{ fontSize: 32 }}>{company.logo_url || "🏢"}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: "#2D2D2D",
                letterSpacing: -0.3,
                flex: 1,
              }}
            >
              {company.name}
            </Text>
            <ChevronRight size={20} color="#C0C0C0" strokeWidth={2} />
          </View>

          {company.description && (
            <Text
              style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 12 }}
              numberOfLines={2}
            >
              {company.description}
            </Text>
          )}

          <View style={{ gap: 8 }}>
            {/* Region — shown for CSV-imported companies */}
            {company.region && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={14} color="#6A0DAD" strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 13,
                    color: "#6A0DAD",
                    marginLeft: 6,
                    fontWeight: "600",
                  }}
                >
                  {company.region}
                </Text>
              </View>
            )}

            {company.hiring_countries?.length > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={14} color="#9B9B9B" strokeWidth={2} />
                <Text style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 6 }}>
                  {company.hiring_countries.slice(0, 3).join(", ")}
                  {company.hiring_countries.length > 3 && "..."}
                </Text>
              </View>
            )}

            {/* Tags */}
            {company.tags && company.tags.length > 0 && (
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                {company.tags.slice(0, 4).map((tag) => (
                  <View
                    key={tag}
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 3,
                      borderRadius: 8,
                      backgroundColor: "#EDE9FE",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#5B21B6",
                        fontWeight: "600",
                      }}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
                {company.tags.length > 4 && (
                  <Text
                    style={{
                      fontSize: 11,
                      color: "#9CA3AF",
                      alignSelf: "center",
                    }}
                  >
                    +{company.tags.length - 4}
                  </Text>
                )}
              </View>
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Briefcase size={14} color="#9B9B9B" strokeWidth={2} />
                <Text style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 6 }}>
                  {company.job_count} open{" "}
                  {company.job_count === 1 ? "role" : "roles"}
                </Text>
              </View>

              {company.remote_policy && (
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: "#F5E6E8",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#D4A5A5",
                      fontWeight: "600",
                    }}
                  >
                    {company.remote_policy}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
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
      <Building2 size={64} color="#E0E0E0" strokeWidth={1.5} />
      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          color: "#2D2D2D",
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        {searchQuery ? "No companies found" : "No companies yet"}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: "#6B6B6B",
          textAlign: "center",
        }}
      >
        {searchQuery
          ? "Try adjusting your search"
          : "Check back soon for hiring companies"}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ paddingVertical: 24, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#FF2D75" />
      </View>
    );
  };

  const renderHeader = () => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top + 20,
        paddingHorizontal: 20,
        paddingBottom: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: "#111111",
          marginBottom: 4,
          letterSpacing: -0.5,
        }}
      >
        Companies
      </Text>
      <Text style={{ fontSize: 15, color: "#666666", marginBottom: 16 }}>
        Explore remote-first organizations
      </Text>

      {/* Search Bar */}
      <View
        style={{
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
          placeholder="Search companies..."
          placeholderTextColor="#999999"
          value={searchQuery}
          onChangeText={handleSearchChange}
          style={{ flex: 1, marginLeft: 12, fontSize: 16, color: "#111111" }}
        />
      </View>

      {total > 0 && (
        <Text style={{ fontSize: 13, color: "#999999", marginTop: 12 }}>
          {companies.length} of {total} {total === 1 ? "company" : "companies"}
        </Text>
      )}

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

  if (isError && companies.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <StatusBar style="dark" />
        {renderHeader()}
        <ErrorState
          message="Failed to load companies"
          onRetry={handleRefresh}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      <FlatList
        data={companies}
        renderItem={renderCompanyCard}
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
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        contentContainerStyle={{
          paddingTop: 20,
          paddingBottom: insets.bottom + 84,
        }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#FF2D75"
          />
        }
      />
    </View>
  );
}
