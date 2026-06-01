import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Linking,
  Share,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Globe,
  ExternalLink,
  Flag,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useUser from "../../utils/auth/useUser";
import { fetchJson, getApiUrl } from "../../utils/api";
import ErrorState from "@/components/ErrorState";
import SkeletonJobCard from "@/components/SkeletonJobCard";
import { LinearGradient } from "expo-linear-gradient";

export default function JobDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { data: user } = useUser();
  const queryClient = useQueryClient();

  // Fetch job details
  const {
    data: jobData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => fetchJson(getApiUrl(`/api/jobs/${id}`)),
    enabled: !!id,
  });

  // Check if job is saved
  const { data: savedData } = useQuery({
    queryKey: ["savedJobIds"],
    queryFn: async () => {
      if (!user || !id) return { saved: {} };
      return fetchJson(getApiUrl("/api/saved-jobs/check"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_ids: [id] }),
      });
    },
    enabled: !!user && !!id,
  });

  const isSaved = savedData?.saved?.[id] || false;

  // Save/unsave mutation
  const saveMutation = useMutation({
    mutationFn: async (shouldSave) => {
      if (shouldSave) {
        return fetchJson(getApiUrl("/api/saved-jobs"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ job_id: id }),
        });
      } else {
        return fetchJson(getApiUrl(`/api/saved-jobs/${id}`), {
          method: "DELETE",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["savedJobIds"] });
      queryClient.invalidateQueries({ queryKey: ["savedJobs"] });
    },
  });

  // Track apply
  const applyMutation = useMutation({
    mutationFn: async () => {
      return fetchJson(getApiUrl(`/api/jobs/${id}/apply`), {
        method: "POST",
      });
    },
  });

  const handleSave = () => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to save jobs");
      return;
    }
    saveMutation.mutate(!isSaved);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this job: ${job.title} at ${job.company_name}`,
        url: getApiUrl(`/job/${id}`),
      });
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleReport = () => {
    Alert.alert("Report Job", "Why are you reporting this job?", [
      { text: "Spam or misleading", onPress: () => submitReport("spam") },
      {
        text: "Inappropriate content",
        onPress: () => submitReport("inappropriate"),
      },
      { text: "Expired or filled", onPress: () => submitReport("expired") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const submitReport = async (reason) => {
    try {
      await fetchJson(getApiUrl(`/api/jobs/${id}/report`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      Alert.alert("Thank you", "Your report has been submitted.");
    } catch (error) {
      Alert.alert("Error", "Failed to submit report. Please try again.");
    }
  };

  const handleApply = async () => {
    if (job.apply_url) {
      applyMutation.mutate();
      Linking.openURL(job.apply_url);
    }
  };

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

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
        <StatusBar style="dark" />
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
          >
            <ArrowLeft size={28} color="#111111" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          <SkeletonJobCard />
        </ScrollView>
      </View>
    );
  }

  if (isError || !jobData?.job) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
        <StatusBar style="dark" />
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
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 4 }}
          >
            <ArrowLeft size={28} color="#111111" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <ErrorState
          message="Failed to load job details"
          onRetry={() => refetch()}
        />
      </View>
    );
  }

  const job = jobData.job;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

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
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={28} color="#111111" strokeWidth={2} />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity style={{ padding: 4 }} onPress={handleShare}>
            <Share2 size={24} color="#111111" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSave}
            style={{ padding: 4 }}
            disabled={saveMutation.isPending}
          >
            <Heart
              size={24}
              color={isSaved ? "#FF2D75" : "#111111"}
              fill={isSaved ? "#FF2D75" : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Pink accent line */}
      <View style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{ backgroundColor: "#FFFFFF", padding: 24, marginBottom: 2 }}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#666666",
              fontWeight: "500",
              marginBottom: 8,
            }}
          >
            {job.company_name}
          </Text>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "800",
              color: "#111111",
              letterSpacing: -0.6,
              marginBottom: 16,
              lineHeight: 34,
            }}
          >
            {job.title}
          </Text>

          {/* Remote Badge */}
          <View
            style={{
              alignSelf: "flex-start",
              backgroundColor: "#FFE6F0",
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 100,
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#FF2D75" }}>
              🌍 Remote
            </Text>
          </View>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin size={18} color="#666666" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#666666", marginLeft: 10 }}>
                {job.hiring_countries?.join(", ") || "Worldwide"}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Briefcase size={18} color="#666666" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#666666", marginLeft: 10 }}>
                {job.employment_type} • {job.experience_level}
              </Text>
            </View>
            {formatSalary(job) && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <DollarSign size={18} color="#FF2D75" strokeWidth={2} />
                <Text
                  style={{
                    fontSize: 15,
                    color: "#FF2D75",
                    marginLeft: 10,
                    fontWeight: "600",
                  }}
                >
                  {formatSalary(job)}
                </Text>
              </View>
            )}
            {job.timezone_compatibility?.length > 0 && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Globe size={18} color="#666666" strokeWidth={2} />
                <Text
                  style={{ fontSize: 15, color: "#666666", marginLeft: 10 }}
                >
                  {job.timezone_compatibility.join(", ")}
                </Text>
              </View>
            )}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={18} color="#666666" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#666666", marginLeft: 10 }}>
                Posted {formatPostedDate(job.posted_at)}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 24 }}>
          {job.description && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                padding: 22,
                marginBottom: 16,
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
                  fontWeight: "700",
                  color: "#111111",
                  marginBottom: 14,
                }}
              >
                About the Role
              </Text>
              <Text style={{ fontSize: 15, color: "#666666", lineHeight: 24 }}>
                {job.description}
              </Text>
            </View>
          )}

          {job.responsibilities?.length > 0 && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                padding: 22,
                marginBottom: 16,
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
                  fontWeight: "700",
                  color: "#111111",
                  marginBottom: 14,
                }}
              >
                Responsibilities
              </Text>
              {job.responsibilities.map((item, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", marginBottom: 12 }}
                >
                  <Text
                    style={{ fontSize: 16, color: "#FF2D75", marginRight: 10 }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#666666",
                      lineHeight: 24,
                      flex: 1,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {job.requirements?.length > 0 && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                padding: 22,
                marginBottom: 16,
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
                  fontWeight: "700",
                  color: "#111111",
                  marginBottom: 14,
                }}
              >
                Requirements
              </Text>
              {job.requirements.map((item, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", marginBottom: 12 }}
                >
                  <Text
                    style={{ fontSize: 16, color: "#FF2D75", marginRight: 10 }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#666666",
                      lineHeight: 24,
                      flex: 1,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {job.benefits?.length > 0 && (
            <View
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 18,
                padding: 22,
                marginBottom: 16,
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
                  fontWeight: "700",
                  color: "#111111",
                  marginBottom: 14,
                }}
              >
                Benefits
              </Text>
              {job.benefits.map((item, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", marginBottom: 12 }}
                >
                  <Text
                    style={{ fontSize: 16, color: "#FF2D75", marginRight: 10 }}
                  >
                    •
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#666666",
                      lineHeight: 24,
                      flex: 1,
                    }}
                  >
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 16,
              padding: 12,
            }}
            onPress={handleReport}
          >
            <Flag size={18} color="#999999" strokeWidth={2} />
            <Text
              style={{
                fontSize: 15,
                color: "#999999",
                marginLeft: 8,
                fontWeight: "600",
              }}
            >
              Report this job
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Gradient Apply button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <LinearGradient
          colors={["#FF2D75", "#6A0DAD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 100,
            paddingVertical: 18,
            shadowColor: "#FF2D75",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 6,
          }}
        >
          <TouchableOpacity
            onPress={handleApply}
            disabled={applyMutation.isPending}
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
                  fontSize: 17,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  marginRight: 8,
                }}
              >
                Apply Now
              </Text>
              <ExternalLink size={20} color="#FFFFFF" strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
