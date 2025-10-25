import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "./config";
import { Attachment } from "@/types/comments";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

/**
 * Upload an image file to Firebase Storage
 */
export const uploadImage = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<Attachment> => {
  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid image type. Only JPEG, PNG, GIF, and WebP are allowed."
    );
  }

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image size must be less than 5MB.");
  }

  // Create a unique file name
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const filePath = `comments/images/${userId}/${fileName}`;

  // Create a storage reference
  const storageRef = ref(storage, filePath);

  // Upload the file
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(new Error("Failed to upload image. Please try again."));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            type: "image",
            name: file.name,
            url: downloadURL,
            size: file.size,
            mimeType: file.type,
          });
        } catch (error) {
          reject(new Error("Failed to get download URL."));
        }
      }
    );
  });
};

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<Attachment> => {
  // Validate file type
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error(
      "Invalid file type. Only PDF, Word, Excel, and text files are allowed."
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be less than 10MB.");
  }

  // Create a unique file name
  const timestamp = Date.now();
  const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
  const filePath = `comments/files/${userId}/${fileName}`;

  // Create a storage reference
  const storageRef = ref(storage, filePath);

  // Upload the file
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot: UploadTaskSnapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        reject(new Error("Failed to upload file. Please try again."));
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve({
            type: "file",
            name: file.name,
            url: downloadURL,
            size: file.size,
            mimeType: file.type,
          });
        } catch (error) {
          reject(new Error("Failed to get download URL."));
        }
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage
 */
export const deleteAttachment = async (url: string): Promise<void> => {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting attachment:", error);
    throw new Error("Failed to delete attachment.");
  }
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};
