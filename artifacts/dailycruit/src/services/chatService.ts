import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

// ─── Firestore Schema ─────────────────────────────────────────────────────────
//
// conversations (collection)
//   participantIds        string[]    UIDs of both participants
//   participantInfo       Record<uid, ParticipantInfo>
//   lastMessage           string      Preview text for the list
//   lastMessageTimestamp  Timestamp   Used for ordering
//
// conversations/{id}/messages (subcollection)
//   senderId   string
//   text       string
//   timestamp  Timestamp

// ─── Types ────────────────────────────────────────────────────────────────────

export type ParticipantInfo = {
  name: string;
  /** First character of name used as avatar letter */
  initial: string;
  /** Job title or role description shown in the chat list */
  job: string;
  /** "recruiter" | "seeker" — drives the RECRUITER badge */
  role: string;
};

export type Conversation = {
  id: string;
  participantIds: string[];
  participantInfo: Record<string, ParticipantInfo>;
  lastMessage: string;
  lastMessageTimestamp: Timestamp | null;
};

export type ChatMessage = {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp | null;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTimestamp(ts: Timestamp | null): string {
  if (!ts) return "";
  const date = ts.toDate();
  const now = new Date();

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getFullYear() === yesterday.getFullYear() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getDate() === yesterday.getDate();

  if (isYesterday) return "Yesterday";

  // Within the last 7 days → show day name (Mon, Tue, …)
  const msPerDay = 86_400_000;
  if (now.getTime() - date.getTime() < 7 * msPerDay) {
    return date.toLocaleDateString([], { weekday: "short" });
  }

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export { formatTimestamp };

// ─── Subscriptions ────────────────────────────────────────────────────────────

/**
 * Subscribe to all conversations where `uid` is a participant,
 * ordered by lastMessageTimestamp descending.
 *
 * NOTE: Firestore requires a composite index for (array-contains + orderBy).
 * On first run the console will log a direct URL to create it automatically.
 */
export function subscribeToConversations(
  uid: string,
  onNext: (conversations: Conversation[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "conversations"),
    where("participantIds", "array-contains", uid),
    orderBy("lastMessageTimestamp", "desc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const conversations: Conversation[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          participantIds: (data.participantIds as string[]) ?? [],
          participantInfo: (data.participantInfo as Record<string, ParticipantInfo>) ?? {},
          lastMessage: (data.lastMessage as string) ?? "",
          lastMessageTimestamp: (data.lastMessageTimestamp as Timestamp) ?? null,
        };
      });
      onNext(conversations);
    },
    (error) => onError?.(error as Error)
  );
}

/**
 * Subscribe to messages inside a conversation, ordered by timestamp ascending.
 */
export function subscribeToMessages(
  conversationId: string,
  onNext: (messages: ChatMessage[]) => void,
  onError?: (error: Error) => void
): () => void {
  const q = query(
    collection(db, "conversations", conversationId, "messages"),
    orderBy("timestamp", "asc")
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const messages: ChatMessage[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          senderId: (data.senderId as string) ?? "",
          text: (data.text as string) ?? "",
          timestamp: (data.timestamp as Timestamp) ?? null,
        };
      });
      onNext(messages);
    },
    (error) => onError?.(error as Error)
  );
}

// ─── Write ────────────────────────────────────────────────────────────────────

/**
 * Add a new message to a conversation and update its preview fields.
 */
export async function sendChatMessage(
  conversationId: string,
  senderId: string,
  text: string
): Promise<void> {
  const messagesRef = collection(db, "conversations", conversationId, "messages");
  const conversationRef = doc(db, "conversations", conversationId);

  await addDoc(messagesRef, {
    senderId,
    text,
    timestamp: serverTimestamp(),
  });

  await updateDoc(conversationRef, {
    lastMessage: text,
    lastMessageTimestamp: serverTimestamp(),
  });
}

/**
 * Find an existing conversation between exactly two users, or create a new one.
 */
import { getDocs } from "firebase/firestore";

export async function findOrCreateConversation(
  myId: string,
  myInfo: ParticipantInfo,
  otherId: string,
  otherInfo: ParticipantInfo
): Promise<string> {
  // Query conversations where myId is in participantIds
  const q = query(
    collection(db, "conversations"),
    where("participantIds", "array-contains", myId)
  );

  const snapshot = await getDocs(q);
  
  // Look for a conversation that has exactly these two participant IDs
  for (const docSnapshot of snapshot.docs) {
    const data = docSnapshot.data();
    const ids = (data.participantIds as string[]) || [];
    if (ids.length === 2 && ids.includes(myId) && ids.includes(otherId)) {
      return docSnapshot.id;
    }
  }

  // If not found, create a new one
  const newConversationRef = await addDoc(collection(db, "conversations"), {
    participantIds: [myId, otherId],
    participantInfo: {
      [myId]: myInfo,
      [otherId]: otherInfo,
    },
    lastMessage: "",
    lastMessageTimestamp: serverTimestamp(),
  });

  return newConversationRef.id;
}
