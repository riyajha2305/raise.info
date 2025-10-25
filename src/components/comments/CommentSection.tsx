"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Share2 } from "lucide-react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { CommentWithReplies, SortOption, Attachment } from "@/types/comments";
import { useAuth } from "@/contexts/AuthContext";
import {
  getComments,
  addComment,
  addReply,
  voteOnComment,
  voteOnReply,
  deleteComment,
  deleteReply,
} from "@/lib/firebase/comments";

interface CommentSectionProps {
  salaryId: string;
  upvoteCount?: number;
  downvoteCount?: number;
  initialCommentCount?: number;
}

export default function CommentSection({
  salaryId,
  upvoteCount = 91,
  downvoteCount = 6,
  initialCommentCount = 0,
}: CommentSectionProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("best");
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  // Load comments
  useEffect(() => {
    loadComments();
  }, [salaryId, sortBy]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getComments(salaryId, sortBy);
      setComments(fetchedComments);
      setCommentCount(fetchedComments.length);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateAnonymousName = () => {
    const adjectives = ["Curious", "Bright", "Clever", "Savvy", "Smart", "Wise", "Bold"];
    const nouns = ["Analyst", "Engineer", "Developer", "Professional", "Expert", "Specialist"];
    const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNum = Math.floor(Math.random() * 1000);
    return `${randomAdj}${randomNoun}${randomNum}`;
  };

  const handleAddComment = async (content: string, attachments?: Attachment[]) => {
    try {
      const userId = user?.uid || null;
      const displayName = user?.displayName || generateAnonymousName();
      const photoURL = user?.photoURL || null;

      await addComment(
        salaryId,
        userId,
        displayName,
        photoURL,
        content,
        attachments
      );
      await loadComments();
    } catch (error) {
      console.error("Error adding comment:", error);
      throw error;
    }
  };

  const handleAddReply = async (commentId: string, content: string, attachments?: Attachment[]) => {
    try {
      const userId = user?.uid || null;
      const displayName = user?.displayName || generateAnonymousName();
      const photoURL = user?.photoURL || null;

      await addReply(
        commentId,
        userId,
        displayName,
        photoURL,
        content,
        attachments
      );
      await loadComments();
    } catch (error) {
      console.error("Error adding reply:", error);
      throw error;
    }
  };

  const handleVoteComment = async (commentId: string, voteType: "up" | "down") => {
    if (!user) return;

    try {
      await voteOnComment(commentId, user.uid, voteType);
      await loadComments();
    } catch (error) {
      console.error("Error voting on comment:", error);
    }
  };

  const handleVoteReply = async (replyId: string, voteType: "up" | "down") => {
    if (!user) return;

    try {
      await voteOnReply(replyId, user.uid, voteType);
      await loadComments();
    } catch (error) {
      console.error("Error voting on reply:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      await deleteComment(commentId);
      await loadComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDeleteReply = async (replyId: string, commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return;

    try {
      await deleteReply(replyId, commentId);
      await loadComments();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  return (
    <div className="mt-6">
      {/* Stats Bar */}
      <div className="flex items-center gap-6 mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
            <span className="text-sm font-medium">{upvoteCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            <span className="text-sm font-medium">{downvoteCount}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-slate-600" />
          <span className="text-sm font-medium text-slate-600">{commentCount}</span>
        </div>

        <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors ml-auto">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">
          Comments ({commentCount})
        </h3>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="text-sm text-slate-600 bg-white border border-slate-300 rounded-lg px-3 py-1.5 pr-8 appearance-none cursor-pointer hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent"
          >
            <option value="best">Sort by: Best</option>
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
            <option value="top">Sort by: Top</option>
          </select>
          <svg
            className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {/* Comment Input */}
      <div className="mb-6">
        <CommentInput onSubmit={handleAddComment} />
      </div>

      {/* Comments List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto"></div>
          <p className="mt-2 text-sm text-slate-600">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 bg-slate-50 rounded-lg border border-slate-200">
          <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-2" />
          <p className="text-sm text-slate-600">No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onVote={handleVoteComment}
              onReply={handleAddReply}
              onVoteReply={handleVoteReply}
              onDelete={handleDeleteComment}
              onDeleteReply={handleDeleteReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}
