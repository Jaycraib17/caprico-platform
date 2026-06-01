import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { X, Check } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useFilters } from "../utils/useFilters";
import { LinearGradient } from "expo-linear-gradient";

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
  const { setFilters, clearFilters, hasActiveFilters } = useFilters();

  // Load current filters from store
  const currentFilters = useFilters((state) => ({
    categories: state.categories,
    experienceLevels: state.experienceLevels,
    employmentTypes: state.employmentTypes,
    hiringCountries: state.hiringCountries,
    minSalary: state.minSalary,
    maxSalary: state.maxSalary,
    worldwideOnly: state.worldwideOnly,
  }));

  const [selectedCategories, setSelectedCategories] = useState(
    currentFilters.categories,
  );
  const [selectedExperience, setSelectedExperience] = useState(
    currentFilters.experienceLevels,
  );
  const [selectedTypes, setSelectedTypes] = useState(
    currentFilters.employmentTypes,
  );
  const [selectedCountries, setSelectedCountries] = useState(
    currentFilters.hiringCountries,
  );
  const [minSalary, setMinSalary] = useState(currentFilters.minSalary);
  const [maxSalary, setMaxSalary] = useState(currentFilters.maxSalary);
  const [worldwideOnly, setWorldwideOnly] = useState(
    currentFilters.worldwideOnly,
  );

  const toggleSelection = (item, list, setList) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleClearAll = () => {
    setSelectedCategories([]);
    setSelectedExperience([]);
    setSelectedTypes([]);
    setSelectedCountries([]);
    setMinSalary("");
    setMaxSalary("");
    setWorldwideOnly(false);
  };

  const applyFilters = () => {
    setFilters({
      categories: selectedCategories,
      experienceLevels: selectedExperience,
      employmentTypes: selectedTypes,
      hiringCountries: selectedCountries,
      minSalary,
      maxSalary,
      worldwideOnly,
    });
    router.back();
  };

  const activeCount = [
    selectedCategories.length > 0,
    selectedExperience.length > 0,
    selectedTypes.length > 0,
    selectedCountries.length > 0,
    minSalary !== "",
    maxSalary !== "",
    worldwideOnly,
  ].filter(Boolean).length;

  return (
    <View style={{ flex: 1, backgroundColor: "#FFF5F8" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 4 }}>
          <X size={28} color="#111111" strokeWidth={2} />
        </TouchableOpacity>

        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: "#111111" }}>
            Filters
          </Text>
          {activeCount > 0 && (
            <Text style={{ fontSize: 12, color: "#FF2D75", marginTop: 2 }}>
              {activeCount} active
            </Text>
          )}
        </View>

        <TouchableOpacity onPress={handleClearAll} style={{ padding: 4 }}>
          <Text style={{ fontSize: 16, color: "#FF2D75", fontWeight: "600" }}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ height: 2, backgroundColor: "#FF2D75", opacity: 0.15 }} />

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
              color: "#111111",
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
            <Text style={{ fontSize: 15, color: "#111111", fontWeight: "600" }}>
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
              color: "#111111",
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
              color: "#111111",
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
              color: "#111111",
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
              color: "#111111",
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
              color: "#111111",
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
                  color: "#111111",
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
                  color: "#111111",
                  borderWidth: 1,
                  borderColor: "#E0E0E0",
                }}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Gradient Apply Button */}
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
          <TouchableOpacity onPress={applyFilters}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: "700",
                color: "#FFFFFF",
                letterSpacing: 0.5,
                textAlign: "center",
              }}
            >
              {activeCount > 0
                ? `Apply ${activeCount} Filters`
                : "Apply Filters"}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
}
