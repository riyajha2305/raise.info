"use client";

import React, { useState, useMemo } from "react";
import { X } from "lucide-react";
import { CommentSection } from "./comments";

interface SalaryData {
  company_name?: string;
  company?: string;
  designation?: string;
  role?: string;
  location: string;
  min_salary?: number;
  max_salary?: number;
  avg_salary?: number;
  stipend_min?: number;
  stipend_max?: number;
  stipend_avg?: number;
  yoe?: number;
  reports: number;
  university?: string;
  employment_type?: string;
  duration?: string;
  year?: number;
}

interface SalaryDetailsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: SalaryData | null;
}

export default function SalaryDetailsPanel({ isOpen, onClose, data }: SalaryDetailsPanelProps) {
  // Generate a unique salary ID based on the data
  const salaryId = useMemo(() => {
    if (!data) return "";
    const company = data.company_name || data.company || "unknown";
    const role = data.designation || data.role || "unknown";
    const location = data.location || "unknown";
    return `${company}-${role}-${location}`.toLowerCase().replace(/\s+/g, "-");
  }, [data]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyCompact = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    return formatCurrency(amount);
  };

  const calculateCTCBreakup = () => {
    if (!data) return null;
    
    const baseSalary = data.avg_salary || data.stipend_avg || 0;
    const isInternship = !!data.stipend_avg;
    
    if (isInternship) {
      return {
        base: baseSalary,
        total: baseSalary,
        components: [
          { name: "Monthly Stipend", amount: baseSalary, percentage: 100 },
        ]
      };
    }

    // For full-time roles, calculate typical CTC breakup
    const base = Math.round(baseSalary * 0.7); // 70% base salary
    const hra = Math.round(baseSalary * 0.2); // 20% HRA
    const allowances = Math.round(baseSalary * 0.1); // 10% other allowances
    
    return {
      base,
      hra,
      allowances,
      total: baseSalary,
      components: [
        { name: "Base Salary", amount: base, percentage: 70 },
        { name: "HRA", amount: hra, percentage: 20 },
        { name: "Other Allowances", amount: allowances, percentage: 10 },
      ]
    };
  };

  const ctcBreakup = calculateCTCBreakup();

  if (!isOpen || !data) return null;

  return (
    <div className="w-[30%] bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {data.company_name || data.company}
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              {data.designation || data.role} • {data.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* CTC Breakup Section */}
          <div className="px-6 py-3">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-3 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2">CTC Breakup</h3>
              {ctcBreakup && (
                <div className="w-full space-y-2">
                  {ctcBreakup.components.map((component, index) => (
                    <div key={index} className="flex items-center justify-between px-3 py-2 bg-white rounded-md border border-gray-200 shadow-sm h-12">
                      <span className="text-xs text-gray-700 font-medium">{component.name}</span>
                      <div className="text-right">
                        <div className="text-xs font-semibold text-gray-900">
                          {formatCurrencyCompact(component.amount)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {component.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-200 rounded-md border-2 border-slate-300 h-12">
                    <span className="text-xs font-bold text-gray-900">Total CTC</span>
                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrencyCompact(ctcBreakup.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="px-6 pb-4">
            <CommentSection
              salaryId={salaryId}
              upvoteCount={91}
              downvoteCount={6}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
