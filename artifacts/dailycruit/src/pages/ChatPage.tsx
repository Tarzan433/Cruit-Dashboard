import { useState, useEffect, useRef } from "react";
import { auth } from "../firebase/firebase";
import {
  subscribeToConversations,
  subscribeToMessages,
  sendChatMessage,
  formatTimestamp,
  type Conversation,
  type ChatMessage,
} from "../services/chatService";

// ─── Responsive helper ────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 1024): boolean {
  const query = `(max-width: ${breakpoint - 1}px)`;
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return isMobile;
}

// ─── Chat Icons ───────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3-8.59A2 2 0 0 1 3.62 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function PaperclipIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

function SendArrowIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function BriefcaseSmIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function ChatBubbleEmptyIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M40 8H8a4 4 0 0 0-4 4v20a4 4 0 0 0 4 4h6l4 6 4-6h18a4 4 0 0 0 4-4V12a4 4 0 0 0-4-4z" stroke="#D1D5DB" strokeWidth="2.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Given a conversation and the current user's UID, return the other participant's display info. */
function getOtherParticipant(conv: Conversation, myUid: string) {
  const otherId = conv.participantIds.find((id) => id !== myUid) ?? "";
  return conv.participantInfo[otherId] ?? { name: "Unknown", initial: "?", job: "", role: "" };
}

// ─── Chat Page ────────────────────────────────────────────────────────────────

function ChatPage({ onBack }: { onBack: () => void }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Resolve current user once on mount
  useEffect(() => {
    const uid = auth.currentUser?.uid ?? null;
    setCurrentUserId(uid);
  }, []);

  // Subscribe to conversation list
  useEffect(() => {
    if (!currentUserId) {
      setConversations([]);
      setIsLoadingConversations(false);
      return;
    }

    setIsLoadingConversations(true);
    const unsubscribe = subscribeToConversations(
      currentUserId,
      (convs) => {
        setConversations(convs);
        setIsLoadingConversations(false);
      },
      () => setIsLoadingConversations(false)
    );

    return unsubscribe;
  }, [currentUserId]);

  // Subscribe to messages for the selected conversation
  useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    const unsubscribe = subscribeToMessages(
      selectedId,
      (msgs) => setMessages(msgs)
    );

    return unsubscribe;
  }, [selectedId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function sendMessage() {
    const text = inputValue.trim();
    if (!text || !selectedId || !currentUserId) return;
    setInputValue("");
    await sendChatMessage(selectedId, currentUserId, text);
  }

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") sendMessage();
  }

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;
  const selectedContact = selectedConversation && currentUserId
    ? getOtherParticipant(selectedConversation, currentUserId)
    : null;

  // ── Shared left-panel (chat list) ─────────────────────────────────────────
  const listPanel = (
    <div className="chat-left">
      <div className="chat-left-header">
        <button className="chat-back-btn" onClick={onBack} title="Back to Home">
          <ArrowLeftIcon />
        </button>
        <h2>Chats</h2>
      </div>

      {isLoadingConversations ? (
        <div className="chat-list-empty">
          <p>Loading...</p>
        </div>
      ) : conversations.length === 0 ? (
        <div className="chat-list-empty">
          <ChatBubbleEmptyIcon />
          <h4>No chats yet</h4>
          <p>When you message a recruiter or applicant, it will appear here.</p>
        </div>
      ) : (
        <div className="chat-list">
          {conversations.map((conv) => {
            const other = currentUserId ? getOtherParticipant(conv, currentUserId) : { name: "Unknown", initial: "?", job: "", role: "" };
            const timeLabel = formatTimestamp(conv.lastMessageTimestamp);
            return (
              <div
                key={conv.id}
                className={`chat-item${selectedId === conv.id ? " active" : ""}`}
                onClick={() => setSelectedId(conv.id)}
              >
                <div className="chat-avatar">{other.initial}</div>
                <div className="chat-item-body">
                  <div className="chat-item-row1">
                    <span className="chat-contact-name">{other.name}</span>
                    <span className="chat-timestamp">{timeLabel}</span>
                  </div>
                  <div className="chat-item-row2">
                    <span className="chat-job-tag">
                      <BriefcaseSmIcon /> {other.job}
                    </span>
                    {other.role === "recruiter" && (
                      <span className="recruiter-badge">RECRUITER</span>
                    )}
                  </div>
                  <div className="chat-preview">
                    {conv.lastMessage}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  // ── Shared right-panel (conversation) ─────────────────────────────────────
  // On mobile the back arrow inside the top-bar clears selectedId (back to list).
  // On desktop it is never shown (no back arrow in top-bar on desktop).
  const conversationPanel = (
    <div className="chat-right">
      {!selectedContact ? (
        <div className="chat-right-default">
          <span className="chat-select-pill">Select a chat to start messaging</span>
        </div>
      ) : (
        <div className="chat-window">
          {/* Top bar */}
          <div className="chat-top-bar">
            <div className="chat-top-bar-left">
              {isMobile && (
                <button className="chat-back-btn" onClick={() => setSelectedId(null)} title="Back to chats">
                  <ArrowLeftIcon />
                </button>
              )}
              <div className="chat-top-avatar">{selectedContact.initial}</div>
              <div className="chat-top-info">
                <h4>{selectedContact.name}</h4>
                <div className="chat-top-job">{selectedContact.job}</div>
              </div>
            </div>
            <div className="chat-top-bar-right">
              <button className="chat-action-btn" title="Call"><PhoneIcon /></button>
              <button className="chat-action-btn" title="Video"><VideoIcon /></button>
              <button className="chat-action-btn" title="Info"><InfoIcon /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg) => {
              const isSent = msg.senderId === currentUserId;
              const timeLabel = formatTimestamp(msg.timestamp);
              return (
                <div key={msg.id} className={`message-group ${isSent ? "sent" : "received"}`}>
                  <div className="message-bubble">{msg.text}</div>
                  <div className="message-time">{timeLabel}</div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input bar */}
          <div className="chat-input-bar">
            <button className="chat-attach-btn" title="Attach file"><PaperclipIcon /></button>
            <input
              className="chat-text-input"
              type="text"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKey}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              title="Send"
            >
              <SendArrowIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ── Mobile: show one pane at a time ───────────────────────────────────────
  if (isMobile) {
    return (
      <div className="chat-layout">
        {selectedContact ? conversationPanel : listPanel}
      </div>
    );
  }

  // ── Desktop: original two-pane layout ─────────────────────────────────────
  return (
    <div className="chat-layout">
      {listPanel}
      {conversationPanel}
    </div>
  );
}

export default ChatPage;
