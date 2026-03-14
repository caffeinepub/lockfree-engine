import { useCallback, useEffect, useState } from "react";

interface StoredMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string; // ISO string in storage
  isProviderTable?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isProviderTable?: boolean;
}

const STORAGE_KEY = "lockfree_chat_history";
const MAX_MESSAGES = 100;

function serializeMessage(msg: ChatMessage): StoredMessage {
  return {
    ...msg,
    timestamp: msg.timestamp.toISOString(),
  };
}

function deserializeMessage(msg: StoredMessage): ChatMessage {
  return {
    ...msg,
    timestamp: new Date(msg.timestamp),
  };
}

function loadFromStorage(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredMessage[];
    return parsed.map(deserializeMessage);
  } catch {
    return [];
  }
}

function saveToStorage(messages: ChatMessage[]): void {
  try {
    const trimmed = messages.slice(-MAX_MESSAGES);
    const serialized = trimmed.map(serializeMessage);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
  } catch {
    // ignore storage errors
  }
}

export function useChatHistory(
  initialMessage: ChatMessage,
): [
  ChatMessage[],
  (msgs: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => void,
  () => void,
] {
  const [messages, setMessagesInternal] = useState<ChatMessage[]>(() => {
    const stored = loadFromStorage();
    return stored.length > 0 ? stored : [initialMessage];
  });

  // Save whenever messages change
  useEffect(() => {
    saveToStorage(messages);
  }, [messages]);

  const setMessages = useCallback(
    (update: ChatMessage[] | ((prev: ChatMessage[]) => ChatMessage[])) => {
      setMessagesInternal((prev) => {
        const next = typeof update === "function" ? update(prev) : update;
        return next.slice(-MAX_MESSAGES);
      });
    },
    [],
  );

  const clearHistory = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setMessagesInternal([initialMessage]);
  }, [initialMessage]);

  return [messages, setMessages, clearHistory];
}
