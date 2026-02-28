import { View, Text, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

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
      colors={["#F5E6E8", "#E8D4D6", "#D4A5A5"]}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <StatusBar style="dark" />

      <View style={{ alignItems: "center" }}>
        <View
          style={{
            width: 120,
            height: 120,
            borderRadius: 30,
            backgroundColor: "#FFFFFF",
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#D4A5A5",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 10,
            marginBottom: 24,
          }}
        >
          <Text style={{ fontSize: 48, color: "#D4A5A5" }}>✨</Text>
        </View>

        <Text
          style={{
            fontSize: 42,
            fontWeight: "700",
            color: "#2D2D2D",
            letterSpacing: -1,
            marginBottom: 8,
          }}
        >
          Capri Remote
        </Text>

        <Text
          style={{
            fontSize: 16,
            color: "#6B6B6B",
            letterSpacing: 2,
            textTransform: "uppercase",
            fontWeight: "500",
          }}
        >
          Work From Anywhere
        </Text>

        <View
          style={{
            width: 40,
            height: 2,
            backgroundColor: "#D4A5A5",
            marginTop: 20,
            borderRadius: 1,
          }}
        />
      </View>
    </LinearGradient>
  );
}
