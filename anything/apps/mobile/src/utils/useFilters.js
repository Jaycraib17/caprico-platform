import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@capri_filters";

export const useFilters = create((set, get) => ({
  // Filter state
  searchQuery: "",
  categories: [],
  experienceLevels: [],
  employmentTypes: [],
  hiringCountries: [],
  minSalary: "",
  maxSalary: "",
  worldwideOnly: false,

  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),

  setFilters: (filters) => {
    set(filters);
    saveFiltersToStorage(filters);
  },

  clearFilters: () => {
    const defaults = {
      searchQuery: "",
      categories: [],
      experienceLevels: [],
      employmentTypes: [],
      hiringCountries: [],
      minSalary: "",
      maxSalary: "",
      worldwideOnly: false,
    };
    set(defaults);
    saveFiltersToStorage(defaults);
  },

  loadFilters: async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const filters = JSON.parse(stored);
        set(filters);
      }
    } catch (error) {
      console.error("Failed to load filters:", error);
    }
  },

  // Helper to get filter params for API
  getFilterParams: () => {
    const state = get();
    const params = new URLSearchParams();

    if (state.searchQuery) params.append("search", state.searchQuery);
    if (state.categories.length > 0)
      params.append("category", state.categories.join(","));
    if (state.experienceLevels.length > 0)
      params.append("experience_level", state.experienceLevels.join(","));
    if (state.employmentTypes.length > 0)
      params.append("employment_type", state.employmentTypes.join(","));
    if (state.hiringCountries.length > 0)
      params.append("hiring_countries", state.hiringCountries.join(","));
    if (state.minSalary) params.append("salary_min", state.minSalary);
    if (state.maxSalary) params.append("salary_max", state.maxSalary);
    if (state.worldwideOnly) params.append("worldwide_only", "true");

    return params.toString();
  },

  // Check if any filters are active
  hasActiveFilters: () => {
    const state = get();
    return (
      state.categories.length > 0 ||
      state.experienceLevels.length > 0 ||
      state.employmentTypes.length > 0 ||
      state.hiringCountries.length > 0 ||
      state.minSalary !== "" ||
      state.maxSalary !== "" ||
      state.worldwideOnly
    );
  },
}));

async function saveFiltersToStorage(filters) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error("Failed to save filters:", error);
  }
}
