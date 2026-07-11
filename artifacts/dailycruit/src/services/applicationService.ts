import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import type { Application, ApplicationStatus } from "../models/application";

export type { Application, ApplicationStatus } from "../models/application";

const APPLICATIONS_COLLECTION = "applications";

const DEFAULT_STATUS: ApplicationStatus = "Applied";

function getCurrentUserId(): string | null {
  return auth.currentUser?.uid ?? null;
}

function getFriendlyErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "We couldn't save your application right now. Please try again.";
}

function normalizeApplication(snapshotDoc: { id: string; data(): Record<string, unknown> }): Application {
  const data = snapshotDoc.data() as Partial<Application>;

  return {
    applicationId: snapshotDoc.id,
    jobId: String(data.jobId ?? ""),
    recruiterId: String(data.recruiterId ?? ""),
    applicantId: String(data.applicantId ?? ""),
    jobTitle: String(data.jobTitle ?? "Untitled role"),
    company: String(data.company ?? "Unknown company"),
    location: String(data.location ?? "Remote"),
    salary: String(data.salary ?? "$0"),
    employmentType: String(data.employmentType ?? "Full-time"),
    experience: String(data.experience ?? "Not specified"),
    appliedDate: data.appliedDate,
    status: (data.status as ApplicationStatus) ?? DEFAULT_STATUS,
  };
}

export async function hasAppliedToJob(jobId: string): Promise<boolean> {
  const userId = getCurrentUserId();
  if (!userId) {
    return false;
  }

  const snapshot = await getDocs(
    query(
      collection(db, APPLICATIONS_COLLECTION),
      where("applicantId", "==", userId),
      where("jobId", "==", jobId)
    )
  );

  return !snapshot.empty;
}

export async function applyToJob(payload: Omit<Application, "applicationId" | "appliedDate" | "status">): Promise<Application> {
  const userId = getCurrentUserId();
  if (!userId) {
    throw new Error("Please sign in before applying to a job.");
  }

  const exists = await hasAppliedToJob(payload.jobId);
  if (exists) {
    throw new Error("You have already applied for this job.");
  }

  const docRef = await addDoc(collection(db, APPLICATIONS_COLLECTION), {
    ...payload,
    applicantId: userId,
    appliedDate: serverTimestamp(),
    status: DEFAULT_STATUS,
  });

  return {
    applicationId: docRef.id,
    ...payload,
    applicantId: userId,
    appliedDate: serverTimestamp(),
    status: DEFAULT_STATUS,
  };
}

export function subscribeToMyApplications(
  onNext: (applications: Application[]) => void,
  onError?: (error: Error) => void
) {
  const userId = getCurrentUserId();
  if (!userId) {
    onNext([]);
    return () => undefined;
  }

  return onSnapshot(
    query(collection(db, APPLICATIONS_COLLECTION), where("applicantId", "==", userId)),
    (snapshot) => {
      const applications = snapshot.docs.map((docSnapshot) => normalizeApplication(docSnapshot));
      applications.sort((a, b) => {
        const aTime = a.appliedDate && typeof a.appliedDate === "object" && "toDate" in a.appliedDate && typeof (a.appliedDate as { toDate?: () => Date }).toDate === "function"
          ? (a.appliedDate as { toDate: () => Date }).toDate().getTime()
          : 0;
        const bTime = b.appliedDate && typeof b.appliedDate === "object" && "toDate" in b.appliedDate && typeof (b.appliedDate as { toDate?: () => Date }).toDate === "function"
          ? (b.appliedDate as { toDate: () => Date }).toDate().getTime()
          : 0;

        return bTime - aTime;
      });
      onNext(applications);
    },
    (error) => {
      onError?.(error as Error);
    }
  );
}

export async function getMyApplications(): Promise<Application[]> {
  const userId = getCurrentUserId();
  if (!userId) {
    return [];
  }

  const snapshot = await getDocs(
    query(collection(db, APPLICATIONS_COLLECTION), where("applicantId", "==", userId))
  );

  return snapshot.docs.map((docSnapshot) => normalizeApplication(docSnapshot));
}

export { DEFAULT_STATUS, getFriendlyErrorMessage };
