import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Sparkles } from "lucide-react-native";
import { services } from "@/data/services";

export default function HelpScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const getServiceIcon = (serviceId) => {
    const icons = {
      "starter-pack": "🚀",
      "resume-review": "✍️",
      "tailored-resume": "📝",
      "resume-bundle": "🎯",
    };
    return icons[serviceId] || "✨";
  };

  const renderServiceCard = (service) => (
    <TouchableOpacity
      key={service.id}
      onPress={() => router.push(`/service-detail?id=${service.id}`)}
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 18,
        padding: 24,
        marginBottom: 18,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 3,
        position: "relative",
      }}
    >
      {/* Service Icon */}
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          backgroundColor: "#FFF5F8",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Text style={{ fontSize: 32 }}>{getServiceIcon(service.id)}</Text>
      </View>

      {/* Badges Row */}
      <View
        style={{
          flexDirection: "row",
          gap: 8,
          marginBottom: 14,
          flexWrap: "wrap",
        }}
      >
        {/* One-Time Badge - Always shown */}
        <View
          style={{
            backgroundColor: "#E8F5E9",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 100,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "700",
              color: "#4CAF50",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            One-Time
          </Text>
        </View>

        {/* Best Value Badge */}
        {service.badge && (
          <View
            style={{
              backgroundColor: "#FFE6F0",
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                fontSize: 11,
                fontWeight: "700",
                color: "#FF2D75",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              ⭐ {service.badge}
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          color: "#111111",
          marginBottom: 10,
          letterSpacing: -0.4,
          lineHeight: 28,
        }}
      >
        {service.title}
      </Text>

      {/* Description */}
      <Text
        style={{
          fontSize: 15,
          color: "#666666",
          marginBottom: 20,
          lineHeight: 22,
        }}
      >
        {service.short_description}
      </Text>

      {/* Price & Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 13,
              color: "#999999",
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            ONE-TIME PRICE
          </Text>
          <Text
            style={{
              fontSize: 36,
              fontWeight: "800",
              color: "#FF2D75",
              letterSpacing: -1.2,
            }}
          >
            ${service.price}
          </Text>
        </View>

        <LinearGradient
          colors={["#FF2D75", "#6A0DAD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 100,
            paddingVertical: 14,
            paddingHorizontal: 24,
            shadowColor: "#FF2D75",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "#FFFFFF",
            }}
          >
            {service.button_text}
          </Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 84,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ marginBottom: 24 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Sparkles size={28} color="#FF2D75" strokeWidth={2} />
            <Text
              style={{
                fontSize: 28,
                fontWeight: "800",
                color: "#111111",
                marginLeft: 10,
                letterSpacing: -0.5,
              }}
            >
              Capri & Co
            </Text>
          </View>
          <Text
            style={{
              fontSize: 16,
              color: "#666666",
              lineHeight: 24,
            }}
          >
            Affordable tools and services to help you apply for remote jobs with
            confidence.
          </Text>
        </View>

        {/* Microcopy */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 18,
            marginBottom: 24,
            borderWidth: 2,
            borderColor: "#FFE6F0",
            shadowColor: "#FF2D75",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: "#111111",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            ✨ Land interviews faster • Better applications, less guesswork •
            Built for remote job seekers
          </Text>
        </View>

        {/* Service Cards */}
        {services.map((service) => renderServiceCard(service))}

        {/* Upsell Section */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 16,
            padding: 20,
            marginTop: 8,
            borderWidth: 1,
            borderColor: "#E5E5E5",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            elevation: 1,
          }}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#666666",
              textAlign: "center",
              lineHeight: 22,
            }}
          >
            Need more than the starter pack?{"\n"}
            <Text style={{ fontWeight: "600", color: "#FF2D75" }}>
              Upgrade to a Resume Review, Tailored Resume, or Resume + Cover
              Letter Bundle.
            </Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
