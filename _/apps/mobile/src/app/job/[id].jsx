import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Users,
  Globe,
  ExternalLink,
  Flag,
} from "lucide-react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function JobDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);

  const job = {
    title: "Senior Product Designer",
    company: "Notion",
    logo: "📝",
    countries: ["Worldwide"],
    type: "Full-time",
    salary: "$120k - $180k",
    posted: "2 days ago",
    applicants: "47 applicants",
    experience: "Senior Level",
    timezone: "Any timezone",
    description:
      "We are looking for a Senior Product Designer to join our growing team. You will work on designing beautiful, intuitive experiences that help millions of people organize their work and life. You will collaborate closely with engineers, product managers, and other designers to ship features that delight our users.",
    responsibilities: [
      "Design end-to-end product experiences from concept to launch",
      "Create high-fidelity mockups and interactive prototypes",
      "Collaborate with cross-functional teams",
      "Conduct user research and usability testing",
      "Maintain and evolve our design system",
    ],
    requirements: [
      "5+ years of product design experience",
      "Strong portfolio showcasing shipped products",
      "Proficiency in Figma and modern design tools",
      "Excellent communication and collaboration skills",
      "Experience with design systems",
    ],
    benefits: [
      "Competitive salary and equity",
      "Fully remote work",
      "Flexible working hours",
      "Health, dental, and vision insurance",
      "Annual learning budget",
      "4 weeks paid vacation",
    ],
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#F0F0F0",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <ArrowLeft size={28} color="#2D2D2D" strokeWidth={2} />
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 16 }}>
          <TouchableOpacity style={{ padding: 4 }}>
            <Share2 size={24} color="#2D2D2D" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSaved(!saved)}
            style={{ padding: 4 }}
          >
            <Heart
              size={24}
              color={saved ? "#D4A5A5" : "#2D2D2D"}
              fill={saved ? "#D4A5A5" : "transparent"}
              strokeWidth={2}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            backgroundColor: "#FFFFFF",
            padding: 24,
            borderBottomWidth: 1,
            borderBottomColor: "#F0F0F0",
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 20,
              backgroundColor: "#F5E6E8",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Text style={{ fontSize: 40 }}>{job.logo}</Text>
          </View>

          <Text
            style={{
              fontSize: 15,
              color: "#D4A5A5",
              fontWeight: "600",
              marginBottom: 6,
            }}
          >
            {job.company}
          </Text>
          <Text
            style={{
              fontSize: 26,
              fontWeight: "700",
              color: "#2D2D2D",
              letterSpacing: -0.5,
              marginBottom: 16,
              lineHeight: 32,
            }}
          >
            {job.title}
          </Text>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MapPin size={18} color="#6B6B6B" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}>
                {job.countries.join(", ")}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Briefcase size={18} color="#6B6B6B" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}>
                {job.type} • {job.experience}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <DollarSign size={18} color="#6B6B6B" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}>
                {job.salary}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Globe size={18} color="#6B6B6B" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}>
                {job.timezone}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Clock size={18} color="#6B6B6B" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}>
                Posted {job.posted}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Users size={18} color="#6B6B6B" strokeWidth={2} />
              <Text style={{ fontSize: 15, color: "#6B6B6B", marginLeft: 10 }}>
                {job.applicants}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 24 }}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            About the Role
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: "#4A4A4A",
              lineHeight: 24,
              marginBottom: 28,
            }}
          >
            {job.description}
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Responsibilities
          </Text>
          {job.responsibilities.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", marginBottom: 10 }}
            >
              <Text style={{ fontSize: 16, color: "#D4A5A5", marginRight: 10 }}>
                •
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#4A4A4A",
                  lineHeight: 24,
                  flex: 1,
                }}
              >
                {item}
              </Text>
            </View>
          ))}

          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#2D2D2D",
              marginTop: 28,
              marginBottom: 12,
            }}
          >
            Requirements
          </Text>
          {job.requirements.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", marginBottom: 10 }}
            >
              <Text style={{ fontSize: 16, color: "#D4A5A5", marginRight: 10 }}>
                •
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#4A4A4A",
                  lineHeight: 24,
                  flex: 1,
                }}
              >
                {item}
              </Text>
            </View>
          ))}

          <Text
            style={{
              fontSize: 20,
              fontWeight: "700",
              color: "#2D2D2D",
              marginTop: 28,
              marginBottom: 12,
            }}
          >
            Benefits
          </Text>
          {job.benefits.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", marginBottom: 10 }}
            >
              <Text style={{ fontSize: 16, color: "#D4A5A5", marginRight: 10 }}>
                •
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: "#4A4A4A",
                  lineHeight: 24,
                  flex: 1,
                }}
              >
                {item}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 32,
              padding: 12,
            }}
          >
            <Flag size={18} color="#9B9B9B" strokeWidth={2} />
            <Text
              style={{
                fontSize: 15,
                color: "#9B9B9B",
                marginLeft: 8,
                fontWeight: "600",
              }}
            >
              Report this job
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "#FFFFFF",
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 16,
          borderTopWidth: 1,
          borderTopColor: "#F0F0F0",
        }}
      >
        <TouchableOpacity
          style={{
            backgroundColor: "#2D2D2D",
            paddingVertical: 18,
            borderRadius: 16,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: "#FFFFFF",
              marginRight: 8,
            }}
          >
            Apply Now
          </Text>
          <ExternalLink size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
