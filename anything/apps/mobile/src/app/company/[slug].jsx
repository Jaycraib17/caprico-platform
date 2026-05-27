import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  Globe,
  ExternalLink,
  Building2,
} from "lucide-react-native";
import { useQuery } from "@tanstack/react-query";
import { fetchJson, getApiUrl } from "../../utils/api";
import ErrorState from "@/components/ErrorState";
import SkeletonJobCard from "@/components/SkeletonJobCard";

export default function CompanyDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["company", slug],
    queryFn: async () => fetchJson(getApiUrl(`/api/companies/${slug}`)),
    enabled: !!slug,
  });

  const company = data?.company;
  const jobs = data?.jobs || [];

  const renderHeader = () => (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
        <ArrowLeft size={28} color="#111111" strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
        <StatusBar style="dark" />
        {renderHeader()}
        <View
          style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }}
        />
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <SkeletonJobCard />
          <SkeletonJobCard />
        </ScrollView>
      </View>
    );
  }

  if (isError) {
    const is404 =
      error?.message?.includes("404") || error?.message?.includes("not found");
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
        <StatusBar style="dark" />
        {renderHeader()}
        <View
          style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }}
        />
        {is404 ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              padding: 20,
            }}
          >
            <Building2 size={64} color="#E0E0E0" strokeWidth={1.5} />
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#111111",
                marginTop: 16,
              }}
            >
              Company not found
            </Text>
            <Text
              style={{
                fontSize: 14,
                color: "#666666",
                marginTop: 8,
                textAlign: "center",
              }}
            >
              This company may have been removed or the link is incorrect
            </Text>
          </View>
        ) : (
          <ErrorState
            message="Failed to load company"
            onRetry={() => refetch()}
          />
        )}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      {/* Header */}
      {renderHeader()}

      {/* Pink accent line */}
      <View style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Header */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 24,
            marginBottom: 2,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              backgroundColor: "#FFE6F0",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 48 }}>{company.logo_url || "🏢"}</Text>
          </View>

          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#111111",
              marginBottom: 12,
              letterSpacing: -0.6,
            }}
          >
            {company.name}
          </Text>

          {company.remote_policy && (
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 100,
                backgroundColor: "#FFE6F0",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "600", color: "#FF2D75" }}
              >
                {company.remote_policy}
              </Text>
            </View>
          )}

          {company.description && (
            <Text
              style={{
                fontSize: 16,
                color: "#666666",
                lineHeight: 24,
                marginBottom: 20,
              }}
            >
              {company.description}
            </Text>
          )}

          <View style={{ gap: 14 }}>
            {company.hiring_countries?.length > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MapPin size={20} color="#666666" strokeWidth={2} />
                <Text
                  style={{ fontSize: 15, color: "#666666", marginLeft: 10 }}
                >
                  Hiring in: {company.hiring_countries.join(", ")}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Briefcase size={20} color="#666666" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#666666", marginLeft: 10 }}>
                {company.job_count} open{" "}
                {company.job_count === 1 ? "position" : "positions"}
              </Text>
            </View>

            {company.website && (
              <TouchableOpacity
                onPress={() => Linking.openURL(company.website)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Globe size={20} color="#FF2D75" strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 15,
                    color: "#FF2D75",
                    marginLeft: 10,
                    fontWeight: "600",
                  }}
                >
                  Visit Website
                </Text>
                <ExternalLink
                  size={16}
                  color="#FF2D75"
                  strokeWidth={2}
                  style={{ marginLeft: 6 }}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Open Positions */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#111111",
              marginBottom: 16,
              letterSpacing: -0.3,
            }}
          >
            Open Positions
          </Text>

          {jobs.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Building2 size={48} color="#E0E0E0" strokeWidth={1.5} />
              <Text style={{ fontSize: 16, color: "#666666", marginTop: 12 }}>
                No open positions at the moment
              </Text>
            </View>
          ) : (
            jobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                onPress={() => router.push(`/job/${job.id}`)}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 18,
                  padding: 20,
                  marginBottom: 14,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                  elevation: 3,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#111111",
                    marginBottom: 10,
                    letterSpacing: -0.3,
                  }}
                >
                  {job.title}
                </Text>

                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Briefcase size={14} color="#666666" strokeWidth={2} />
                    <Text
                      style={{ fontSize: 13, color: "#666666", marginLeft: 8 }}
                    >
                      {job.employment_type} • {job.experience_level}
                    </Text>
                  </View>

                  {job.hiring_countries?.length > 0 && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MapPin size={14} color="#666666" strokeWidth={2} />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#666666",
                          marginLeft: 8,
                        }}
                      >
                        {job.hiring_countries.join(", ")}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    marginTop: 14,
                    paddingTop: 14,
                    borderTopWidth: 1,
                    borderTopColor: "#F5F5F5",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 100,
                      backgroundColor: "#FFE6F0",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#FF2D75",
                        fontWeight: "600",
                      }}
                    >
                      {job.category}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "600",
                      color: "#FF2D75",
                    }}
                  >
                    View Details →
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
