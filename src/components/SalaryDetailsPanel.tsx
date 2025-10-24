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
    {
      id: "2",
      author: "tech_guru_2024",
      content: "Great company culture and learning opportunities. The stipend is competitive for the industry.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      upvotes: 8,
      downvotes: 0,
    },
    {
      id: "3",
      author: "intern_insider",
      content: "Work-life balance could be better, but the projects are really interesting.",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      upvotes: 5,
      downvotes: 2,
    },
    {
      id: "4",
      author: "cs_student_99",
      content: "Mentorship program is excellent. Learned a lot about real-world software development.",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
      upvotes: 12,
      downvotes: 0,
    },
    {
      id: "5",
      author: "data_analyst_pro",
      content: "The data science team is amazing. Great exposure to ML projects and cutting-edge tech.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
      upvotes: 7,
      downvotes: 1,
    },
    {
      id: "6",
      author: "product_mind",
      content: "Product management internship here is top-notch. You get to work on features used by millions.",
      timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000), // 16 hours ago
      upvotes: 9,
      downvotes: 0,
    },
    {
      id: "7",
      author: "design_enthusiast",
      content: "UX design team is very collaborative. Great place to build your portfolio.",
      timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
      upvotes: 6,
      downvotes: 0,
    },
    {
      id: "8",
      author: "backend_dev",
      content: "Backend engineering challenges are complex but rewarding. Good learning curve.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      upvotes: 4,
      downvotes: 1,
    },
  ]);
  
  // Comments pagination state
  const [currentCommentPage, setCurrentCommentPage] = useState(1);
  const commentsPerPage = 3;

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

  // Comments pagination logic
  const totalCommentPages = Math.ceil(comments.length / commentsPerPage);
  const startCommentIndex = (currentCommentPage - 1) * commentsPerPage;
  const endCommentIndex = startCommentIndex + commentsPerPage;
  const currentComments = comments.slice(startCommentIndex, endCommentIndex);

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

          {/* Engagement Bar */}
          <div className="px-6 pb-2">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">91</span>
                <ChevronUp className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">6</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium">{comments.length}</span>
                <MessageCircle className="w-3 h-3" />
              </div>
              <Share2 className="w-3 h-3" />
            </div>
          </div>

          {/* Comments Section Header */}
          <div className="px-6 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Comments ({comments.length})
              </h3>
              <div className="flex items-center gap-1 text-gray-500">
                <span className="text-xs">Sort by: Best</span>
                <ChevronDownIcon className="w-3 h-3" />
              </div>
            </div>
          </div>

          {/* Comment Input */}
          <div className="px-6 pb-3">
            <div className="bg-gray-50 rounded-lg p-2 border border-gray-200">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Type comment here..."
                className="w-full bg-transparent text-gray-800 placeholder-gray-500 resize-none focus:outline-none text-sm"
                rows={2}
              />
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <Paperclip className="w-3 h-3 text-gray-500 cursor-pointer hover:text-gray-600" />
                  <Camera className="w-3 h-3 text-gray-500 cursor-pointer hover:text-gray-600" />
                  <AtSign className="w-3 h-3 text-gray-500 cursor-pointer hover:text-gray-600" />
                </div>
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim() || isSubmitting}
                  className="px-3 py-1.5 bg-slate-500 text-white rounded-md hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                >
                  {isSubmitting ? "Posting..." : "Comment"}
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="px-6 pb-4 space-y-3">
            {currentComments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {comment.author}
                  </span>
                  <span className="text-xs text-gray-500">•</span>
                  <span className="text-xs text-gray-500">
                    {formatTimeAgo(comment.timestamp)}
                  </span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed mb-2">
                  {comment.content}
                </p>
                <div className="flex items-center gap-3 text-gray-500">
                  <div className="flex items-center gap-1">
                    <ChevronUp className="w-3 h-3 cursor-pointer hover:text-gray-600" />
                    <span className="text-xs">{comment.upvotes || 0}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ChevronDown className="w-3 h-3 cursor-pointer hover:text-gray-600" />
                    <span className="text-xs">{comment.downvotes || 0}</span>
                  </div>
                  <span className="text-xs cursor-pointer hover:text-gray-600">Reply</span>
                </div>
              </div>
            ))}
          </div>

          {/* Comments Pagination */}
          {totalCommentPages > 1 && (
            <div className="px-6 pb-4">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentCommentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentCommentPage === 1}
                  className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-gray-700 rotate-[-90deg]" />
                </button>
                
                <div className="w-8 h-8 bg-slate-500 text-white rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-sm font-medium">{currentCommentPage}</span>
                </div>
                
                <button
                  onClick={() => setCurrentCommentPage((prev) => Math.min(prev + 1, totalCommentPages))}
                  disabled={currentCommentPage === totalCommentPages}
                  className="w-8 h-8 bg-white border border-gray-300 rounded-lg flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronUp className="w-4 h-4 text-gray-700 rotate-90" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
