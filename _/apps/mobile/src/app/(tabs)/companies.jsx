import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Search, MapPin, Briefcase, ChevronRight } from "lucide-react-native";
import { useRouter } from "expo-router";

const MOCK_COMPANIES = [
  {
    id: 1,
    name: "Notion",
    logo: "📝",
    tagline: "All-in-one workspace",
    locations: ["Worldwide"],
    openRoles: 12,
    remotePolicy: "Fully Remote",
    color: "#F5E6E8",
  },
  {
    id: 2,
    name: "Shopify",
    logo: "🛍️",
    tagline: "Commerce platform",
    locations: ["US", "Canada", "UK"],
    openRoles: 24,
    remotePolicy: "Remote First",
    color: "#E8F5E6",
  },
  {
    id: 3,
    name: "GitLab",
    logo: "🦊",
    tagline: "DevOps platform",
    locations: ["Worldwide"],
    openRoles: 18,
    remotePolicy: "Fully Remote",
    color: "#E6F0F5",
  },
  {
    id: 4,
    name: "Figma",
    logo: "🎨",
    tagline: "Design collaboration",
    locations: ["US", "EU"],
    openRoles: 8,
    remotePolicy: "Hybrid",
    color: "#F5E6F0",
  },
  {
    id: 5,
    name: "Buffer",
    logo: "📱",
    tagline: "Social media tools",
    locations: ["Worldwide"],
    openRoles: 5,
    remotePolicy: "Fully Remote",
    color: "#FFF5E6",
  },
  {
    id: 6,
    name: "Zapier",
    logo: "⚡",
    tagline: "Automation platform",
    locations: ["Worldwide"],
    openRoles: 15,
    remotePolicy: "Fully Remote",
    color: "#E6F5F0",
  },
];

export default function CompaniesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

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
          Companies
        </Text>
        <Text style={{ fontSize: 15, color: "#6B6B6B" }}>
          Explore remote-first organizations
        </Text>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F5F5F5",
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginTop: 16,
          }}
        >
          <Search size={20} color="#6B6B6B" strokeWidth={2} />
          <TextInput
            placeholder="Search companies..."
            placeholderTextColor="#9B9B9B"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              fontSize: 16,
              color: "#2D2D2D",
            }}
          />
        </View>
      </View>

      {/* Companies List */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 84,
        }}
        showsVerticalScrollIndicator={false}
      >
        {MOCK_COMPANIES.map((company) => (
          <TouchableOpacity
            key={company.id}
            onPress={() => router.push(`/company/${company.id}`)}
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
            <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: company.color,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 32 }}>{company.logo}</Text>
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
                    }}
                  >
                    {company.name}
                  </Text>
                  <ChevronRight size={20} color="#C0C0C0" strokeWidth={2} />
                </View>

                <Text
                  style={{ fontSize: 14, color: "#6B6B6B", marginBottom: 12 }}
                >
                  {company.tagline}
                </Text>

                <View style={{ gap: 8 }}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MapPin size={14} color="#9B9B9B" strokeWidth={2} />
                    <Text
                      style={{ fontSize: 13, color: "#6B6B6B", marginLeft: 6 }}
                    >
                      {company.locations.join(", ")}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Briefcase size={14} color="#9B9B9B" strokeWidth={2} />
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#6B6B6B",
                          marginLeft: 6,
                        }}
                      >
                        {company.openRoles} open roles
                      </Text>
                    </View>

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
                        {company.remotePolicy}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
