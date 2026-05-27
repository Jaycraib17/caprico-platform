import { View, Text } from "react-native";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const LOGO_URL =
  "https://dtvoeevhaseb5.cloudfront.net/user-uploads/d1dd690b-9374-4b45-85a2-ee4d39feaf14.png";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={["#FF2D75", "#A02D75", "#6A0DAD"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StatusBar style="light" />

      <View style={{ alignItems: "center" }}>
        {/* Logo Container */}
        <View
          style={{
            width: 140,
            height: 140,
            borderRadius: 35,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.4,
            shadowRadius: 24,
            elevation: 12,
            marginBottom: 32,
            overflow: "hidden",
          }}
        >
          <Image
            source={LOGO_URL}
            style={{ width: 120, height: 120 }}
            contentFit="contain"
            transition={200}
          />
        </View>

        <Text
          style={{
            fontSize: 48,
            fontWeight: "800",
            color: "#FFFFFF",
            letterSpacing: -1.5,
            marginBottom: 8,
          }}
        >
          Capri Remote
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#FFFFFF",
            letterSpacing: 3,
            textTransform: "uppercase",
            fontWeight: "600",
            opacity: 0.9,
          }}
        >
          Work From Anywhere
        </Text>

        <View
          style={{
            width: 60,
            height: 3,
            backgroundColor: "#FFFFFF",
            marginTop: 24,
            borderRadius: 2,
            opacity: 0.8,
          }}
        />
      </View>
    </LinearGradient>
  );
}
