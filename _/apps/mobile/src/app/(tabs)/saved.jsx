import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Heart,
  MapPin,
  Briefcase,
  Clock,
  Bell,
  Trash2,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const MOCK_SAVED_JOBS = [
  {
    id: 2,
    title: "Content Marketing Manager",
    company: "Shopify",
    countries: ["US", "Canada", "UK"],
    type: "Full-time",
    salary: "$90k - $130k",
    posted: "5 days ago",
  },
  {
    id: 5,
    title: "Social Media Strategist",
    company: "Buffer",
    countries: ["Worldwide"],
    type: "Part-time",
    salary: "$60k - $85k",
    posted: "4 days ago",
  },
];

const MOCK_SAVED_SEARCHES = [
  {
    id: 1,
    name: "Senior Design Roles",
    filters: "Design • Senior • Worldwide",
    alertsEnabled: true,
  },
  {
    id: 2,
    name: "Marketing in Europe",
    filters: "Marketing • Mid Level • EU",
    alertsEnabled: false,
  },
];

export default function SavedScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("jobs");
  const [savedJobs, setSavedJobs] = useState(MOCK_SAVED_JOBS);
  const [savedSearches, setSavedSearches] = useState(MOCK_SAVED_SEARCHES);

  const removeSavedJob = (jobId) => {
    setSavedJobs(savedJobs.filter((job) => job.id !== jobId));
  };

  const toggleAlert = (searchId) => {
    setSavedSearches(
      savedSearches.map((search) =>
        search.id === searchId
          ? { ...search, alertsEnabled: !search.alertsEnabled }
          : search,
      ),
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 20,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
        }}
      >
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#2D2D2D",
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
              backgroundColor: activeTab === "jobs" ? "#D4A5A5" : "#F5F5F5",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: activeTab === "jobs" ? "#FFFFFF" : "#6B6B6B",
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
              backgroundColor: activeTab === "searches" ? "#D4A5A5" : "#F5F5F5",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontWeight: "600",
                color: activeTab === "searches" ? "#FFFFFF" : "#6B6B6B",
              }}
            >
              Searches ({savedSearches.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

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
                        {job.company}
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
                        {job.countries.join(", ")}
                      </Text>
                    </View>

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
                        {job.type} • {job.salary}
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
                        Posted {job.posted}
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
              savedSearches.map((search) => (
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
                        {search.filters}
                      </Text>
                    </View>

                    <TouchableOpacity style={{ padding: 4 }}>
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
                        color={search.alertsEnabled ? "#D4A5A5" : "#6B6B6B"}
                        strokeWidth={2}
                      />
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: "600",
                          color: search.alertsEnabled ? "#D4A5A5" : "#6B6B6B",
                          marginLeft: 10,
                        }}
                      >
                        {search.alertsEnabled ? "Alerts On" : "Alerts Off"}
                      </Text>
                    </View>

                    <View
                      style={{
                        width: 48,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: search.alertsEnabled
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
                          alignSelf: search.alertsEnabled
                            ? "flex-end"
                            : "flex-start",
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
