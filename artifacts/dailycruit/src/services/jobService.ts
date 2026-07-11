import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase/firebase";
import type { Job } from "../models/job";

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

  const docRef = doc(collection(db, JOBS_COLLECTION));

  const payload: Job = {
    ...jobData,
    jobId: docRef.id,
    recruiterId: currentUser.uid,
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
  return onSnapshot(
    collection(db, JOBS_COLLECTION),
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
        .filter((job) => job.isActive)
        .sort((a, b) => {
          const aTime = a.createdAt ?? 0;
          const bTime = b.createdAt ?? 0;
          return bTime - aTime;
        });

      onNext(jobs);
    },
    (error) => {
      onError?.(error as Error);
    }
  );
}

export async function getRecruiterJobs(recruiterId: string): Promise<Job[]> {
  const snapshot = await getDocs(collection(db, JOBS_COLLECTION));

  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data() as Job;

      return {
        id: docSnapshot.id,
        ...data,
        postedDate: formatPostedDate(data.postedDate),
      };
    })
    .filter((job) => job.recruiterId === recruiterId)
    .sort((a, b) => {
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return bTime - aTime;
    });
}

export async function getActiveJobs(): Promise<Job[]> {
  const snapshot = await getDocs(collection(db, JOBS_COLLECTION));

  return snapshot.docs
    .map((docSnapshot) => {
      const data = docSnapshot.data() as Job;

      return {
        id: docSnapshot.id,
        ...data,
        postedDate: formatPostedDate(data.postedDate),
      };
    })
    .filter((job) => job.isActive)
    .sort((a, b) => {
      const aTime = a.createdAt ?? 0;
      const bTime = b.createdAt ?? 0;
      return bTime - aTime;
    });
}
