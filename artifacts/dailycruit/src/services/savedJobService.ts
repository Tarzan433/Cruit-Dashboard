import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import type { SavedJob } from "../models/savedJob";
import type { Job } from "../models/job";

export type { SavedJob } from "../models/savedJob";

const SAVED_JOBS_COLLECTION = "savedJobs";

function getCurrentUserId(): string | null {
  return auth.currentUser?.uid ?? null;
}

function normalizeSavedJob(snapshotDoc: { id: string; data(): Record<string, unknown> }): SavedJob {
  const data = snapshotDoc.data() as Partial<SavedJob>;

  return {
    jobId: snapshotDoc.id,
    savedDate: data.savedDate,
  };
}

function formatDateValue(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    try {
      return (value as { toDate: () => Date }).toDate().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return undefined;
    }
  }

  return undefined;
}

function mergeSavedJobWithJob(savedJob: SavedJob, jobData: Partial<Job>): SavedJob {
  return {
    ...savedJob,
    title: jobData.title,
    company: jobData.company,
    location: jobData.location,
    salary: jobData.salary,
    employmentType: jobData.employmentType,
    experience: jobData.experience,
    description: jobData.description,
    postedDate: formatDateValue(jobData.postedDate),
    isActive: jobData.isActive,
  };
}

export async function isJobSaved(jobId: string): Promise<boolean> {
  const userId = getCurrentUserId();
  if (!userId) return false;

  const snapshot = await getDoc(doc(db, "users", userId, SAVED_JOBS_COLLECTION, jobId));
  return snapshot.exists();
}

export async function toggleSavedJob(jobId: string, _job?: Partial<Job>): Promise<boolean> {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Please sign in before saving a job.");
  }

  const savedRef = doc(db, "users", userId, SAVED_JOBS_COLLECTION, jobId);
  const existing = await getDoc(savedRef);

  if (existing.exists()) {
    await deleteDoc(savedRef);
    return false;
  }

  const payload: SavedJob = {
    jobId,
    savedDate: serverTimestamp(),
  };

  await setDoc(savedRef, payload);

  return true;
}

export function subscribeToSavedJobs(onNext: (savedJobs: SavedJob[]) => void, onError?: (error: Error) => void) {
  const userId = getCurrentUserId();
  if (!userId) {
    onNext([]);
    return () => undefined;
  }

  return onSnapshot(
    collection(db, "users", userId, SAVED_JOBS_COLLECTION),
    async (snapshot) => {
      const savedJobs = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const savedJob = normalizeSavedJob(docSnapshot);
          const jobSnapshot = await getDoc(doc(db, "jobs", savedJob.jobId));
          if (!jobSnapshot.exists()) {
            return savedJob;
          }

          const jobData = jobSnapshot.data() as Partial<Job>;
          return mergeSavedJobWithJob(savedJob, jobData);
        })
      );

      savedJobs.sort((a, b) => {
        const aTime = a.savedDate && typeof a.savedDate === "object" && "toDate" in a.savedDate && typeof (a.savedDate as { toDate?: () => Date }).toDate === "function"
          ? (a.savedDate as { toDate: () => Date }).toDate().getTime()
          : 0;
        const bTime = b.savedDate && typeof b.savedDate === "object" && "toDate" in b.savedDate && typeof (b.savedDate as { toDate?: () => Date }).toDate === "function"
          ? (b.savedDate as { toDate: () => Date }).toDate().getTime()
          : 0;

        return bTime - aTime;
      });
      onNext(savedJobs);
    },
    (error) => {
      onError?.(error as Error);
    }
  );
}

export async function getSavedJobs(): Promise<SavedJob[]> {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const snapshot = await getDocs(collection(db, "users", userId, SAVED_JOBS_COLLECTION));
  const savedJobs = await Promise.all(
    snapshot.docs.map(async (docSnapshot) => {
      const savedJob = normalizeSavedJob(docSnapshot);
      const jobSnapshot = await getDoc(doc(db, "jobs", savedJob.jobId));
      if (!jobSnapshot.exists()) {
        return savedJob;
      }

      const jobData = jobSnapshot.data() as Partial<Job>;
      return mergeSavedJobWithJob(savedJob, jobData);
    })
  );

  return savedJobs;
}

export function getFriendlySavedJobsError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "We couldn't update your saved jobs right now. Please try again.";
}
