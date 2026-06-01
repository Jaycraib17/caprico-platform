import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
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
  Shield,
  CheckSquare,
  Square,
} from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { setAnalyticsConsent } from "../utils/consent";

const { width } = Dimensions.get("window");

const slides = [
  {
    icon: Globe,
    title: "Welcome to Capri Remote",
    description:
      "Your trusted platform for discovering verified remote job opportunities from companies hiring globally.",
    color: "#FF2D75",
  },
  {
    icon: Shield,
    title: "Your Privacy & Data",
    description:
      "We collect and use the following data to provide our service:\n\n• Your country and job preferences (to show relevant jobs)\n• App usage analytics (to improve the app)\n• Purchase transaction data via RevenueCat (for in-app purchases)\n• Support ticket information (when you contact us)\n\nYour data is encrypted, never sold, and you can request deletion anytime.",
    color: "#6A0DAD",
    requiresConsent: true,
  },
  {
    icon: Briefcase,
    title: "Curated Opportunities",
    description:
      "Every job is verified and reviewed. No scams, no spam—just real remote positions from legitimate companies.",
    color: "#FF2D75",
  },
  {
    icon: Heart,
    title: "Save & Get Alerts",
    description:
      "Bookmark your favorite jobs and set up email alerts for new positions that match your criteria.",
    color: "#6A0DAD",
  },
  {
    icon: Sparkles,
    title: "Ready to Begin?",
    description: "Start exploring curated remote opportunities.",
    color: "#FF2D75",
    hasLinks: true,
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dataConsentGiven, setDataConsentGiven] = useState(false);
  const scrollViewRef = useRef(null);
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNext = async () => {
    const currentSlide = slides[currentIndex];

    // Require consent on privacy slide before proceeding
    if (currentSlide.requiresConsent && !dataConsentGiven) {
      return;
    }

    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({ x: width * nextIndex, animated: true });
    } else {
      // Save analytics consent when user completes onboarding
      await setAnalyticsConsent(dataConsentGiven);
      router.replace("/(tabs)");
    }
  };

  const handleSkip = () => {
    router.replace("/(tabs)");
  };

  const openPrivacyPolicy = () => {
    const baseUrl =
      process.env.EXPO_PUBLIC_BASE_URL || "https://capriremote.com";
    Linking.openURL(`${baseUrl}/privacy`);
  };

  const openTerms = () => {
    const baseUrl =
      process.env.EXPO_PUBLIC_BASE_URL || "https://capriremote.com";
    Linking.openURL(`${baseUrl}/terms`);
  };

  const currentSlide = slides[currentIndex];
  const isButtonDisabled = currentSlide.requiresConsent && !dataConsentGiven;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      <View style={{ paddingTop: insets.top + 16, paddingHorizontal: 24 }}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={{ fontSize: 16, color: "#FF2D75", fontWeight: "700" }}>
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
                  borderWidth: 2,
                  borderColor: `${slide.color}30`,
                }}
              >
                <IconComponent size={64} color={slide.color} strokeWidth={2} />
              </View>

              <Text
                style={{
                  fontSize: 32,
                  fontWeight: "800",
                  color: "#111111",
                  textAlign: "center",
                  marginBottom: 20,
                  letterSpacing: -0.6,
                }}
              >
                {slide.title}
              </Text>

              <Text
                style={{
                  fontSize: 17,
                  color: "#666666",
                  textAlign: "center",
                  lineHeight: 26,
                  paddingHorizontal: 10,
                }}
              >
                {slide.description}
              </Text>

              {/* Consent checkbox for privacy slide */}
              {slide.requiresConsent && (
                <TouchableOpacity
                  onPress={() => setDataConsentGiven(!dataConsentGiven)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 24,
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: dataConsentGiven ? "#6A0DAD" : "#E0E0E0",
                  }}
                >
                  {dataConsentGiven ? (
                    <CheckSquare size={24} color="#6A0DAD" strokeWidth={2} />
                  ) : (
                    <Square size={24} color="#CCCCCC" strokeWidth={2} />
                  )}
                  <Text
                    style={{
                      fontSize: 15,
                      color: "#111111",
                      fontWeight: "600",
                      marginLeft: 12,
                      flex: 1,
                    }}
                  >
                    I agree to the data collection and use described above
                  </Text>
                </TouchableOpacity>
              )}

              {/* Privacy & Terms Links for last slide */}
              {slide.hasLinks && (
                <View style={{ marginTop: 16, alignItems: "center" }}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: "#666666",
                      textAlign: "center",
                      lineHeight: 22,
                    }}
                  >
                    By continuing, you agree to our
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginTop: 4,
                    }}
                  >
                    <TouchableOpacity onPress={openPrivacyPolicy}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#FF2D75",
                          fontWeight: "600",
                          textDecorationLine: "underline",
                        }}
                      >
                        Privacy Policy
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        fontSize: 14,
                        color: "#666666",
                        marginHorizontal: 4,
                      }}
                    >
                      and
                    </Text>
                    <TouchableOpacity onPress={openTerms}>
                      <Text
                        style={{
                          fontSize: 14,
                          color: "#FF2D75",
                          fontWeight: "600",
                          textDecorationLine: "underline",
                        }}
                      >
                        Terms of Service
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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
                backgroundColor: currentIndex === index ? "#FF2D75" : "#FFD0E3",
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        <LinearGradient
          colors={["#FF2D75", "#6A0DAD"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 100,
            shadowColor: "#FF2D75",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.4,
            shadowRadius: 12,
            elevation: 8,
            opacity: isButtonDisabled ? 0.5 : 1,
          }}
        >
          <TouchableOpacity
            onPress={handleNext}
            disabled={isButtonDisabled}
            style={{
              paddingVertical: 18,
              alignItems: "center",
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
        </LinearGradient>
      </View>
    </View>
  );
}
