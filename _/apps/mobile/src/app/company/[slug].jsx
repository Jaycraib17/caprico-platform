import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
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

export default function CompanyDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyDetails();
  }, [slug]);

  const fetchCompanyDetails = async () => {
    try {
      const res = await fetch(`/api/companies/${slug}`);
      const data = await res.json();
      setCompany(data.company);
      setJobs(data.jobs || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFFFFF",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator size="large" color="#D4A5A5" />
      </View>
    );
  }

  if (!company) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
        <StatusBar style="dark" />
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F0",
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
          >
            <ArrowLeft size={28} color="#2D2D2D" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ fontSize: 18, color: "#6B6B6B" }}>
            Company not found
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={28} color="#2D2D2D" strokeWidth={2} />
        </TouchableOpacity>
      </View>

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
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F0",
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 24,
              backgroundColor: "#F5E6E8",
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
              fontWeight: "bold",
              color: "#2D2D2D",
              marginBottom: 8,
              letterSpacing: -0.5,
            }}
          >
            {company.name}
          </Text>

          {company.remote_policy && (
            <View
              style={{
                alignSelf: "flex-start",
                paddingHorizontal: 14,
                paddingVertical: 6,
                borderRadius: 12,
                backgroundColor: "#F5E6E8",
                marginBottom: 16,
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "600", color: "#D4A5A5" }}
              >
                {company.remote_policy}
              </Text>
            </View>
          )}

          {company.description && (
            <Text
              style={{
                fontSize: 16,
                color: "#4A4A4A",
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
                <MapPin size={20} color="#6B6B6B" strokeWidth={2} />
                <Text
                  style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}
                >
                  Hiring in: {company.hiring_countries.join(", ")}
                </Text>
              </View>
            )}

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Briefcase size={20} color="#6B6B6B" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}>
                {company.job_count} open{" "}
                {company.job_count === 1 ? "position" : "positions"}
              </Text>
            </View>

            {company.website && (
              <TouchableOpacity
                onPress={() => Linking.openURL(company.website)}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <Globe size={20} color="#D4A5A5" strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 15,
                    color: "#D4A5A5",
                    marginLeft: 10,
                    fontWeight: "600",
                  }}
                >
                  Visit Website
                </Text>
                <ExternalLink
                  size={16}
                  color="#D4A5A5"
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
              fontWeight: "bold",
              color: "#2D2D2D",
              marginBottom: 16,
            }}
          >
            Open Positions
          </Text>

          {jobs.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Building2 size={48} color="#E0E0E0" strokeWidth={1.5} />
              <Text style={{ fontSize: 16, color: "#6B6B6B", marginTop: 12 }}>
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
                  borderRadius: 16,
                  padding: 20,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: "#F0F0F0",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: "bold",
                    color: "#2D2D2D",
                    marginBottom: 8,
                  }}
                >
                  {job.title}
                </Text>

                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Briefcase size={14} color="#6B6B6B" strokeWidth={2} />
                    <Text
                      style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 8 }}
                    >
                      {job.employment_type} • {job.experience_level}
                    </Text>
                  </View>

                  {job.hiring_countries?.length > 0 && (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <MapPin size={14} color="#6B6B6B" strokeWidth={2} />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#6B6B6B",
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
                    marginTop: 12,
                    paddingTop: 12,
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
                      {job.category}
                    </Text>
                  </View>

                  <Text
                    style={{
                      fontSize: 13,
                      fontWeight: "600",
                      color: "#D4A5A5",
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
