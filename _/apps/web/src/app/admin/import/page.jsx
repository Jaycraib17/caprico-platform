"use client";

import { useEffect, useState } from "react";
import useUser from "@/utils/useUser";
import Papa from "papaparse";

export default function AdminBulkImport() {
  const { data: user, loading } = useUser();
  const [csvData, setCsvData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = "/";
    }
  }, [user, loading]);

  useEffect(() => {
    if (user?.is_admin) {
      fetchCompanies();
    }
  }, [user]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/companies");
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setCsvData(results.data);
        setResults(null);
      },
      error: (error) => {
        alert("Error parsing CSV: " + error.message);
      },
    });
  };

  const handleBulkImport = async () => {
    if (!csvData || csvData.length === 0) {
      alert("No data to import");
      return;
    }

    setImporting(true);
    try {
      const res = await fetch("/api/admin/jobs/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobs: csvData }),
      });

      const data = await res.json();
      setResults(data);
      setCsvData(null);
    } catch (error) {
      console.error(error);
      alert("Import failed: " + error.message);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        company_id: "example-uuid-1234",
        title: "Senior Software Engineer",
        category: "Engineering",
        experience_level: "Senior Level",
        employment_type: "Full-time",
        applicant_countries_allowed: "United States,Canada,United Kingdom",
        hiring_countries: "United States",
        salary_min: "120000",
        salary_max: "180000",
        salary_currency: "USD",
        description: "Job description here",
        responsibilities: "Develop features|Fix bugs|Code reviews",
        requirements: "5+ years experience|React expertise|Team player",
        benefits: "Health insurance|401k|Remote work",
        timezone_compatibility: "EST,PST",
        apply_url: "https://example.com/apply",
      },
    ];

    const csv = Papa.unparse(template);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "job-import-template.csv";
    a.click();
  };

  if (loading || !user?.is_admin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <a
            href="/admin"
            className="text-sm text-[#D4A5A5] hover:underline mb-2 block"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-gray-900">Bulk Job Import</h1>
          <p className="text-gray-600 mt-1">Import multiple jobs from CSV</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3">
            📋 How to Import
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
            <li>Download the CSV template below</li>
            <li>Fill in your job data (use pipe | to separate array values)</li>
            <li>Upload the completed CSV file</li>
            <li>Review the preview and click "Import Jobs"</li>
          </ol>
          <button
            onClick={downloadTemplate}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
          >
            Download CSV Template
          </button>
        </div>

        {/* Available Companies */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Available Company IDs
          </h2>
          <div className="max-h-60 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Company Name
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-700">
                    Company ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{company.name}</td>
                    <td className="px-4 py-2 font-mono text-xs text-gray-600">
                      {company.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Upload CSV File
          </h2>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-3 file:px-6
              file:rounded-xl file:border-0
              file:text-sm file:font-semibold
              file:bg-[#D4A5A5] file:text-white
              hover:file:bg-[#C4958F] file:cursor-pointer"
          />
        </div>

        {/* Preview */}
        {csvData && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Preview ({csvData.length} jobs)
              </h2>
              <button
                onClick={handleBulkImport}
                disabled={importing}
                className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50"
              >
                {importing ? "Importing..." : "Import All Jobs"}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Title
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Category
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Experience
                    </th>
                    <th className="px-4 py-2 text-left font-semibold text-gray-700">
                      Salary
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {csvData.slice(0, 10).map((job, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{job.title}</td>
                      <td className="px-4 py-2">{job.category}</td>
                      <td className="px-4 py-2">{job.experience_level}</td>
                      <td className="px-4 py-2">
                        {job.salary_min && job.salary_max
                          ? `$${parseInt(job.salary_min).toLocaleString()} - $${parseInt(job.salary_max).toLocaleString()}`
                          : "Not specified"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {csvData.length > 10 && (
                <p className="text-center text-gray-500 mt-4 text-sm">
                  Showing first 10 of {csvData.length} jobs
                </p>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Import Results
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                <span className="text-green-800 font-semibold">
                  ✓ Successfully Imported
                </span>
                <span className="text-2xl font-bold text-green-600">
                  {results.success}
                </span>
              </div>
              {results.failed > 0 && (
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                  <span className="text-red-800 font-semibold">✗ Failed</span>
                  <span className="text-2xl font-bold text-red-600">
                    {results.failed}
                  </span>
                </div>
              )}
              {results.errors && results.errors.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Errors:</h3>
                  <div className="space-y-1 max-h-60 overflow-y-auto">
                    {results.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="text-sm text-red-600 bg-red-50 p-2 rounded"
                      >
                        Row {error.row}: {error.message}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
