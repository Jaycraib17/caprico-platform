import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Briefcase,
  Globe,
  Heart,
  Sparkles,
  TrendingUp,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

const slides = [
  {
    icon: Globe,
    title: "Work From Anywhere",
    description:
      "Discover remote opportunities from companies hiring globally. Your dream job awaits, no matter where you are.",
    color: "#D4A5A5",
  },
  {
    icon: Briefcase,
    title: "Curated Opportunities",
    description:
      "Premium remote positions handpicked for ambitious professionals and digital creatives.",
    color: "#C4958F",
  },
  {
    icon: Heart,
    title: "Save & Track",
    description:
      "Bookmark your favorite jobs, set up alerts, and never miss the perfect opportunity.",
    color: "#B48B85",
  },
  {
    icon: TrendingUp,
    title: "Advance Your Career",
    description:
      "Join thousands of women building successful remote careers on their own terms.",
    color: "#A47B75",
  },
  {
    icon: Sparkles,
    title: "Ready to Begin?",
    description:
      "Start exploring premium remote opportunities designed for ambitious professionals like you.",
    color: "#D4A5A5",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    } else {
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <StatusBar style="dark" />

      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={{ fontSize: 16, color: "#6B6B6B", fontWeight: "600" }}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {slides.map((slide, index) => {
          const IconComponent = slide.icon;
          return (
            <View
              key={index}
              style={{
                width,
                alignItems: "center",
                justifyContent: "center",
                paddingHorizontal: 40,
              }}
            >
              <View
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: 70,
                  backgroundColor: `${slide.color}15`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 48,
                }}
              >
                <IconComponent
                  size={64}
                  color={slide.color}
                  strokeWidth={1.5}
                />
              </View>

              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "700",
                  color: "#2D2D2D",
                  textAlign: "center",
                  marginBottom: 20,
                  letterSpacing: -0.5,
                }}
              >
                {slide.title}
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  color: "#6B6B6B",
                  textAlign: "center",
                  lineHeight: 26,
                  paddingHorizontal: 10,
                }}
              >
                {slide.description}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      <View
        style={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          {slides.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentIndex === index ? "#D4A5A5" : "#E8D4D6",
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={handleNext}
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
            {currentIndex === slides.length - 1 ? "Get Started" : "Continue"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
