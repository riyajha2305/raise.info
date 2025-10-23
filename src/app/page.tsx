'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import salariesData from '@/data/salaries.json';

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
  yoe: number | '';
}

interface FeedbackData {
  message: string;
  rating: number;
}

type SortField = keyof SalaryData;
type SortDirection = 'asc' | 'desc';

export default function PayScope() {
  const [filters, setFilters] = useState<Filters>({
    companyName: '',
    location: '',
    designation: '',
    yoe: ''
  });

  const [sortField, setSortField] = useState<SortField>('avg_salary');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Feedback modal state
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Autocomplete state
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredCompanies, setFilteredCompanies] = useState<string[]>([]);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Get unique values for dropdowns
  const uniqueCompanies = useMemo(() => 
    Array.from(new Set(salaries.map(item => item.company_name))).sort(), 
    []
  );
  
  const uniqueLocations = useMemo(() => 
    Array.from(new Set(salaries.map(item => item.location))).sort(), 
    []
  );
  
  const uniqueDesignations = useMemo(() => 
    Array.from(new Set(salaries.map(item => item.designation))).sort(), 
    []
  );

  // Handle company name autocomplete
  useEffect(() => {
    if (filters.companyName) {
      const filtered = uniqueCompanies.filter(company =>
        company.toLowerCase().includes(filters.companyName.toLowerCase())
      );
      setFilteredCompanies(filtered);
      setShowAutocomplete(filtered.length > 0 && filters.companyName.length > 0);
    } else {
      setShowAutocomplete(false);
    }
  }, [filters.companyName, uniqueCompanies]);

  // Close autocomplete when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = salaries.filter(item => {
      const matchesCompany = item.company_name.toLowerCase().includes(filters.companyName.toLowerCase());
      const matchesLocation = filters.location === '' || item.location === filters.location;
      const matchesDesignation = filters.designation === '' || item.designation === filters.designation;
      const matchesYoe = filters.yoe === '' || item.yoe === filters.yoe;

      return matchesCompany && matchesLocation && matchesDesignation && matchesYoe;
    });

    // Sort data
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });

    return filtered;
  }, [filters, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredAndSortedData.slice(startIndex, endIndex);

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof Filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle company selection from autocomplete
  const handleCompanySelect = (company: string) => {
    setFilters(prev => ({ ...prev, companyName: company }));
    setShowAutocomplete(false);
    setCurrentPage(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      companyName: '',
      location: '',
      designation: '',
      yoe: ''
    });
    setCurrentPage(1);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    const feedback: FeedbackData = {
      message: feedbackMessage,
      rating: feedbackRating
    };
    console.log('Feedback submitted:', feedback);
    alert(`Thank you for your feedback!\nRating: ${feedbackRating}/5\nMessage: ${feedbackMessage}`);
    
    // Reset and close
    setFeedbackMessage('');
    setFeedbackRating(0);
    setIsFeedbackOpen(false);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
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
          className={`w-3 h-3 transition-colors ${isActive ? 'text-[#80A1BA]' : 'text-gray-400 group-hover:text-gray-600'}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
        {isActive && (
          <div className={`text-xs font-bold ${sortDirection === 'asc' ? 'text-[#80A1BA]' : 'text-[#80A1BA]'}`}>
            {sortDirection === 'asc' ? '↑' : '↓'}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#80A1BA] to-[#5A7A8A] bg-clip-text text-transparent mb-2">raise.info</h1>
            <p className="text-lg text-gray-600">Discover salary insights across top companies</p>
          </div>
        </div>
      </header>

      {/* Filters Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Company Name with Autocomplete */}
            <div className="relative" ref={autocompleteRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                placeholder="Search company..."
                value={filters.companyName}
                onChange={(e) => handleFilterChange('companyName', e.target.value)}
                onFocus={() => filters.companyName && setShowAutocomplete(filteredCompanies.length > 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent text-gray-900 placeholder-gray-500"
              />
              {showAutocomplete && filteredCompanies.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {filteredCompanies.map((company) => (
                    <div
                      key={company}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors text-gray-900"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent text-gray-900"
              >
                <option value="">All Locations</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Designation */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <select
                value={filters.designation}
                onChange={(e) => handleFilterChange('designation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent text-gray-900"
              >
                <option value="">All Designations</option>
                {uniqueDesignations.map(designation => (
                  <option key={designation} value={designation}>{designation}</option>
                ))}
              </select>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Years of Exp</label>
              <select
                value={filters.yoe}
                onChange={(e) => handleFilterChange('yoe', e.target.value === '' ? '' : parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent text-gray-900"
              >
                <option value="">All Levels</option>
                {[1, 2, 3, 4, 5, 6, 7].map(yoe => (
                  <option key={yoe} value={yoe}>{yoe} years</option>
                ))}
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="mt-6 flex gap-3 items-center">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Reset Filters
            </button>
            <div className="text-sm text-gray-600 flex items-center">
              Showing <span className="font-semibold mx-1">{filteredAndSortedData.length}</span> results
            </div>
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentData.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-gray-500 text-lg mt-4">No results found</div>
            <p className="text-gray-400 mt-2">Try adjusting your filters to see more results</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 table-fixed">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 sticky top-0">
                    <tr>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-48"
                        onClick={() => handleSort('company_name')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Company</span>
                          <SortIcon field="company_name" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-40"
                        onClick={() => handleSort('designation')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Designation</span>
                          <SortIcon field="designation" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort('location')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Location</span>
                          <SortIcon field="location" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-20"
                        onClick={() => handleSort('yoe')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">YOE</span>
                          <SortIcon field="yoe" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort('min_salary')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Min Salary</span>
                          <SortIcon field="min_salary" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort('max_salary')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Max Salary</span>
                          <SortIcon field="max_salary" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-32"
                        onClick={() => handleSort('avg_salary')}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="flex-1">Avg Salary</span>
                          <SortIcon field="avg_salary" />
                        </div>
                      </th>
                      <th
                        className="group px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors select-none w-24"
                        onClick={() => handleSort('reports')}
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
                        className="hover:bg-blue-50 hover:shadow-sm transition-all duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-[180px]" title={item.company_name}>
                            {item.company_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="truncate max-w-[140px]" title={item.designation}>
                            {item.designation}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div className="truncate max-w-[120px]" title={item.location}>
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
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[#80A1BA]">
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, filteredAndSortedData.length)}</span> of <span className="font-semibold">{filteredAndSortedData.length}</span> results
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        page === currentPage
                          ? 'bg-[#80A1BA] text-white shadow-md'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            © 2024 raise.info. All rights reserved. Salary data is for informational purposes only.
          </div>
        </div>
      </footer>

      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsFeedbackOpen(true)}
        className="fixed bottom-6 right-6 bg-[#80A1BA] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#6B8BA0] hover:shadow-xl transition-all duration-300 flex items-center gap-2 group z-40"
      >
        <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <span className="font-medium">Feedback</span>
      </button>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-opacity-10 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Share Your Feedback</h2>
              <button
                onClick={() => setIsFeedbackOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Rating */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience</label>
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
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your feedback</label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Tell us what you think..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#80A1BA] focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleFeedbackSubmit}
              disabled={feedbackRating === 0 || feedbackMessage.trim() === ''}
              className="w-full bg-[#80A1BA] text-white py-2 px-4 rounded-md hover:bg-[#6B8BA0] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
}