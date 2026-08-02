// hooks/useTrackJobView.ts
import { useEffect } from "react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function useTrackJobView(jobId: string | undefined, isOwner: boolean) {
  useEffect(() => {
    if (!jobId || isOwner) return;
    updateDoc(doc(db, "jobs", jobId), { views: increment(1) }).catch(() => {});
  }, [jobId, isOwner]);
}