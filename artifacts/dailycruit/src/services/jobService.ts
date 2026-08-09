import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import type { Job } from "../models/job";

import { getUserProfile } from "./profile";

const JOBS_COLLECTION = "jobs";

function formatPostedDate(value: unknown): string {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().toLocaleDateString("en-GB");
  }

  return typeof value === "string" ? value : "Just now";
}

export async function createJob(jobData: Omit<Job, "id" | "jobId" | "postedDate" | "isActive" | "recruiterId">): Promise<Job> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    throw new Error("You must be signed in to post a job.");
  }

  let companyId: string | null = null;
  try {
    const profile = await getUserProfile(currentUser.uid);
    if (profile?.companyId) {
      companyId = profile.companyId;
    }
  } catch (err) {
    console.error("Failed to fetch recruiter companyId for job posting:", err);
  }

  const docRef = doc(collection(db, JOBS_COLLECTION));

  const payload: Job = {
    ...jobData,
    jobId: docRef.id,
    recruiterId: currentUser.uid,
    companyId,
    postedDate: serverTimestamp() as unknown as string,
    isActive: true,
  };

  await setDoc(docRef, payload);

  return {
    ...payload,
    id: docRef.id,
  };
}

export function subscribeToActiveJobs(
  onNext: (jobs: Job[]) => void,
  onError?: (error: Error) => void
) {
  const activeJobsQuery = query(
    collection(db, JOBS_COLLECTION),
    where("isActive", "==", true)
  );

  return onSnapshot(
    activeJobsQuery,
    (snapshot) => {
      const jobs = snapshot.docs
        .map((docSnapshot) => {
          const data = docSnapshot.data() as Job;
          return {
            id: docSnapshot.id,
            ...data,
            postedDate: formatPostedDate(data.postedDate),
          };
        })
        .sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));

      onNext(jobs);
    },
    (error) => {
      onError?.(error as Error);
    }
  );
}

export async function getRecruiterJobs(recruiterId: string): Promise<Job[]> {
  const q = query(
    collection(db, JOBS_COLLECTION),
    where("recruiterId", "==", recruiterId)
  );
  const snapshot = await getDocs(q);

  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data() as Job;

      return {
        id: docSnapshot.id,
        ...data,
        postedDate: formatPostedDate(data.postedDate),
      };
    })
    .sort((a, b) => {
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return bTime - aTime;
    });
}



export async function getActiveJobs(): Promise<Job[]> {
  const activeJobsQuery = query(
    collection(db, JOBS_COLLECTION),
    where("isActive", "==", true)
  );
  const snapshot = await getDocs(activeJobsQuery);

  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data() as Job;

      return {
        id: docSnapshot.id,
        ...data,
        postedDate: formatPostedDate(data.postedDate),
      };
    })
    .sort((a, b) => {
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return bTime - aTime;
    });
}

export async function updateJobStatus(jobId: string, status: "Active" | "Draft" | "Closed"): Promise<void> {
  const jobRef = doc(db, JOBS_COLLECTION, jobId);
  await updateDoc(jobRef, {
    status,
    isActive: status === "Active",
  });
}