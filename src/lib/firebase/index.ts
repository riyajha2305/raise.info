// Firebase exports for easy importing
export { app, auth, db, storage, analytics } from "./config";
export {
  signInWithGoogle,
  signOut,
  onAuthStateChange,
  getCurrentUser,
} from "./auth";
export {
  addComment,
  addReply,
  voteOnComment,
  voteOnReply,
  getComments,
  deleteComment,
  deleteReply,
  getCommentCount,
} from "./comments";
export {
  uploadImage,
  uploadFile,
  deleteAttachment,
  formatFileSize,
} from "./storage";
