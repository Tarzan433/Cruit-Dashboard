import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface AchievementState {
  profileCompleted: boolean;
  firstLogin: boolean;
  profilePhotoAdded: boolean;
  profileEdited: boolean;
  firstJobApplication: boolean;
  applications10: boolean;
  applications50: boolean;
  savedFirstJob: boolean;
  completedPreferences: boolean;
  accountVerified: boolean;
  applicationCount: number;
  savedJobCount: number;
}

export type AchievementFlagKey = keyof Omit<AchievementState, "applicationCount" | "savedJobCount">;

export const DEFAULT_ACHIEVEMENTS: AchievementState = {
  profileCompleted: false,
  firstLogin: false,
  profilePhotoAdded: false,
  profileEdited: false,
  firstJobApplication: false,
  applications10: false,
  applications50: false,
  savedFirstJob: false,
  completedPreferences: false,
  accountVerified: false,
  applicationCount: 0,
  savedJobCount: 0,
};

function normalizeAchievements(raw: Record<string, unknown> | undefined | null): AchievementState {
  const normalized = {
    ...DEFAULT_ACHIEVEMENTS,
    ...(raw ?? {}),
  } as AchievementState;

  return {
    ...normalized,
    profileCompleted: Boolean(normalized.profileCompleted),
    firstLogin: Boolean(normalized.firstLogin),
    profilePhotoAdded: Boolean(normalized.profilePhotoAdded),
    profileEdited: Boolean(normalized.profileEdited),
    firstJobApplication: Boolean(normalized.firstJobApplication),
    applications10: Boolean(normalized.applications10),
    applications50: Boolean(normalized.applications50),
    savedFirstJob: Boolean(normalized.savedFirstJob),
    completedPreferences: Boolean(normalized.completedPreferences),
    accountVerified: Boolean(normalized.accountVerified),
    applicationCount: typeof normalized.applicationCount === "number" ? normalized.applicationCount : 0,
    savedJobCount: typeof normalized.savedJobCount === "number" ? normalized.savedJobCount : 0,
  };
}

export async function getUserAchievements(userId: string | null | undefined): Promise<AchievementState> {
  if (!userId) {
    return { ...DEFAULT_ACHIEVEMENTS };
  }

  const userRef = doc(db, "users", userId);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) {
    await setDoc(
      userRef,
      {
        achievements: DEFAULT_ACHIEVEMENTS,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return { ...DEFAULT_ACHIEVEMENTS };
  }

  const existingAchievements = snapshot.data()?.achievements;
  const normalizedAchievements = normalizeAchievements(existingAchievements as Record<string, unknown> | undefined);

  if (!snapshot.data()?.achievements) {
    await setDoc(
      userRef,
      {
        achievements: normalizedAchievements,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }

  return normalizedAchievements;
}

export async function updateUserAchievements(
  userId: string | null | undefined,
  updates: Partial<AchievementState>
): Promise<AchievementState> {
  if (!userId) {
    throw new Error("No authenticated user.");
  }

  const current = await getUserAchievements(userId);
  const next = {
    ...current,
    ...updates,
  };

  const userRef = doc(db, "users", userId);
  await setDoc(
    userRef,
    {
      achievements: next,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return next;
}
