"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import SalaryDetailsPanel from "@/components/SalaryDetailsPanel";

interface UniversityData {
  university: string;
  company: string;
  role: string;
  employment_type: "Full-time" | "Internship";
  salary_min: number;
  salary_max: number;
  salary_avg: number;
  reports: number;
  year: number;
  location: string;
}

interface Filters {
  university: string;
  company: string;
  role: string;
  employmentType: string;
  location: string;
  year: string;
  salaryMin: number;
  salaryMax: number;
}

type SortField = keyof UniversityData;
type SortDirection = "asc" | "desc";

export default function UniversityDataPage() {
  // Sample university data
  const universityData: UniversityData[] = [
    {
      university: "Stanford University",
      company: "Google",
      role: "Software Engineer",
      employment_type: "Full-time",
      salary_min: 120000,
      salary_max: 180000,
      salary_avg: 150000,
      reports: 45,
      year: 2024,
      location: "Mountain View, CA",
    },
    {
      university: "Stanford University",
      company: "Google",
      role: "Software Engineering Intern",
      employment_type: "Internship",
      salary_min: 6000,
      salary_max: 8000,
      salary_avg: 7000,
      reports: 38,
      year: 2024,
      location: "Mountain View, CA",
    },
    {
      university: "UC Berkeley",
      company: "Microsoft",
      role: "Product Manager",
      employment_type: "Full-time",
      salary_min: 110000,
      salary_max: 160000,
      salary_avg: 135000,
      reports: 32,
      year: 2024,
      location: "Seattle, WA",
    },
    {
      university: "UC Berkeley",
      company: "Microsoft",
      role: "Product Management Intern",
      employment_type: "Internship",
      salary_min: 5500,
      salary_max: 7500,
      salary_avg: 6500,
      reports: 28,
      year: 2024,
      location: "Seattle, WA",
    },
    {
      university: "MIT",
      company: "Amazon",
      role: "Data Scientist",
      employment_type: "Full-time",
      salary_min: 130000,
      salary_max: 190000,
      salary_avg: 160000,
      reports: 28,
      year: 2024,
      location: "Seattle, WA",
    },
    {
      university: "MIT",
      company: "Amazon",
      role: "Data Science Intern",
      employment_type: "Internship",
      salary_min: 5000,
      salary_max: 7000,
      salary_avg: 6000,
      reports: 24,
      year: 2024,
      location: "Seattle, WA",
    },
    {
      university: "Carnegie Mellon",
      company: "Meta",
      role: "Frontend Engineer",
      employment_type: "Full-time",
      salary_min: 115000,
      salary_max: 170000,
      salary_avg: 142500,
      reports: 41,
      year: 2024,
      location: "Menlo Park, CA",
    },
    {
      university: "Carnegie Mellon",
      company: "Meta",
      role: "Frontend Development Intern",
      employment_type: "Internship",
      salary_min: 5800,
      salary_max: 7800,
      salary_avg: 6800,
      reports: 35,
      year: 2024,
      location: "Menlo Park, CA",
    },
    {
      university: "Stanford University",
      company: "Apple",
      role: "iOS Engineer",
      employment_type: "Full-time",
      salary_min: 125000,
      salary_max: 185000,
      salary_avg: 155000,
      reports: 35,
      year: 2024,
      location: "Cupertino, CA",
    },
    {
      university: "Stanford University",
      company: "Apple",
      role: "iOS Development Intern",
      employment_type: "Internship",
      salary_min: 6200,
      salary_max: 8200,
      salary_avg: 7200,
      reports: 29,
      year: 2024,
      location: "Cupertino, CA",
    },
    {
      university: "UC Berkeley",
      company: "Netflix",
      role: "Backend Engineer",
      employment_type: "Full-time",
      salary_min: 120000,
      salary_max: 180000,
      salary_avg: 150000,
      reports: 22,
      year: 2024,
      location: "Los Gatos, CA",
    },
    {
      university: "UC Berkeley",
      company: "Netflix",
      role: "Backend Engineering Intern",
      employment_type: "Internship",
      salary_min: 5500,
      salary_max: 7500,
      salary_avg: 6500,
      reports: 18,
      year: 2024,
      location: "Los Gatos, CA",
    },
    {
      university: "MIT",
      company: "Uber",
      role: "Machine Learning Engineer",
      employment_type: "Full-time",
      salary_min: 135000,
      salary_max: 195000,
      salary_avg: 165000,
      reports: 19,
      year: 2024,
      location: "San Francisco, CA",
    },
    {
      university: "MIT",
      company: "Uber",
      role: "Machine Learning Intern",
      employment_type: "Internship",
      salary_min: 5200,
      salary_max: 7200,
      salary_avg: 6200,
      reports: 15,
      year: 2024,
      location: "San Francisco, CA",
    },
    {
      university: "Stanford University",
      company: "Airbnb",
      role: "UX Designer",
      employment_type: "Full-time",
      salary_min: 100000,
      salary_max: 150000,
      salary_avg: 125000,
      reports: 15,
      year: 2024,
      location: "San Francisco, CA",
    },
    {
      university: "Stanford University",
      company: "Airbnb",
      role: "UX Design Intern",
      employment_type: "Internship",
      salary_min: 4800,
      salary_max: 6800,
      salary_avg: 5800,
      reports: 12,
      year: 2024,
      location: "San Francisco, CA",
    },
  ];

  // Calculate salary range from data
  const salaryRange = useMemo(() => {
    const allSalaries = universityData.map((item) => item.salary_avg);
    return {
      min: Math.floor(Math.min(...allSalaries)),
      max: Math.ceil(Math.max(...allSalaries)),
    };
  }, []);

  const [filters, setFilters] = useState<Filters>({
    university: "",
    company: "",
    role: "",
    employmentType: "",
    location: "",
    year: "",
    salaryMin: 0,
    salaryMax: 200000,
  });

  const [sortField, setSortField] = useState<SortField>("salary_avg");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Side panel state - open by default for first row
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(true);
  const [selectedUniversityData, setSelectedUniversityData] = useState<UniversityData | null>(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(0); // Track selected row index

  // Handle row click to open side panel
  const handleRowClick = (item: UniversityData, index: number) => {
    setSelectedUniversityData(item);
    setSelectedRowIndex(index);
    setIsSidePanelOpen(true);
  };

  // Handle side panel close
  const handleCloseSidePanel = () => {
    setIsSidePanelOpen(false);
    setSelectedUniversityData(null);
  };


  // Handle company name autocomplete
  const handleCompanyNameChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      company: value,
    }));

    if (value) {
      const filtered = uniqueCompanies.filter((company) =>
        company.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCompanies(filtered);
      setShowAutocomplete(filtered.length > 0);
    } else {
      setShowAutocomplete(false);
    }
    setCurrentPage(1);
  };

  const handleCompanySelect = (company: string) => {
    setFilters((prev) => ({
      ...prev,
      company: company,
    }));
    setShowAutocomplete(false);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      university: "",
      company: "",
      role: "",
      employmentType: "",
      location: "",
      year: "",
      salaryMin: salaryRange.min,
      salaryMax: salaryRange.max,
    });
    setCurrentPage(1);
  };

  // Handle salary range change
  const handleSalaryRangeChange = (value: number | number[]) => {
    const values = Array.isArray(value) ? value : [value, value];
    setFilters((prev) => ({
      ...prev,
      salaryMin: values[0],
      salaryMax: values[1],
    }));
    setCurrentPage(1);
  };

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = universityData.filter((item) => {
      return (
        (filters.university === "" ||
          item.university.toLowerCase().includes(filters.university.toLowerCase())) &&
        (filters.company === "" ||
          item.company.toLowerCase().includes(filters.company.toLowerCase())) &&
        (filters.role === "" ||
          item.role.toLowerCase().includes(filters.role.toLowerCase())) &&
        (filters.employmentType === "" || item.employment_type === filters.employmentType) &&
        (filters.location === "" ||
          item.location.toLowerCase().includes(filters.location.toLowerCase())) &&
        (filters.year === "" || item.year.toString() === filters.year) &&
        (item.salary_avg >= filters.salaryMin && item.salary_avg <= filters.salaryMax)
      );
    });

    // Sort the data
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
    if (filteredAndSortedData.length > 0 && !selectedUniversityData) {
      setSelectedUniversityData(filteredAndSortedData[0]);
      setSelectedRowIndex(0);
    }
  }, [filteredAndSortedData, selectedUniversityData]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  const uniqueUniversities = useMemo(
    () => [...new Set(universityData.map((item) => item.university))].sort(),
    []
  );

  const uniqueCompanies = useMemo(
    () => [...new Set(universityData.map((item) => item.company))].sort(),
    []
  );

  const uniqueRoles = useMemo(
    () => [...new Set(universityData.map((item) => item.role))].sort(),
    []
  );

  const uniqueLocations = useMemo(
    () => [...new Set(universityData.map((item) => item.location))].sort(),
    []
  );

  const uniqueYears = useMemo(
    () => [...new Set(universityData.map((item) => item.year))].sort((a, b) => b - a),
    []
  );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getEmploymentTypeColor = (type: string) => {
    return type === "Full-time"
      ? "bg-green-100 text-green-800"
      : "bg-blue-100 text-blue-800";
  };

  // Sort icon component - consistent icon that doesn't change
  const SortIcon = ({ field }: { field: SortField }) => {
    const isActive = sortField === field;
    return (
      <div className="flex flex-col items-center justify-center w-4 h-4">
        <svg
          className={`w-3 h-3 transition-colors ${isActive
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
            className={`text-xs font-bold ${sortDirection === "asc" ? "text-slate-600" : "text-slate-600"
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
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-slate-700 mb-4">
              Which College Gets You Paid More?
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Compare salaries by university. IIT vs NIT vs BITS - see who pays what.
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
              <h3 className="text-lg font-semibold text-gray-900">Filter University Data</h3>
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
            {/* University */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                University
              </label>
              <select
                value={filters.university}
                onChange={(e) => handleFilterChange("university", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Universities</option>
                {uniqueUniversities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </div>

            {/* Company with Autocomplete */}
            <div className="relative" ref={autocompleteRef}>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Company
              </label>
              <input
                type="text"
                placeholder="Search company..."
                value={filters.company}
                onChange={(e) => handleCompanyNameChange(e.target.value)}
                onFocus={() =>
                  filters.company &&
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

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Role
              </label>
              <select
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Roles</option>
                {uniqueRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Employment Type */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Employment Type
              </label>
              <select
                value={filters.employmentType}
                onChange={(e) => handleFilterChange("employmentType", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
              </select>
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

            {/* Year */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wide">
                Year
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange("year", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-gray-900 bg-white transition-colors"
              >
                <option value="">All Years</option>
                {uniqueYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Salary Range Slider */}
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
                  <p className="text-xs text-gray-600">Filter by annual salary</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-slate-700">
                  {formatCurrency(filters.salaryMin)} - {formatCurrency(filters.salaryMax)}
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
                onChange={handleSalaryRangeChange}
                trackStyle={[{ backgroundColor: "#64748b", height: 6 }]}
                handleStyle={[
                  { backgroundColor: "#64748b", borderColor: "#64748b", width: 20, height: 20, marginTop: -7, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
                  { backgroundColor: "#64748b", borderColor: "#64748b", width: 20, height: 20, marginTop: -7, boxShadow: "0 2px 4px rgba(0,0,0,0.1)" },
                ]}
                railStyle={{ backgroundColor: "#e2e8f0", height: 6 }}
              />
              <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
                <span>Min: {formatCurrency(salaryRange.min)}</span>
                <span>Max: {formatCurrency(salaryRange.max)}</span>
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
            {filteredAndSortedData.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
                <svg
                  className="mx-auto h-16 w-16 text-neutral-400"
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
                <div className="text-neutral-600 text-xl font-semibold mt-6">No results found</div>
                <p className="text-neutral-500 mt-2">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
                <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200 flex-1 flex flex-col">
                  <div className="overflow-x-auto flex-1 flex flex-col">
                    <table className="min-w-full divide-y divide-gray-200 flex-1">
                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0">
                      <tr>
                        <th
                          className="group px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors select-none w-48"
                          onClick={() => handleSort("university")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">University</span>
                            <SortIcon field="university" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-40"
                          onClick={() => handleSort("company")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Company</span>
                            <SortIcon field="company" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                          onClick={() => handleSort("role")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Role</span>
                            <SortIcon field="role" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-20"
                          onClick={() => handleSort("employment_type")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Type</span>
                            <SortIcon field="employment_type" />
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
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                          onClick={() => handleSort("salary_min")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Min Salary</span>
                            <SortIcon field="salary_min" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                          onClick={() => handleSort("salary_max")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Max Salary</span>
                            <SortIcon field="salary_max" />
                          </div>
                        </th>
                        <th
                          className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                          onClick={() => handleSort("salary_avg")}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="flex-1">Avg Salary</span>
                            <SortIcon field="salary_avg" />
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
                          key={`${item.university}-${item.company}-${item.role}-${index}`}
                          className={`hover:bg-slate-50 hover:shadow-sm transition-all duration-150 cursor-pointer ${
                            selectedRowIndex === index ? 'bg-slate-200 border-2 border-slate-300' : ''
                          }`}
                          onClick={() => handleRowClick(item, index)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-semibold text-gray-900">
                              {item.university}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.company}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.role}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getEmploymentTypeColor(item.employment_type)}`}>
                              {item.employment_type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.location}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {formatCurrency(item.salary_min)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {formatCurrency(item.salary_max)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-bold text-slate-600">
                              {formatCurrency(item.salary_avg)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              {item.reports}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            )}
          </div>

          {/* Side Panel Section - 30% when open */}
          {isSidePanelOpen && (
            <SalaryDetailsPanel
              isOpen={isSidePanelOpen}
              onClose={handleCloseSidePanel}
              data={selectedUniversityData}
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${page === currentPage
                          ? "bg-slate-500 text-white shadow-md"
                          : "text-gray-700 bg-white border border-gray-300 hover:bg-slate-50"
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
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
