import { useState, useEffect } from "react";
import useUser from "@/utils/useUser";

const COUNTRIES = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Spain",
  "Australia",
  "Jamaica",
  "Trinidad and Tobago",
  "Barbados",
  "India",
  "Brazil",
  "Mexico",
  "Nigeria",
  "Kenya",
  "South Africa",
  "Philippines",
  "Indonesia",
  "Other",
];

const CATEGORIES = [
  "Design",
  "Engineering",
  "Marketing",
  "Product",
  "Sales",
  "Customer Success",
  "Data",
  "HR",
  "Finance",
  "Operations",
  "Writing",
  "Legal",
];

const EXPERIENCE_LEVELS = [
  "Entry-level",
  "Mid-level",
  "Senior",
  "Lead",
  "Executive",
];
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const TIMEZONES = ["Any", "Americas", "Europe", "Asia-Pacific", "Africa"];

export default function OnboardingPage() {
  const { data: user, loading: userLoading } = useUser();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [applicantCountry, setApplicantCountry] = useState("");
  const [preferredCategories, setPreferredCategories] = useState([]);
  const [experienceLevel, setExperienceLevel] = useState("");
  const [employmentTypes, setEmploymentTypes] = useState([]);
  const [timezone, setTimezone] = useState("");

  useEffect(() => {
    if (!userLoading && user?.has_completed_onboarding) {
      window.location.href = "/";
    }
  }, [user, userLoading]);

  const toggleCategory = (category) => {
    if (preferredCategories.includes(category)) {
      setPreferredCategories(preferredCategories.filter((c) => c !== category));
    } else {
      setPreferredCategories([...preferredCategories, category]);
    }
  };

  const toggleEmploymentType = (type) => {
    if (employmentTypes.includes(type)) {
      setEmploymentTypes(employmentTypes.filter((t) => t !== type));
    } else {
      setEmploymentTypes([...employmentTypes, type]);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicant_country: applicantCountry,
          preferred_categories: preferredCategories,
          experience_level: experienceLevel,
          employment_types: employmentTypes,
          user_timezone: timezone,
        }),
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        alert("Failed to save profile");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#F0F0F0] border-t-[#D4A5A5]"></div>
          <p className="text-[#6B6B6B]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5E6E8] to-[#FAFAFA] p-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Progress */}
        <div className="mb-8 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 w-12 rounded-full transition-all ${
                i === step
                  ? "w-24 bg-[#D4A5A5]"
                  : i < step
                    ? "bg-[#D4A5A5]"
                    : "bg-[#E0E0E0]"
              }`}
            />
          ))}
        </div>

        <div className="rounded-2xl bg-white p-8 shadow-lg">
          {step === 1 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#2D2D2D]">
                Where are you based?
              </h2>
              <p className="mb-6 text-[#6B6B6B]">
                This helps us show you jobs you're eligible for
              </p>

              <select
                value={applicantCountry}
                onChange={(e) => setApplicantCountry(e.target.value)}
                className="w-full rounded-xl border border-[#E0E0E0] bg-white px-4 py-3 text-base outline-none transition-all focus:border-[#D4A5A5] focus:ring-2 focus:ring-[#D4A5A5]/20"
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setStep(2)}
                disabled={!applicantCountry}
                className="mt-6 w-full rounded-xl bg-[#D4A5A5] px-4 py-3.5 font-bold text-white shadow-lg shadow-[#D4A5A5]/30 transition-all hover:bg-[#C4958F] disabled:opacity-50"
              >
                Continue
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#2D2D2D]">
                What do you do?
              </h2>
              <p className="mb-6 text-[#6B6B6B]">Select all that apply</p>

              <div className="mb-6 flex flex-wrap gap-3">
                {CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => toggleCategory(category)}
                    className={`rounded-full border-2 px-5 py-2.5 font-semibold transition-all ${
                      preferredCategories.includes(category)
                        ? "border-[#D4A5A5] bg-[#D4A5A5] text-white"
                        : "border-[#E0E0E0] bg-white text-[#6B6B6B] hover:border-[#D4A5A5]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border-2 border-[#E0E0E0] px-4 py-3.5 font-bold text-[#6B6B6B] transition-all hover:border-[#D4A5A5]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={preferredCategories.length === 0}
                  className="flex-1 rounded-xl bg-[#D4A5A5] px-4 py-3.5 font-bold text-white shadow-lg shadow-[#D4A5A5]/30 transition-all hover:bg-[#C4958F] disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#2D2D2D]">
                Experience level?
              </h2>
              <p className="mb-6 text-[#6B6B6B]">What level are you at?</p>

              <div className="mb-6 space-y-3">
                {EXPERIENCE_LEVELS.map((level) => (
                  <button
                    key={level}
                    onClick={() => setExperienceLevel(level)}
                    className={`w-full rounded-xl border-2 p-4 text-left font-semibold transition-all ${
                      experienceLevel === level
                        ? "border-[#D4A5A5] bg-[#F5E6E8] text-[#2D2D2D]"
                        : "border-[#E0E0E0] bg-white text-[#6B6B6B] hover:border-[#D4A5A5]"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 rounded-xl border-2 border-[#E0E0E0] px-4 py-3.5 font-bold text-[#6B6B6B] transition-all hover:border-[#D4A5A5]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!experienceLevel}
                  className="flex-1 rounded-xl bg-[#D4A5A5] px-4 py-3.5 font-bold text-white shadow-lg shadow-[#D4A5A5]/30 transition-all hover:bg-[#C4958F] disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#2D2D2D]">
                Employment type?
              </h2>
              <p className="mb-6 text-[#6B6B6B]">
                What types of work are you open to?
              </p>

              <div className="mb-6 flex flex-wrap gap-3">
                {EMPLOYMENT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => toggleEmploymentType(type)}
                    className={`rounded-full border-2 px-5 py-2.5 font-semibold transition-all ${
                      employmentTypes.includes(type)
                        ? "border-[#D4A5A5] bg-[#D4A5A5] text-white"
                        : "border-[#E0E0E0] bg-white text-[#6B6B6B] hover:border-[#D4A5A5]"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 rounded-xl border-2 border-[#E0E0E0] px-4 py-3.5 font-bold text-[#6B6B6B] transition-all hover:border-[#D4A5A5]"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(5)}
                  disabled={employmentTypes.length === 0}
                  className="flex-1 rounded-xl bg-[#D4A5A5] px-4 py-3.5 font-bold text-white shadow-lg shadow-[#D4A5A5]/30 transition-all hover:bg-[#C4958F] disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#2D2D2D]">
                Timezone preference?
              </h2>
              <p className="mb-6 text-[#6B6B6B]">
                Where would you like to work?
              </p>

              <div className="mb-6 space-y-3">
                {TIMEZONES.map((tz) => (
                  <button
                    key={tz}
                    onClick={() => setTimezone(tz)}
                    className={`w-full rounded-xl border-2 p-4 text-left font-semibold transition-all ${
                      timezone === tz
                        ? "border-[#D4A5A5] bg-[#F5E6E8] text-[#2D2D2D]"
                        : "border-[#E0E0E0] bg-white text-[#6B6B6B] hover:border-[#D4A5A5]"
                    }`}
                  >
                    {tz}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(4)}
                  className="flex-1 rounded-xl border-2 border-[#E0E0E0] px-4 py-3.5 font-bold text-[#6B6B6B] transition-all hover:border-[#D4A5A5]"
                >
                  Back
                </button>
                <button
                  onClick={handleComplete}
                  disabled={!timezone || loading}
                  className="flex-1 rounded-xl bg-[#D4A5A5] px-4 py-3.5 font-bold text-white shadow-lg shadow-[#D4A5A5]/30 transition-all hover:bg-[#C4958F] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
