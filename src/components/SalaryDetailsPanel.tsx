"use client";

import React, { useState } from "react";
import { X, ChevronUp, ChevronDown, MessageCircle, Send, User, Calendar, Paperclip, Camera, AtSign, Share2, ChevronDown as ChevronDownIcon } from "lucide-react";

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  isAnonymous?: boolean;
  upvotes?: number;
  downvotes?: number;
}

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
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "bt2gho1JGx",
      content: "It's OK. Salesforce is a shithole",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      upvotes: 3,
      downvotes: 1,
    },
  ]);

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

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const comment: Comment = {
      id: Date.now().toString(),
      author: "You",
      content: newComment.trim(),
      timestamp: new Date(),
      upvotes: 0,
      downvotes: 0,
    };
    
    setComments(prev => [comment, ...prev]);
    setNewComment("");
    setIsSubmitting(false);
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

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours === 1) return "1 hour ago";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "1 day ago";
    return `${diffInDays} days ago`;
  };

  if (!isOpen || !data) return null;

  return (
    <div className="w-[30%] bg-gradient-to-b from-slate-50 to-slate-100 shadow-lg border border-slate-200 rounded-lg">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-700">
              {data.company_name || data.company}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {data.designation || data.role} • {data.location}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white">
          {/* CTC Breakup Section */}
          <div className="p-4">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-700 mb-4">CTC Breakup</h3>
              {ctcBreakup && (
                <div className="w-full space-y-3">
                  {ctcBreakup.components.map((component, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
                      <span className="text-sm text-slate-700 font-medium">{component.name}</span>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-800">
                          {formatCurrencyCompact(component.amount)}
                        </div>
                        <div className="text-xs text-slate-500">
                          {component.percentage}%
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-3 bg-slate-200 rounded-lg border-2 border-slate-300">
                    <span className="text-sm font-bold text-slate-800">Total CTC</span>
                    <span className="text-lg font-bold text-slate-800">
                      {formatCurrencyCompact(ctcBreakup.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Engagement Bar */}
          <div className="px-4 pb-4">
            <div className="flex items-center gap-6 text-slate-600">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">91</span>
                <ChevronUp className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">6</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium">{comments.length}</span>
                <MessageCircle className="w-4 h-4" />
              </div>
              <Share2 className="w-4 h-4" />
            </div>
          </div>

          {/* Comments Section Header */}
          <div className="px-4 pb-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-700">
                Comments ({comments.length})
              </h3>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="text-sm">Sort by: Best</span>
                <ChevronDownIcon className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="px-4 pb-4">
            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type comment here..."
                className="w-full bg-transparent text-slate-800 placeholder-slate-500 resize-none focus:outline-none"
                rows={3}
              />
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <Paperclip className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-600" />
                  <Camera className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-600" />
                  <AtSign className="w-4 h-4 text-slate-500 cursor-pointer hover:text-slate-600" />
                </div>
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {isSubmitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="px-4 pb-4 space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-slate-700">
                    {comment.author}
                  </span>
                  <span className="text-xs text-slate-500">•</span>
                  <span className="text-xs text-slate-500">
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mb-3">
                  {comment.content}
                </p>
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="flex items-center gap-1">
                    <ChevronUp className="w-3 h-3 cursor-pointer hover:text-slate-600" />
                    <span className="text-xs">{comment.upvotes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChevronDown className="w-3 h-3 cursor-pointer hover:text-slate-600" />
                    <span className="text-xs">{comment.downvotes || 0}</span>
                  </div>
                  <span className="text-xs cursor-pointer hover:text-slate-600">Reply</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
