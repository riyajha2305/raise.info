import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  increment,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import { Comment, Reply, CommentWithReplies, SortOption, Attachment } from "@/types/comments";

const COMMENTS_COLLECTION = "comments";
const REPLIES_COLLECTION = "replies";

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

  const commentData: any = {
    salaryId,
    userId: userId || null,
    userDisplayName,
    userPhotoURL,
    isAnonymous,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    upvotes: 0,
    downvotes: 0,
    replyCount: 0,
    votedBy: {},
  };

  if (attachments && attachments.length > 0) {
    commentData.attachments = attachments;
  }

  if (mentions && mentions.length > 0) {
    commentData.mentions = mentions;
  }

  const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);
  return docRef.id;
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
  const batch = writeBatch(db);
  const isAnonymous = !userId;

  // Add reply
  const replyRef = doc(collection(db, REPLIES_COLLECTION));
  const replyData: any = {
    commentId,
    userId: userId || null,
    userDisplayName,
    userPhotoURL,
    isAnonymous,
    content,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    upvotes: 0,
    downvotes: 0,
    votedBy: {},
  };

  if (attachments && attachments.length > 0) {
    replyData.attachments = attachments;
  }

  if (mentions && mentions.length > 0) {
    replyData.mentions = mentions;
  }

  batch.set(replyRef, replyData);

  // Increment reply count on comment
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  batch.update(commentRef, {
    replyCount: increment(1),
  });

  await batch.commit();
  return replyRef.id;
};

/**
 * Vote on a comment (upvote or downvote)
 */
export const voteOnComment = async (
  commentId: string,
  userId: string,
  voteType: "up" | "down"
): Promise<void> => {
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  const commentSnap = await getDoc(commentRef);

  if (!commentSnap.exists()) {
    throw new Error("Comment not found");
  }

  const commentData = commentSnap.data() as Comment;
  const currentVote = commentData.votedBy?.[userId];

  const updates: any = {
    updatedAt: serverTimestamp(),
  };

  // Remove previous vote if exists
  if (currentVote) {
    if (currentVote === "up") {
      updates.upvotes = increment(-1);
    } else {
      updates.downvotes = increment(-1);
    }
  }

  // Add new vote if different from current
  if (currentVote !== voteType) {
    if (voteType === "up") {
      updates.upvotes = increment(1);
    } else {
      updates.downvotes = increment(1);
    }
    updates[`votedBy.${userId}`] = voteType;
  } else {
    // Remove vote if same as current (toggle off)
    updates[`votedBy.${userId}`] = null;
  }

  await updateDoc(commentRef, updates);
};

/**
 * Vote on a reply
 */
export const voteOnReply = async (
  replyId: string,
  userId: string,
  voteType: "up" | "down"
): Promise<void> => {
  const replyRef = doc(db, REPLIES_COLLECTION, replyId);
  const replySnap = await getDoc(replyRef);

  if (!replySnap.exists()) {
    throw new Error("Reply not found");
  }

  const replyData = replySnap.data() as Reply;
  const currentVote = replyData.votedBy?.[userId];

  const updates: any = {
    updatedAt: serverTimestamp(),
  };

  // Remove previous vote if exists
  if (currentVote) {
    if (currentVote === "up") {
      updates.upvotes = increment(-1);
    } else {
      updates.downvotes = increment(-1);
    }
  }

  // Add new vote if different from current
  if (currentVote !== voteType) {
    if (voteType === "up") {
      updates.upvotes = increment(1);
    } else {
      updates.downvotes = increment(1);
    }
    updates[`votedBy.${userId}`] = voteType;
  } else {
    // Remove vote if same as current (toggle off)
    updates[`votedBy.${userId}`] = null;
  }

  await updateDoc(replyRef, updates);
};

/**
 * Get all comments for a salary entry with their replies
 */
export const getComments = async (
  salaryId: string,
  sortOption: SortOption = "best"
): Promise<CommentWithReplies[]> => {
  let commentsQuery = query(
    collection(db, COMMENTS_COLLECTION),
    where("salaryId", "==", salaryId)
  );

  // Apply sorting
  switch (sortOption) {
    case "newest":
      commentsQuery = query(commentsQuery, orderBy("createdAt", "desc"));
      break;
    case "oldest":
      commentsQuery = query(commentsQuery, orderBy("createdAt", "asc"));
      break;
    case "top":
      commentsQuery = query(commentsQuery, orderBy("upvotes", "desc"));
      break;
    default: // "best"
      // Best is a combination of upvotes and recency - we'll sort in memory
      commentsQuery = query(commentsQuery, orderBy("createdAt", "desc"));
  }

  const commentsSnap = await getDocs(commentsQuery);
  const comments: CommentWithReplies[] = [];

  for (const commentDoc of commentsSnap.docs) {
    const commentData = { id: commentDoc.id, ...commentDoc.data() } as Comment;

    // Get replies for this comment
    const repliesQuery = query(
      collection(db, REPLIES_COLLECTION),
      where("commentId", "==", commentDoc.id),
      orderBy("createdAt", "asc")
    );

    const repliesSnap = await getDocs(repliesQuery);
    const replies: Reply[] = repliesSnap.docs.map((replyDoc) => ({
      id: replyDoc.id,
      ...replyDoc.data(),
    })) as Reply[];

    comments.push({
      ...commentData,
      replies,
    });
  }

  // Sort by "best" if needed (upvotes - downvotes)
  if (sortOption === "best") {
    comments.sort((a, b) => {
      const scoreA = a.upvotes - a.downvotes;
      const scoreB = b.upvotes - b.downvotes;
      return scoreB - scoreA;
    });
  }

  return comments;
};

/**
 * Delete a comment and all its replies
 */
export const deleteComment = async (commentId: string): Promise<void> => {
  const batch = writeBatch(db);

  // Delete comment
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  batch.delete(commentRef);

  // Delete all replies
  const repliesQuery = query(
    collection(db, REPLIES_COLLECTION),
    where("commentId", "==", commentId)
  );
  const repliesSnap = await getDocs(repliesQuery);

  repliesSnap.docs.forEach((replyDoc) => {
    batch.delete(replyDoc.ref);
  });

  await batch.commit();
};

/**
 * Delete a reply
 */
export const deleteReply = async (
  replyId: string,
  commentId: string
): Promise<void> => {
  const batch = writeBatch(db);

  // Delete reply
  const replyRef = doc(db, REPLIES_COLLECTION, replyId);
  batch.delete(replyRef);

  // Decrement reply count on comment
  const commentRef = doc(db, COMMENTS_COLLECTION, commentId);
  batch.update(commentRef, {
    replyCount: increment(-1),
  });

  await batch.commit();
};

/**
 * Get comment count for a salary entry
 */
export const getCommentCount = async (salaryId: string): Promise<number> => {
  const commentsQuery = query(
    collection(db, COMMENTS_COLLECTION),
    where("salaryId", "==", salaryId)
  );
  const commentsSnap = await getDocs(commentsQuery);
  return commentsSnap.size;
};
