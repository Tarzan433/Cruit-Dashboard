import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    onAuthStateChanged,
    User,
} from "firebase/auth";

import { auth, db } from "../firebase/firebase";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { DEFAULT_ACHIEVEMENTS } from "./achievementService";

/**
 * SIGN UP
 */
export const signUpUser = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    await setDoc(doc(db, "users", cred.user.uid), {
        uid: cred.user.uid,
        fullName: name,
        email,
        createdAt: serverTimestamp(),
        provider: "email",
        role: "seeker",
        accountTypeSelected: false,
        achievements: DEFAULT_ACHIEVEMENTS,
    });

    return cred.user;
};

/**
 * LOGIN
 */
export const loginUser = async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return cred.user;
};

/**
 * GOOGLE LOGIN
 */
export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);

    const user = cred.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
        await setDoc(userRef, {
            uid: user.uid,
            fullName: user.displayName,
            email: user.email,
            createdAt: serverTimestamp(),
            provider: "google",
            role: "seeker",
            accountTypeSelected: false,
            achievements: DEFAULT_ACHIEVEMENTS,
        });
    }

    return user;
};

/**
 * LOGOUT
 */
export const logoutUser = async () => {
    return signOut(auth);
};

/**
 * PASSWORD RESET
 */
export const resetPassword = async (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

/**
 * AUTH LISTENER
 */
export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback);
};