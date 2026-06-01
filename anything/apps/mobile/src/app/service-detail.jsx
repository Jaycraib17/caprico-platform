import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import { ArrowLeft, Check } from "lucide-react-native";
import { services } from "@/data/services";
import { useEffect } from "react";
import useInAppPurchase from "@/utils/useInAppPurchase";

export default function ServiceDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { initiateInAppPurchase } = useInAppPurchase();

  const service = services.find((s) => s.id === id);

  useEffect(() => {
    initiateInAppPurchase();
  }, [initiateInAppPurchase]);

  const getServiceIcon = (serviceId) => {
    const icons = {
      "starter-pack": "🚀",
      "resume-review": "✍️",
      "tailored-resume": "📝",
      "resume-bundle": "🎯",
    };
    return icons[serviceId] || "✨";
  };

  if (!service) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#FFF5F8",
        }}
      >
        <Text style={{ fontSize: 16, color: "#666666" }}>
          Service not found
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 16,
          paddingBottom: 16,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: "#F8F8F8",
            alignItems: "center",
            justifyContent: "center",
            marginRight: 12,
          }}
        >
          <ArrowLeft size={20} color="#111111" strokeWidth={2.5} />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#111111",
            flex: 1,
          }}
        >
          Service Details
        </Text>

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

      {/* Pink accent line */}
      <View
        style={{
          height: 2,
          backgroundColor: "#FF2D75",
          opacity: 0.15,
        }}
      />

      <ScrollView
        contentContainerStyle={{
          paddingTop: 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Icon */}
        <View
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 40 }}>{getServiceIcon(service.id)}</Text>
        </View>

        {/* Badges */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <View
            style={{
              backgroundColor: "#E8F5E9",
              paddingHorizontal: 12,
              paddingVertical: 7,
              borderRadius: 100,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "700",
                color: "#4CAF50",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {service.purchase_type || "One-Time Purchase"}
            </Text>
          </View>
        </View>

        {/* Title & Price */}
        <View style={{ marginBottom: 24 }}>
          <Text
            style={{
              fontSize: 30,
              fontWeight: "800",
              color: "#111111",
              marginBottom: 12,
              letterSpacing: -0.6,
              lineHeight: 36,
            }}
          >
            {service.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text
              style={{
                fontSize: 48,
                fontWeight: "800",
                color: "#FF2D75",
                letterSpacing: -2,
              }}
            >
              ${service.price}
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: "600",
                color: "#999999",
                marginLeft: 8,
              }}
            >
              one-time
            </Text>
          </View>
        </View>

        {/* Description */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 18,
            padding: 22,
            marginBottom: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              color: "#111111",
              lineHeight: 24,
              marginBottom: 20,
            }}
          >
            {service.full_description}
          </Text>

          {/* Includes */}
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#999999",
              marginBottom: 16,
              textTransform: "uppercase",
              letterSpacing: 0.8,
            }}
          >
            What's Included:
          </Text>

          {service.includes.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 14,
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  backgroundColor: "#FFE6F0",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                  marginTop: 2,
                }}
              >
                <Check size={14} color="#FF2D75" strokeWidth={3} />
              </View>
              <Text
                style={{
                  fontSize: 15,
                  color: "#111111",
                  lineHeight: 22,
                  flex: 1,
                }}
              >
                {item}
              </Text>
            </View>
          ))}

          {/* Note */}
          {service.note && (
            <View
              style={{
                marginTop: 18,
                paddingTop: 18,
                borderTopWidth: 1,
                borderTopColor: "#F0F0F0",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  color: "#666666",
                  lineHeight: 20,
                }}
              >
                <Text style={{ fontWeight: "600" }}>Note:</Text> {service.note}
              </Text>
            </View>
          )}
        </View>

        {/* Conversion microcopy */}
        <View
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: 14,
            padding: 16,
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
            ✨ Built for remote job seekers
          </Text>
        </View>
      </ScrollView>

      {/* Fixed Gradient CTA Button */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          paddingHorizontal: 20,
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
            onPress={() =>
              router.push(
                `/service-order?id=${service.id}&title=${encodeURIComponent(service.title)}&price=${service.price}`,
              )
            }
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: 0.3,
                textAlign: "center",
              }}
            >
              Continue to Purchase
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
