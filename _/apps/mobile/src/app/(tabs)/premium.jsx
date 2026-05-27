import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Crown,
  Check,
  Sparkles,
  Bell,
  Download,
  Zap,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";

const PREMIUM_FEATURES = [
  {
    icon: Zap,
    title: "Ad-Free Experience",
    description: "Browse jobs without any distractions",
  },
  {
    icon: Bell,
    title: "Unlimited Alerts",
    description: "Save unlimited searches and get instant notifications",
  },
  {
    icon: Sparkles,
    title: "Early Access",
    description: "See new job postings before anyone else",
  },
  {
    icon: Download,
    title: "Export Jobs",
    description: "Download job lists and track applications",
  },
];

export default function PremiumScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#F5E6E8", "#E8D4D6"]}
          style={{
            paddingTop: insets.top + 40,
            paddingHorizontal: 24,
            paddingBottom: 40,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#FFFFFF",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
              shadowColor: "#D4A5A5",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
              elevation: 10,
            }}
          >
            <Crown size={48} color="#D4A5A5" strokeWidth={1.5} />
          </View>

          <Text
            style={{
              fontSize: 32,
              fontWeight: "700",
              color: "#2D2D2D",
              textAlign: "center",
              marginBottom: 12,
              letterSpacing: -0.5,
            }}
          >
            Capri Premium
          </Text>

          <Text
            style={{
              fontSize: 17,
              color: "#6B6B6B",
              textAlign: "center",
              lineHeight: 24,
            }}
          >
            Unlock the full power of your remote job search
          </Text>
        </LinearGradient>

        <View style={{ padding: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 20,
            }}
          >
            Premium Features
          </Text>

          {PREMIUM_FEATURES.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <View
                key={index}
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
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: "#F5E6E8",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 16,
                  }}
                >
                  <IconComponent size={24} color="#D4A5A5" strokeWidth={2} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: "700",
                      color: "#2D2D2D",
                      marginBottom: 4,
                    }}
                  >
                    {feature.title}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#6B6B6B",
                      lineHeight: 22,
                    }}
                  >
                    {feature.description}
                  </Text>
                </View>
              </View>
            );
          })}

          <View
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: 20,
              padding: 24,
              marginTop: 12,
              borderWidth: 2,
              borderColor: "#D4A5A5",
            }}
          >
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginBottom: 8 }}>
                Monthly Subscription
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text
                  style={{
                    fontSize: 48,
                    fontWeight: "700",
                    color: "#2D2D2D",
                    letterSpacing: -1,
                  }}
                >
                  $9.99
                </Text>
                <Text style={{ fontSize: 18, color: "#6B6B6B", marginLeft: 4 }}>
                  /month
                </Text>
              </View>
              <Text style={{ fontSize: 14, color: "#9B9B9B", marginTop: 4 }}>
                Cancel anytime
              </Text>
            </View>

            <View style={{ gap: 12, marginBottom: 24 }}>
              {[
                "Ad-free browsing",
                "Unlimited saved searches",
                "Early job access",
                "Export capabilities",
              ].map((item, index) => (
                <View
                  key={index}
                  style={{ flexDirection: "row", alignItems: "center" }}
                >
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "#D4A5A5",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Check size={14} color="#FFFFFF" strokeWidth={3} />
                  </View>
                  <Text style={{ fontSize: 15, color: "#4A4A4A" }}>{item}</Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={{
                backgroundColor: "#D4A5A5",
                paddingVertical: 18,
                borderRadius: 16,
                alignItems: "center",
                shadowColor: "#D4A5A5",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "700",
                  color: "#FFFFFF",
                  letterSpacing: 0.5,
                }}
              >
                Start Free Trial
              </Text>
            </TouchableOpacity>

            <Text
              style={{
                fontSize: 13,
                color: "#9B9B9B",
                textAlign: "center",
                marginTop: 16,
                lineHeight: 18,
              }}
            >
              7-day free trial, then $9.99/month. Cancel anytime.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
