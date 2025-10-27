import { supabase } from "./config";
import { CommentWithReplies, SortOption, Attachment } from "@/types/comments";

/**
 * Add a new comment to a salary entry
 */
export const addComment = async (
  salaryId: string,
  userId: string | null,
  userDisplayName: string,
  userPhotoURL: string | null,
  content: string,
  attachments?: Attachment[],
  mentions?: string[]
): Promise<string> => {
  const isAnonymous = !userId;

  const { data, error } = await supabase
    .from("comments")
    .insert({
      salary_id: salaryId,
      user_id: userId,
      user_display_name: userDisplayName,
      user_photo_url: userPhotoURL,
      is_anonymous: isAnonymous,
      content,
      attachments: attachments || [],
      mentions: mentions || [],
      upvotes: 0,
      downvotes: 0,
      reply_count: 0,
      voted_by: {},
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Failed to add comment: ${error.message}`);
  }

  return data.id;
};

/**
 * Add a reply to a comment
 */
export const addReply = async (
  commentId: string,
  userId: string | null,
  userDisplayName: string,
  userPhotoURL: string | null,
  content: string,
  attachments?: Attachment[],
  mentions?: string[]
): Promise<string> => {
  const isAnonymous = !userId;

  // Insert reply
  const { data: replyData, error: replyError } = await supabase
    .from("replies")
    .insert({
      comment_id: commentId,
      user_id: userId,
      user_display_name: userDisplayName,
      user_photo_url: userPhotoURL,
      is_anonymous: isAnonymous,
      content,
      attachments: attachments || [],
      mentions: mentions || [],
      upvotes: 0,
      downvotes: 0,
      voted_by: {},
    })
    .select("id")
    .single();

  if (replyError) {
    throw new Error(`Failed to add reply: ${replyError.message}`);
  }

  // Increment reply count on comment
  const { data: commentData, error: updateError } = await supabase
    .from("comments")
    .select("reply_count")
    .eq("id", commentId)
    .single();

  if (updateError) {
    console.error("Failed to fetch comment:", updateError);
  } else if (commentData) {
    const { error: incrementError } = await supabase
      .from("comments")
      .update({ reply_count: (commentData.reply_count || 0) + 1 })
      .eq("id", commentId);

    if (incrementError) {
      console.error("Failed to increment reply count:", incrementError);
    }
  }

  return replyData.id;
};

/**
 * Vote on a comment (upvote or downvote)
 */
export const voteOnComment = async (
  commentId: string,
  userId: string,
  voteType: "up" | "down"
): Promise<void> => {
  // Get current comment
  const { data: comment, error: fetchError } = await supabase
    .from("comments")
    .select("upvotes, downvotes, voted_by")
    .eq("id", commentId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch comment: ${fetchError.message}`);
  }

  const votedBy = (comment.voted_by as any) || {};
  const currentVote = votedBy[userId];

  let upvotes = comment.upvotes;
  let downvotes = comment.downvotes;

  // Remove previous vote if exists
  if (currentVote) {
    if (currentVote === "up") {
      upvotes--;
    } else {
      downvotes--;
    }
  }

  // Add new vote if different from current
  if (currentVote !== voteType) {
    if (voteType === "up") {
      upvotes++;
    } else {
      downvotes++;
    }
    votedBy[userId] = voteType;
  } else {
    // Remove vote if same as current (toggle off)
    delete votedBy[userId];
  }

  // Update comment
  const { error: updateError } = await supabase
    .from("comments")
    .update({
      upvotes,
      downvotes,
      voted_by: votedBy,
    })
    .eq("id", commentId);

  if (updateError) {
    throw new Error(`Failed to update vote: ${updateError.message}`);
  }
};

/**
 * Vote on a reply
 */
export const voteOnReply = async (
  replyId: string,
  userId: string,
  voteType: "up" | "down"
): Promise<void> => {
  // Get current reply
  const { data: reply, error: fetchError } = await supabase
    .from("replies")
    .select("upvotes, downvotes, voted_by")
    .eq("id", replyId)
    .single();

  if (fetchError) {
    throw new Error(`Failed to fetch reply: ${fetchError.message}`);
  }

  const votedBy = (reply.voted_by as any) || {};
  const currentVote = votedBy[userId];

  let upvotes = reply.upvotes;
  let downvotes = reply.downvotes;

  // Remove previous vote if exists
  if (currentVote) {
    if (currentVote === "up") {
      upvotes--;
    } else {
      downvotes--;
    }
  }

  // Add new vote if different from current
  if (currentVote !== voteType) {
    if (voteType === "up") {
      upvotes++;
    } else {
      downvotes++;
    }
    votedBy[userId] = voteType;
  } else {
    // Remove vote if same as current (toggle off)
    delete votedBy[userId];
  }

  // Update reply
  const { error: updateError } = await supabase
    .from("replies")
    .update({
      upvotes,
      downvotes,
      voted_by: votedBy,
    })
    .eq("id", replyId);

  if (updateError) {
    throw new Error(`Failed to update vote: ${updateError.message}`);
  }
};

/**
 * Get all comments for a salary entry with their replies
 */
export const getComments = async (
  salaryId: string,
  sortOption: SortOption = "best"
): Promise<CommentWithReplies[]> => {
  // Build query based on sort option
  let query = supabase.from("comments").select("*").eq("salary_id", salaryId);

  // Apply sorting
  switch (sortOption) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "oldest":
      query = query.order("created_at", { ascending: true });
      break;
    case "top":
      query = query.order("upvotes", { ascending: false });
      break;
    default: // 'best'
      query = query.order("created_at", { ascending: false });
  }

  const { data: comments, error: commentsError } = await query;

  if (commentsError) {
    throw new Error(`Failed to fetch comments: ${commentsError.message}`);
  }

  // Get replies for each comment
  const commentsWithReplies: CommentWithReplies[] = await Promise.all(
    (comments || []).map(async (comment) => {
      const { data: replies, error: repliesError } = await supabase
        .from("replies")
        .select("*")
        .eq("comment_id", comment.id)
        .order("created_at", { ascending: true });

      if (repliesError) {
        console.error("Failed to fetch replies:", repliesError);
        return { ...comment, replies: [] };
      }

      return {
        ...comment,
        replies: replies || [],
      };
    })
  );

  // Sort by "best" if needed (upvotes - downvotes)
  if (sortOption === "best") {
    commentsWithReplies.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      return scoreB - scoreA;
    });
  }

  return commentsWithReplies as any;
};

/**
 * Delete a comment and all its replies
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId);

  if (error) {
    throw new Error(`Failed to delete comment: ${error.message}`);
  }

  // Replies are automatically deleted via CASCADE
};

/**
 * Delete a reply
 */
export const deleteReply = async (
  replyId: string,
  commentId: string
): Promise<void> => {
  // Delete reply
  const { error: deleteError } = await supabase
    .from("replies")
    .delete()
    .eq("id", replyId);

  if (deleteError) {
    throw new Error(`Failed to delete reply: ${deleteError.message}`);
  }

  // Decrement reply count on comment
  const { data: commentData, error: fetchError } = await supabase
    .from("comments")
    .select("reply_count")
    .eq("id", commentId)
    .single();

  if (fetchError) {
    console.error("Failed to fetch comment:", fetchError);
  } else if (commentData) {
    const newCount = Math.max(0, (commentData.reply_count || 0) - 1);
    const { error: decrementError } = await supabase
      .from("comments")
      .update({ reply_count: newCount })
      .eq("id", commentId);

    if (decrementError) {
      console.error("Failed to decrement reply count:", decrementError);
    }
  }
};

/**
 * Get comment count for a salary entry
 */
export const getCommentCount = async (salaryId: string): Promise<number> => {
  const { count, error } = await supabase
    .from("comments")
    .select("*", { count: "exact", head: true })
    .eq("salary_id", salaryId);

  if (error) {
    throw new Error(`Failed to get comment count: ${error.message}`);
  }

  return count || 0;
};
