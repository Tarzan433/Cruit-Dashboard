import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface ProfileData {
  uid?: string;
  fullName?: string;
  username?: string;
  headline?: string;
  about?: string;
  phoneNumber?: string;
  location?: string;
  skills?: string[];
  experience?: string;
  education?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  jobType?: string;
  role?: "seeker" | "recruiter";
  activeMode?: "jobseeker" | "recruiter" | "gigsman";
  companyId?: string | null;
  email?: string | null;
  photoURL?: string | null;
  createdAt?: unknown;
  updatedAt?: unknown;
  [key: string]: unknown;
}

export async function getUserProfile(userId: string | null | undefined): Promise<ProfileData | null> {
  if (!userId) return null;

  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data() as ProfileData;

  return {
    ...data,
    uid: snapshot.id,
    role: data.role ?? "seeker",
  };
}

export async function updateUserProfile(userId: string | null | undefined, updates: Record<string, unknown>) {
  if (!userId) {
    throw new Error("No authenticated user.");
  }

  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}
