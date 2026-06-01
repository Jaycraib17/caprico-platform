import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Heart,
  MapPin,
  Briefcase,
  Clock,
  Bell,
  Trash2,
  DollarSign,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import useUser from "@/utils/auth/useUser";
import { fetchJson, getApiUrl } from "../../utils/api";

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: user, loading: userLoading } = useUser();
  const [activeTab, setActiveTab] = useState("jobs");
  const [savedJobs, setSavedJobs] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchData();
    } else if (!userLoading) {
      setLoading(false);
    }
  }, [user, userLoading]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch saved jobs
      const jobsData = await fetchJson(getApiUrl("/api/saved-jobs"));
      setSavedJobs(jobsData.saved_jobs || []);

      // Fetch saved searches
      const searchesData = await fetchJson(getApiUrl("/api/saved-searches"));
      setSavedSearches(searchesData.saved_searches || []);
    } catch (err) {
      console.error("Error fetching saved data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const removeSavedJob = async (jobId) => {
    try {
      await fetchJson(getApiUrl(`/api/saved-jobs/${jobId}`), {
        method: "DELETE",
      });
      setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error removing saved job:", err);
      setError("Failed to remove job");
    }
  };

  const toggleAlert = async (searchId) => {
    try {
      const search = savedSearches.find((s) => s.id === searchId);
      const newAlertFrequency =
        search.alert_frequency === "off" ? "daily" : "off";

      await fetchJson(getApiUrl(`/api/saved-searches/${searchId}`), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alert_frequency: newAlertFrequency }),
      });

      setSavedSearches(
        savedSearches.map((s) =>
          s.id === searchId ? { ...s, alert_frequency: newAlertFrequency } : s,
        ),
      );
    } catch (err) {
      console.error("Error toggling alert:", err);
      setError("Failed to update alert");
    }
  };

  const deleteSearch = async (searchId) => {
    try {
      await fetchJson(getApiUrl(`/api/saved-searches/${searchId}`), {
        method: "DELETE",
      });
      setSavedSearches(savedSearches.filter((s) => s.id !== searchId));
    } catch (err) {
      console.error("Error deleting search:", err);
      setError("Failed to delete search");
    }
  };

  const formatSalary = (job) => {
    if (!job.salary_min && !job.salary_max) return null;
    const currency = job.salary_currency || "USD";
    const symbol = currency === "USD" ? "$" : currency;

    if (job.salary_min && job.salary_max) {
      return `${symbol}${(job.salary_min / 1000).toFixed(0)}k - ${symbol}${(job.salary_max / 1000).toFixed(0)}k`;
    } else if (job.salary_min) {
      return `From ${symbol}${(job.salary_min / 1000).toFixed(0)}k`;
    } else {
      return `Up to ${symbol}${(job.salary_max / 1000).toFixed(0)}k`;
    }
  };

  const formatPostedDate = (date) => {
    const now = new Date();
    const posted = new Date(date);
    const diffMs = now - posted;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (!user && !userLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
        <StatusBar style="dark" />
        <View
          style={{
            backgroundColor: "#FFFFFF",
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 16,
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
              letterSpacing: -0.5,
            }}
          >
            Saved
          </Text>
        </View>
        <View
          style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }}
        />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Heart size={64} color="#E0E0E0" strokeWidth={1.5} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: "600",
              color: "#111111",
              marginTop: 16,
              textAlign: "center",
            }}
          >
            Sign in to view saved jobs
          </Text>
          <Text
            style={{
              fontSize: 15,
              color: "#666666",
              marginTop: 8,
              textAlign: "center",
            }}
          >
            Create an account to save jobs and searches
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 16,
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
            marginBottom: 16,
            letterSpacing: -0.5,
          }}
        >
          Saved
        </Text>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <TouchableOpacity
            onPress={() => setActiveTab("jobs")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: activeTab === "jobs" ? "#FF2D75" : "#F8F8F8",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: activeTab === "jobs" ? "#FFFFFF" : "#666666",
              }}
            >
              Jobs ({savedJobs.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab("searches")}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              backgroundColor: activeTab === "searches" ? "#FF2D75" : "#F8F8F8",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: activeTab === "searches" ? "#FFFFFF" : "#666666",
              }}
            >
              Searches ({savedSearches.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }} />

      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color="#D4A5A5" />
        </View>
      ) : error ? (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#E57373", textAlign: "center" }}>
            {error}
          </Text>
          <TouchableOpacity
            onPress={fetchData}
            style={{
              marginTop: 16,
              paddingHorizontal: 24,
              paddingVertical: 12,
              backgroundColor: "#D4A5A5",
              borderRadius: 12,
            }}
          >
            <Text style={{ color: "#FFFFFF", fontWeight: "600" }}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: insets.bottom + 84,
          }}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "jobs" && (
            <>
              {savedJobs.length === 0 ? (
                <View style={{ alignItems: "center", paddingTop: 60 }}>
                  <Heart size={64} color="#E0E0E0" strokeWidth={1.5} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#6B6B6B",
                      marginTop: 16,
                    }}
                  >
                    No saved jobs yet
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#9B9B9B",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Start saving jobs to keep track of opportunities
                  </Text>
                </View>
              ) : (
                savedJobs.map((job) => (
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

                      <TouchableOpacity
                        onPress={() => removeSavedJob(job.id)}
                        style={{ padding: 4 }}
                      >
                        <Heart
                          size={24}
                          color="#D4A5A5"
                          fill="#D4A5A5"
                          strokeWidth={2}
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={{ gap: 10 }}>
                      {(job.applicant_countries_allowed?.length > 0 ||
                        job.hiring_countries?.length > 0) && (
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <MapPin size={16} color="#6B6B6B" strokeWidth={2} />
                          <Text
                            style={{
                              fontSize: 14,
                              color: "#6B6B6B",
                              marginLeft: 8,
                            }}
                          >
                            {(job.applicant_countries_allowed?.length > 0
                              ? job.applicant_countries_allowed
                              : job.hiring_countries || []
                            )
                              .slice(0, 3)
                              .join(", ")}
                            {((job.applicant_countries_allowed?.length || 0) >
                              3 ||
                              (job.hiring_countries?.length || 0) > 3) &&
                              "..."}
                          </Text>
                        </View>
                      )}

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Briefcase size={16} color="#6B6B6B" strokeWidth={2} />
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#6B6B6B",
                            marginLeft: 8,
                          }}
                        >
                          {job.employment_type}
                          {formatSalary(job) && ` • ${formatSalary(job)}`}
                        </Text>
                      </View>

                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Clock size={16} color="#6B6B6B" strokeWidth={2} />
                        <Text
                          style={{
                            fontSize: 14,
                            color: "#6B6B6B",
                            marginLeft: 8,
                          }}
                        >
                          Posted {formatPostedDate(job.posted_at)}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}

          {activeTab === "searches" && (
            <>
              {savedSearches.length === 0 ? (
                <View style={{ alignItems: "center", paddingTop: 60 }}>
                  <Bell size={64} color="#E0E0E0" strokeWidth={1.5} />
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "600",
                      color: "#6B6B6B",
                      marginTop: 16,
                    }}
                  >
                    No saved searches
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#9B9B9B",
                      marginTop: 8,
                      textAlign: "center",
                    }}
                  >
                    Save your searches to get alerts for new jobs
                  </Text>
                </View>
              ) : (
                savedSearches.map((search) => {
                  const filters = search.filters || {};
                  const filterParts = [];
                  if (filters.category) filterParts.push(filters.category);
                  if (filters.experience_level)
                    filterParts.push(filters.experience_level);
                  if (filters.countries?.length > 0)
                    filterParts.push(filters.countries.join(", "));

                  return (
                    <View
                      key={search.id}
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
                              fontSize: 18,
                              fontWeight: "700",
                              color: "#2D2D2D",
                              marginBottom: 6,
                            }}
                          >
                            {search.name}
                          </Text>
                          <Text style={{ fontSize: 14, color: "#6B6B6B" }}>
                            {filterParts.join(" • ") || "No filters"}
                          </Text>
                        </View>

                        <TouchableOpacity
                          onPress={() => deleteSearch(search.id)}
                          style={{ padding: 4 }}
                        >
                          <Trash2 size={20} color="#C0C0C0" strokeWidth={2} />
                        </TouchableOpacity>
                      </View>

                      <TouchableOpacity
                        onPress={() => toggleAlert(search.id)}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                          backgroundColor: "#F5F5F5",
                          padding: 14,
                          borderRadius: 12,
                          marginTop: 12,
                        }}
                      >
                        <View
                          style={{ flexDirection: "row", alignItems: "center" }}
                        >
                          <Bell
                            size={18}
                            color={
                              search.alert_frequency !== "off"
                                ? "#D4A5A5"
                                : "#6B6B6B"
                            }
                            strokeWidth={2}
                          />
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: "600",
                              color:
                                search.alert_frequency !== "off"
                                  ? "#D4A5A5"
                                  : "#6B6B6B",
                              marginLeft: 10,
                            }}
                          >
                            {search.alert_frequency !== "off"
                              ? `Alerts: ${search.alert_frequency}`
                              : "Alerts Off"}
                          </Text>
                        </View>

                        <View
                          style={{
                            width: 48,
                            height: 28,
                            borderRadius: 14,
                            backgroundColor:
                              search.alert_frequency !== "off"
                                ? "#D4A5A5"
                                : "#E0E0E0",
                            justifyContent: "center",
                            paddingHorizontal: 2,
                          }}
                        >
                          <View
                            style={{
                              width: 24,
                              height: 24,
                              borderRadius: 12,
                              backgroundColor: "#FFFFFF",
                              alignSelf:
                                search.alert_frequency !== "off"
                                  ? "flex-end"
                                  : "flex-start",
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
