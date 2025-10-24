"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import salariesData from "@/data/salaries.json";
import { useLanguage } from "@/contexts/LanguageContext";
import SalaryDetailsPanel from "@/components/SalaryDetailsPanel";

interface SalaryData {
  company_name: string;
  designation: string;
  location: string;
  yoe: number;
  min_salary: number;
  max_salary: number;
  avg_salary: number;
  reports: number;
}

const salaries: SalaryData[] = salariesData as SalaryData[];

interface Filters {
  companyName: string;
  location: string;
  designation: string;
  yoe: number | "";
  salaryMin: number;
  salaryMax: number;
}

type SortField = keyof SalaryData;
type SortDirection = "asc" | "desc";

export default function PayScope() {
  const { t } = useLanguage();
  
  // Calculate salary range from data
  const salaryRange = useMemo(() => {
    const allSalaries = salaries.map((item) => item.avg_salary);
    return {
      min: Math.floor(Math.min(...allSalaries)),
      max: Math.ceil(Math.max(...allSalaries)),
    };
  }, []);

  const [filters, setFilters] = useState<Filters>({
    companyName: "",
    location: "",
    designation: "",
    yoe: "",
    salaryMin: 0,
    salaryMax: 100000000,
  });

  const [sortField, setSortField] = useState<SortField>("avg_salary");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Feedback modal state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Side panel state - open by default for first row
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [selectedSalaryData, setSelectedSalaryData] = useState<SalaryData | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); // Track selected row index

  // Handle row click to open side panel
  const handleRowClick = (item: SalaryData, index: number) => {
    setSelectedSalaryData(item);
    setSelectedRowIndex(index);
    setIsSidePanelOpen(true);
  };

  // Handle side panel close
  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
    setSelectedSalaryData(null);
  };


  // Get unique values for dropdowns
  const uniqueCompanies = useMemo(
    () => Array.from(new Set(salaries.map((item) => item.company_name))).sort(),
    []
  );

  const uniqueLocations = useMemo(
    () => Array.from(new Set(salaries.map((item) => item.location))).sort(),
    []
  );

  const uniqueDesignations = useMemo(
    () => Array.from(new Set(salaries.map((item) => item.designation))).sort(),
    []
  );

  // Handle company name autocomplete
  useEffect(() => {
    if (filters.companyName) {
      const filtered = uniqueCompanies.filter((company) =>
        company.toLowerCase().includes(filters.companyName.toLowerCase())
      );
      setFilteredCompanies(filtered);
      setShowAutocomplete(
        filtered.length > 0 && filters.companyName.length > 0
      );
    } else {
      setShowAutocomplete(false);
    }
  }, [filters.companyName, uniqueCompanies]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = salaries.filter((item) => {
      const matchesCompany = item.company_name
        .toLowerCase()
        .includes(filters.companyName.toLowerCase());
      const matchesLocation =
        filters.location === "" || item.location === filters.location;
      const matchesDesignation =
        filters.designation === "" || item.designation === filters.designation;
      const matchesYoe = filters.yoe === "" || item.yoe === filters.yoe;
      const matchesSalary =
        item.avg_salary >= filters.salaryMin &&
        item.avg_salary <= filters.salaryMax;

      return (
        matchesCompany &&
        matchesLocation &&
        matchesDesignation &&
        matchesYoe &&
        matchesSalary
      );
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  }, [filters, sortField, sortDirection]);

  // Set first row as selected by default when component mounts
  useEffect(() => {
    if (filteredAndSortedData.length > 0 && !selectedSalaryData) {
      setSelectedSalaryData(filteredAndSortedData[0]);
      setSelectedRowIndex(0);
    }
  }, [filteredAndSortedData, selectedSalaryData]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle company selection from autocomplete
  const handleCompanySelect = (company: string) => {
    setFilters((prev) => ({ ...prev, companyName: company }));
    setShowAutocomplete(false);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      companyName: "",
      location: "",
      designation: "",
      yoe: "",
      salaryMin: salaryRange.min,
      salaryMax: salaryRange.max,
    });
    setCurrentPage(1);
  };

  // Handle salary range change
  const handleSalaryRangeChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      salaryMin: values[0],
      salaryMax: values[1],
    }));
    setCurrentPage(1);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async () => {
    setIsSubmittingFeedback(true);
    setFeedbackStatus("idle");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key:
            process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY ||
            "YOUR_ACCESS_KEY_HERE",
          subject: "New Feedback from salaris.fyi",
          from_name: "salaris.fyi Feedback",
          message: `Rating: ${feedbackRating}/5\n\nFeedback:\n${feedbackMessage}`,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFeedbackStatus("success");
        setFeedbackMessage("");
        setFeedbackRating(0);
        setTimeout(() => {
          setFeedbackStatus("idle");
          setIsFeedbackOpen(false);
        }, 2000);
      } else {
        setFeedbackStatus("error");
      }
    } catch (error) {
      console.error("Feedback submission error:", error);
      setFeedbackStatus("error");
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format currency compact
  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  // Sort icon component - consistent icon that doesn't change
  const SortIcon = ({ field }: { field: SortField }) => {
    const isActive = sortField === field;
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4">
        <svg
          className={`w-3 h-3 transition-colors ${
            isActive
              ? "text-slate-600"
              : "text-gray-400 group-hover:text-gray-600"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
          />
        </svg>
        {isActive && (
          <div
            className={`text-xs font-bold ${
              sortDirection === "asc" ? "text-slate-600" : "text-slate-600"
            }`}
          >
            {sortDirection === "asc" ? "↑" : "↓"}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-700 mb-4">
              Are You Getting Paid What You Deserve?
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Real salary data from 1000+ companies. Stop guessing, start negotiating.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Filter Results</h3>
            </div>
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset Filters
            </button>
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Company Name with Autocomplete */}
            <div className="relative" ref={autocompleteRef}>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Company
              </label>
              <input
                type="text"
                placeholder="Search company..."
                value={filters.companyName}
                onChange={(e) =>
                  handleFilterChange("companyName", e.target.value)
                }
                onFocus={() =>
                  filters.companyName &&
                  setShowAutocomplete(filteredCompanies.length > 0)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 placeholder-gray-500 bg-white transition-colors"
              />
              {showAutocomplete && filteredCompanies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company}
                      className="px-3 py-2 text-sm hover:bg-slate-50 cursor-pointer transition-colors text-gray-900 border-b border-gray-100 last:border-b-0"
                      onClick={() => handleCompanySelect(company)}
                    >
                      {company}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Location
              </label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Designation
              </label>
              <select
                value={filters.designation}
                onChange={(e) =>
                  handleFilterChange("designation", e.target.value)
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Designations</option>
                {uniqueDesignations.map((designation) => (
                  <option key={designation} value={designation}>
                    {designation}
                  </option>
                ))}
              </select>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Years of Exp
              </label>
              <select
                value={filters.yoe}
                onChange={(e) =>
                  handleFilterChange(
                    "yoe",
                    e.target.value === "" ? "" : parseInt(e.target.value)
                  )
                }
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Levels</option>
                {[1, 2, 3, 4, 5, 6, 7].map((yoe) => (
                  <option key={yoe} value={yoe}>
                    {yoe} years
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Range Filter */}
          <div className="mt-4 bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Salary Range</h4>
                  <p className="text-xs text-gray-600">Filter by average salary</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-700">
                  {formatCurrencyCompact(filters.salaryMin)} - {formatCurrencyCompact(filters.salaryMax)}
                </div>
                <div className="text-xs text-gray-500">Current range</div>
              </div>
            </div>
            
            <div className="px-2">
              <Slider
                range
                min={salaryRange.min}
                max={salaryRange.max}
                value={[filters.salaryMin, filters.salaryMax]}
                onChange={(value) => handleSalaryRangeChange(value as number[])}
                styles={{
                  track: { backgroundColor: "#64748b", height: 6 },
                  rail: { backgroundColor: "#e2e8f0", height: 6 },
                  handle: {
                    backgroundColor: "#64748b",
                    borderColor: "#64748b",
                    width: 20,
                    height: 20,
                    marginTop: -7,
                    opacity: 1,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  },
                }}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Min: {formatCurrencyCompact(salaryRange.min)}</span>
                <span>Max: {formatCurrencyCompact(salaryRange.max)}</span>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-600 flex items-center">
              Showing{" "}
              <span className="font-semibold mx-1 text-slate-600">
                {filteredAndSortedData.length}
              </span>{" "}
              results
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Table and Side Panel Container */}
        <div className={`flex gap-4 transition-all duration-500 ease-in-out min-h-[600px] ${isSidePanelOpen ? '' : ''}`}>
          {/* Table Section - 70% when panel is open, 100% when closed */}
          <div className={`transition-all duration-500 ease-in-out flex flex-col ${isSidePanelOpen ? 'w-[70%]' : 'w-full'}`}>
        {currentData.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-white rounded-xl shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-16 w-16 text-neutral-400 dark:text-neutral-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="text-gray-600 text-xl font-semibold mt-6">No results found</div>
            <p className="text-neutral-500 dark:text-neutral-500 mt-2">
              Try adjusting your filters to see more results
            </p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white dark:bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 flex-1 flex flex-col">
              <div className="overflow-x-auto flex-1 flex flex-col">
                <table className="min-w-full divide-y divide-gray-200 table-fixed flex-1">
                  <thead className="bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0">
                    <tr>
                      <th
                        className="group px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors select-none w-48"
                        onClick={() => handleSort("company_name")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Company</span>
                          <SortIcon field="company_name" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-40"
                        onClick={() => handleSort("designation")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Designation</span>
                          <SortIcon field="designation" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort("location")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Location</span>
                          <SortIcon field="location" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-20"
                        onClick={() => handleSort("yoe")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">YOE</span>
                          <SortIcon field="yoe" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort("min_salary")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Min Salary</span>
                          <SortIcon field="min_salary" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort("max_salary")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Max Salary</span>
                          <SortIcon field="max_salary" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort("avg_salary")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Avg Salary</span>
                          <SortIcon field="avg_salary" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-24"
                        onClick={() => handleSort("reports")}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Reports</span>
                          <SortIcon field="reports" />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentData.map((item, index) => (
                      <tr
                        key={`${item.company_name}-${item.designation}-${index}`}
                        className={`hover:bg-slate-50 hover:shadow-sm transition-all duration-150 cursor-pointer ${
                          selectedRowIndex === index ? 'bg-slate-200 border-2 border-slate-300' : ''
                        }`}
                        onClick={() => handleRowClick(item, index)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="text-sm font-semibold text-gray-900 truncate max-w-[180px]"
                            title={item.company_name}
                          >
                            {item.company_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div
                            className="truncate max-w-[140px]"
                            title={item.designation}
                          >
                            {item.designation}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div
                            className="truncate max-w-[120px]"
                            title={item.location}
                          >
                            {item.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.yoe}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(item.min_salary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {formatCurrency(item.max_salary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-600">
                          {formatCurrency(item.avg_salary)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {item.reports}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}
          </div>

          {/* Side Panel Section - 40% when open */}
          {isSidePanelOpen && (
            <SalaryDetailsPanel
              isOpen={isSidePanelOpen}
              onClose={handleCloseSidePanel}
              data={selectedSalaryData}
            />
          )}
        </div>

        {/* Pagination - Outside table/side panel container */}
        {currentData.length > 0 && totalPages > 1 && (
          <div className="max-w-7xl mx-auto pb-8 mt-8">
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold text-slate-600">{startIndex + 1}</span> to{" "}
                <span className="font-semibold text-slate-600">
                  {Math.min(endIndex, filteredAndSortedData.length)}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-600">
                  {filteredAndSortedData.length}
                </span>{" "}
                results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-white border border-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                        page === currentPage
                          ? "bg-slate-500 text-white shadow-md"
                          : "text-gray-700 bg-white dark:bg-white border border-gray-300 hover:bg-slate-50 dark:hover:bg-white"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-white border border-gray-300 rounded-lg hover:bg-slate-50 dark:hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>


      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 bg-slate-500 text-white px-6 py-4 rounded-full shadow-lg hover:bg-slate-600 hover:shadow-xl transition-all duration-300 flex items-center gap-3 group z-40 animate-scale-in"
      >
        <svg
          className="w-5 h-5 group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
        <span className="font-medium">Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all animate-scale-in border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {t("feedback.title")}
              </h2>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-white"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("feedback.rating")}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setFeedbackRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform hover:scale-125"
                  >
                    <svg
                      className={`w-8 h-8 ${
                        star <= (hoveredStar || feedbackRating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Feedback Message */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t("feedback.message")}
              </label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder={t("feedback.placeholder")}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500 bg-white dark:bg-white transition-colors"
              />
            </div>

            {/* Status Messages */}
            {feedbackStatus === "success" && (
              <div className="bg-success-50 border border-success-200 text-success-600 px-4 py-3 rounded-lg mb-4">
                Thank you! Your feedback has been sent successfully.
              </div>
            )}

            {feedbackStatus === "error" && (
              <div className="bg-error-50 border border-error-200 text-error-600 px-4 py-3 rounded-lg mb-4">
                Oops! Something went wrong. Please try again.
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleFeedbackSubmit}
              disabled={
                feedbackRating === 0 ||
                feedbackMessage.trim() === "" ||
                isSubmittingFeedback
              }
              className="w-full bg-slate-500 text-white py-3 px-4 rounded-lg hover:bg-slate-600 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-semibold shadow-sm hover:shadow-md"
            >
              {isSubmittingFeedback ? t("feedback.sending") : t("feedback.submit")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
