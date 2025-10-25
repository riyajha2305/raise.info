import { Timestamp } from "firebase/firestore";

export interface Attachment {
  type: "image" | "file";
  name: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface Comment {
  id: string;
  salaryId: string; // Reference to the salary entry
  userId: string | null; // Null for anonymous users
  userDisplayName: string;
  userPhotoURL: string | null;
  isAnonymous: boolean;
  content: string;
  attachments?: Attachment[];
  mentions?: string[]; // User IDs of mentioned users
  createdAt: Timestamp;
  updatedAt: Timestamp;
  upvotes: number;
  downvotes: number;
  replyCount: number;
  votedBy: {
    [userId: string]: "up" | "down";
  };
}

export interface Reply {
  id: string;
  commentId: string;
  userId: string | null; // Null for anonymous users
  userDisplayName: string;
  userPhotoURL: string | null;
  isAnonymous: boolean;
  content: string;
  attachments?: Attachment[];
  mentions?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  upvotes: number;
  downvotes: number;
  votedBy: {
    [userId: string]: "up" | "down";
  };
}

export type SortOption = "best" | "newest" | "oldest" | "top";

export interface CommentWithReplies extends Comment {
  replies: Reply[];
}
