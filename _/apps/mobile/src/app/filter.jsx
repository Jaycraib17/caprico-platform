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
import { X, Check, ChevronDown } from "lucide-react-native";
import { useRouter } from "expo-router";

const CATEGORIES = [
  "Design",
  "Engineering",
  "Marketing",
  "Product",
  "Sales",
  "Customer Success",
  "Data",
  "HR",
];
const EXPERIENCE_LEVELS = [
  "Entry Level",
  "Mid Level",
  "Senior",
  "Lead",
  "Executive",
];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Australia",
  "Worldwide",
];

export default function FilterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedExperience, setSelectedExperience] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [worldwideOnly, setWorldwideOnly] = useState(false);

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAll = () => {
    setSelectedCategories([]);
    setSelectedExperience([]);
    setSelectedTypes([]);
    setSelectedCountries([]);
    setMinSalary("");
    setMaxSalary("");
    setWorldwideOnly(false);
  };

  const applyFilters = () => {
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FAFAFA" }}>
      <StatusBar style="dark" />

      {/* Header */}
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
          <X size={28} color="#2D2D2D" strokeWidth={2} />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: "700", color: "#2D2D2D" }}>
          Filters
        </Text>

        <TouchableOpacity onPress={clearAll} style={{ padding: 4 }}>
          <Text style={{ fontSize: 16, color: "#D4A5A5", fontWeight: "600" }}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Worldwide Toggle */}
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Location Preference
          </Text>
          <TouchableOpacity
            onPress={() => setWorldwideOnly(!worldwideOnly)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              padding: 16,
              borderRadius: 12,
              borderWidth: 2,
              borderColor: worldwideOnly ? "#D4A5A5" : "#F0F0F0",
            }}
          >
            <Text style={{ fontSize: 15, color: "#2D2D2D", fontWeight: "600" }}>
              Worldwide Only
            </Text>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                backgroundColor: worldwideOnly ? "#D4A5A5" : "#F0F0F0",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {worldwideOnly && (
                <Check size={16} color="#FFFFFF" strokeWidth={3} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Hiring Countries */}
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Hiring Countries
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {COUNTRIES.map((country) => (
              <TouchableOpacity
                key={country}
                onPress={() =>
                  toggleSelection(
                    country,
                    selectedCountries,
                    setSelectedCountries,
                  )
                }
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedCountries.includes(country)
                    ? "#D4A5A5"
                    : "#FFFFFF",
                  borderWidth: 1,
                  borderColor: selectedCountries.includes(country)
                    ? "#D4A5A5"
                    : "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedCountries.includes(country)
                      ? "#FFFFFF"
                      : "#6B6B6B",
                  }}
                >
                  {country}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Job Category */}
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Job Category
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() =>
                  toggleSelection(
                    category,
                    selectedCategories,
                    setSelectedCategories,
                  )
                }
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedCategories.includes(category)
                    ? "#D4A5A5"
                    : "#FFFFFF",
                  borderWidth: 1,
                  borderColor: selectedCategories.includes(category)
                    ? "#D4A5A5"
                    : "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedCategories.includes(category)
                      ? "#FFFFFF"
                      : "#6B6B6B",
                  }}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Experience Level */}
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Experience Level
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {EXPERIENCE_LEVELS.map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() =>
                  toggleSelection(
                    level,
                    selectedExperience,
                    setSelectedExperience,
                  )
                }
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedExperience.includes(level)
                    ? "#D4A5A5"
                    : "#FFFFFF",
                  borderWidth: 1,
                  borderColor: selectedExperience.includes(level)
                    ? "#D4A5A5"
                    : "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedExperience.includes(level)
                      ? "#FFFFFF"
                      : "#6B6B6B",
                  }}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Employment Type */}
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Employment Type
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {EMPLOYMENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() =>
                  toggleSelection(type, selectedTypes, setSelectedTypes)
                }
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  backgroundColor: selectedTypes.includes(type)
                    ? "#D4A5A5"
                    : "#FFFFFF",
                  borderWidth: 1,
                  borderColor: selectedTypes.includes(type)
                    ? "#D4A5A5"
                    : "#E0E0E0",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: selectedTypes.includes(type) ? "#FFFFFF" : "#6B6B6B",
                  }}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Salary Range */}
        <View style={{ marginBottom: 28 }}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              color: "#2D2D2D",
              marginBottom: 12,
            }}
          >
            Salary Range (USD)
          </Text>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: "#6B6B6B",
                  marginBottom: 8,
                  fontWeight: "600",
                }}
              >
                Minimum
              </Text>
              <TextInput
                placeholder="$0"
                placeholderTextColor="#9B9B9B"
                value={minSalary}
                onChangeText={setMinSalary}
                keyboardType="numeric"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: "#2D2D2D",
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                }}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 13,
                  color: "#6B6B6B",
                  marginBottom: 8,
                  fontWeight: "600",
                }}
              >
                Maximum
              </Text>
              <TextInput
                placeholder="$200k+"
                placeholderTextColor="#9B9B9B"
                value={maxSalary}
                onChangeText={setMaxSalary}
                keyboardType="numeric"
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 16,
                  color: "#2D2D2D",
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
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
          onPress={applyFilters}
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
            Apply Filters
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
