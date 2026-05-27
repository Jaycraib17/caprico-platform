"use client";

import { useEffect, useState, useRef } from "react";
import useUser from "@/utils/useUser";
import Papa from "papaparse";

const STATUS_CONFIG = {
  new: { label: "New", bg: "#D1FAE5", text: "#065F46" },
  duplicate: { label: "Duplicate", bg: "#FEF3C7", text: "#92400E" },
  invalid: { label: "Invalid", bg: "#FEE2E2", text: "#991B1B" },
};

export default function CompaniesImportPage() {
  const { data: user, loading } = useUser();

  const [step, setStep] = useState(1); // 1=upload, 2=preview, 3=done
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [checking, setChecking] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!loading && (!user || !user.is_admin)) {
      window.location.href = "/";
    }
  }, [user, loading]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.name.endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }
    setFile(f);
    setError(null);
  };

  const handlePreview = () => {
    if (!file) return;
    setError(null);
    setChecking(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        if (!parsed.data || parsed.data.length === 0) {
          setError("The CSV file is empty or could not be parsed.");
          setChecking(false);
          return;
        }
        try {
          const res = await fetch("/api/companies/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companies: parsed.data, preview: true }),
          });
          if (!res.ok) {
            const d = await res.json();
            throw new Error(d.error || "Preview failed");
          }
          const data = await res.json();
          setPreviewData(data);
          setStep(2);
        } catch (err) {
          console.error(err);
          setError(err.message || "Failed to analyse file.");
        } finally {
          setChecking(false);
        }
      },
      error: (err) => {
        setError("CSV parse error: " + err.message);
        setChecking(false);
      },
    });
  };

  const handleImport = () => {
    if (!file) return;
    setImporting(true);
    setError(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (parsed) => {
        try {
          const res = await fetch("/api/companies/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ companies: parsed.data, preview: false }),
          });
          if (!res.ok) {
            const d = await res.json();
            throw new Error(d.error || "Import failed");
          }
          const data = await res.json();
          setResults(data.results);
          setStep(3);
        } catch (err) {
          console.error(err);
          setError(err.message || "Import failed.");
        } finally {
          setImporting(false);
        }
      },
      error: (err) => {
        setError("CSV parse error: " + err.message);
        setImporting(false);
      },
    });
  };

  const reset = () => {
    setStep(1);
    setFile(null);
    setError(null);
    setPreviewData(null);
    setResults(null);
    if (inputRef.current) inputRef.current.value = "";
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
        <div className="max-w-4xl mx-auto px-6 py-6">
          <a
            href="/admin"
            className="text-sm text-[#D4A5A5] hover:underline mb-2 block"
          >
            ← Back to Dashboard
          </a>
          <h1 className="text-3xl font-bold text-gray-900">
            CSV Company Import
          </h1>
          <p className="text-gray-600 mt-1">
            Upload a CSV to bulk-import companies
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* Step 1 – Upload */}
        {step === 1 && (
          <>
            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h2 className="text-lg font-bold text-blue-900 mb-3">
                📋 CSV Column Reference
              </h2>
              <div className="grid grid-cols-2 gap-x-8 text-sm text-blue-800 mb-2">
                <span className="font-semibold">CSV column</span>
                <span className="font-semibold">Saves as</span>
                {[
                  ["company_name *", "name"],
                  ["website", "website"],
                  ["region", "region"],
                  ["tags", "tags (comma-separated)"],
                  ["is_active", "is_active (true/false)"],
                ].map(([csv, db]) => (
                  <>
                    <span key={csv} className="font-mono">
                      {csv}
                    </span>
                    <span key={db}>→ {db}</span>
                  </>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">
                * Required. All other columns are optional.
              </p>
            </div>

            {/* File Upload */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Upload CSV File
              </h2>
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-3 file:px-6
                  file:rounded-xl file:border-0
                  file:text-sm file:font-semibold
                  file:bg-[#D4A5A5] file:text-white
                  hover:file:bg-[#C4958F] file:cursor-pointer"
              />
              {file && (
                <p className="mt-3 text-sm text-green-700 font-medium">
                  ✓ {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handlePreview}
              disabled={!file || checking}
              className="w-full py-4 rounded-xl font-bold text-white bg-[#D4A5A5] hover:bg-[#C4958F] disabled:opacity-40 transition-colors"
            >
              {checking ? "Analysing file…" : "Parse & Preview →"}
            </button>
          </>
        )}

        {/* Step 2 – Preview */}
        {step === 2 && previewData && (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Preview — {previewData.total} row
                {previewData.total !== 1 ? "s" : ""} in {file.name}
              </h2>
              <div className="flex flex-wrap gap-3 mb-4">
                {[
                  {
                    label: "Total",
                    value: previewData.total,
                    color: "bg-blue-100 text-blue-800",
                  },
                  {
                    label: "Will Import",
                    value: previewData.new,
                    color: "bg-green-100 text-green-800",
                  },
                  {
                    label: "Duplicates",
                    value: previewData.duplicates,
                    color: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    label: "Invalid",
                    value: previewData.invalid,
                    color: "bg-red-100 text-red-800",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm ${color}`}
                  >
                    {value} {label}
                  </div>
                ))}
              </div>
              {previewData.new === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  ⚠️ No new companies to import — all rows are duplicates or
                  invalid.
                </div>
              )}
            </div>

            {/* Preview table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {[
                        "Status",
                        "Company Name",
                        "Website",
                        "Region",
                        "Tags",
                        "Active",
                        "Note",
                      ].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(previewData.rows || []).slice(0, 50).map((row, i) => {
                      const cfg =
                        STATUS_CONFIG[row.status] || STATUS_CONFIG.invalid;
                      return (
                        <tr
                          key={i}
                          className="hover:bg-gray-50"
                          style={{ opacity: row.status === "new" ? 1 : 0.6 }}
                        >
                          <td className="px-4 py-3">
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{
                                backgroundColor: cfg.bg,
                                color: cfg.text,
                              }}
                            >
                              {cfg.label}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-medium text-gray-900 max-w-[180px] truncate">
                            {row.name || "—"}
                          </td>
                          <td className="px-4 py-3 text-blue-600 max-w-[160px] truncate">
                            {row.website || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {row.region || "—"}
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-w-[160px] truncate">
                            {Array.isArray(row.tags)
                              ? row.tags.join(", ")
                              : row.tags || "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${row.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}
                            >
                              {row.is_active ? "Yes" : "No"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400 max-w-[160px] truncate">
                            {row.reason || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {(previewData.rows || []).length > 50 && (
                <p className="text-center text-gray-400 text-sm py-3 border-t border-gray-100">
                  Showing first 50 of {previewData.rows.length} rows
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-800">
                ⚠️ {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="px-6 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                ← Choose Another File
              </button>
              <button
                onClick={handleImport}
                disabled={importing || previewData.new === 0}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-[#D4A5A5] hover:bg-[#C4958F] disabled:opacity-40 transition-colors"
              >
                {importing
                  ? "Importing…"
                  : `Import ${previewData.new} Compan${previewData.new === 1 ? "y" : "ies"}`}
              </button>
            </div>
          </>
        )}

        {/* Step 3 – Done */}
        {step === 3 && results && (
          <>
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-green-900 mb-4">
                ✅ Import Complete
              </h2>
              <div className="flex flex-wrap gap-3">
                {[
                  {
                    label: "Imported",
                    value: results.imported,
                    color: "bg-green-100 text-green-800",
                  },
                  {
                    label: "Skipped",
                    value: results.skipped,
                    color: "bg-yellow-100 text-yellow-800",
                  },
                  {
                    label: "Failed",
                    value: results.failed,
                    color: "bg-red-100 text-red-800",
                  },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm ${color}`}
                  >
                    {value} {label}
                  </div>
                ))}
              </div>
            </div>

            {results.errors && results.errors.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Errors</h4>
                <ul className="text-sm text-yellow-800 space-y-1 max-h-48 overflow-y-auto">
                  {results.errors.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Import Another File
              </button>
              <a
                href="/admin/companies"
                className="flex-1 py-3 rounded-xl font-bold text-white text-center bg-[#D4A5A5] hover:bg-[#C4958F] transition-colors"
              >
                Manage Companies →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
