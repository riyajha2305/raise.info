"use client";

import React, { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare } from "lucide-react";
import VoteButtons from "./VoteButtons";
import ReplyItem from "./ReplyItem";
import CommentInput from "./CommentInput";
import AttachmentDisplay from "./AttachmentDisplay";
import { CommentWithReplies, Attachment } from "@/types/comments";
import { useAuth } from "@/contexts/AuthContext";

interface CommentItemProps {
  comment: CommentWithReplies;
  onVote: (commentId: string, voteType: "up" | "down") => void;
  onReply: (commentId: string, content: string, attachments?: Attachment[]) => Promise<void>;
  onVoteReply: (replyId: string, voteType: "up" | "down") => void;
  onDelete?: (commentId: string) => void;
  onDeleteReply?: (replyId: string, commentId: string) => void;
}

export default function CommentItem({
  comment,
  onVote,
  onReply,
  onVoteReply,
  onDelete,
  onDeleteReply,
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showReplies, setShowReplies] = useState(true);

  const isOwner = user?.id === comment.user_id && !comment.is_anonymous;
  const userVote = user ? comment.voted_by?.[user.id] || null : null;

  const timeAgo = comment.created_at
    ? formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })
    : "just now";

  const handleReply = async (content: string, attachments?: Attachment[]) => {
    await onReply(comment.id, content, attachments);
    setShowReplyInput(false);
    setShowReplies(true);
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200">
      {/* Comment Header */}
      <div className="flex gap-3 mb-3">
        <img
          src={comment.user_photo_url || "/default-avatar.png"}
          alt={comment.user_display_name}
          className="w-10 h-10 rounded-full border-2 border-slate-200 flex-shrink-0"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-slate-700">
              {comment.user_display_name}
            </span>
            {comment.is_anonymous && (
              <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-full">
                Anonymous
              </span>
            )}
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500">{timeAgo}</span>
          </div>

          <p className="text-sm text-slate-700">{comment.content}</p>

          {/* Attachments */}
          {comment.attachments && comment.attachments.length > 0 && (
            <AttachmentDisplay attachments={comment.attachments} />
          )}
        </div>
      </div>

      {/* Comment Actions */}
      <div className="flex items-center gap-4 mb-3">
        <VoteButtons
          upvotes={comment.upvotes}
          downvotes={comment.downvotes}
          userVote={userVote}
          onVote={(voteType) => onVote(comment.id, voteType)}
          isDisabled={!user}
        />

        <button
          onClick={() => setShowReplyInput(!showReplyInput)}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Reply</span>
        </button>

        {comment.reply_count > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-xs text-slate-500 hover:text-slate-700 transition-colors"
          >
            {showReplies ? "Hide" : "Show"} {comment.reply_count}{" "}
            {comment.reply_count === 1 ? "reply" : "replies"}
          </button>
        )}

        {isOwner && onDelete && (
          <button
            onClick={() => onDelete(comment.id)}
            className="text-xs text-red-500 hover:text-red-700 transition-colors ml-auto"
          >
            Delete
          </button>
        )}
      </div>

      {/* Reply Input */}
      {showReplyInput && (
        <div className="mb-3 pl-12">
          <CommentInput
            onSubmit={handleReply}
            placeholder="Write a reply..."
            buttonText="Reply"
            autoFocus
            onCancel={() => setShowReplyInput(false)}
          />
        </div>
      )}

      {/* Replies List */}
      {showReplies && comment.replies.length > 0 && (
        <div className="pl-12 border-l-2 border-slate-200">
          {comment.replies.map((reply) => (
            <ReplyItem
              key={reply.id}
              reply={reply}
              onVote={onVoteReply}
              onDelete={
                onDeleteReply
                  ? (replyId) => onDeleteReply(replyId, comment.id)
                  : undefined
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
