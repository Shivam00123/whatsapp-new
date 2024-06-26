import { Id } from "../../convex/_generated/dataModel";
import { create } from "zustand";

export type Conversation = {
  _id: Id<"conversations">;
  image?: string;
  participants: Id<"users">[];
  isGroup: boolean;
  name?: string;
  groupName?: string;
  groupImage?: string;
  isOnline?: boolean;
  admin?: Id<"users">;
  lastMessage?: {
    _id: Id<"messages">;
    conversation: Id<"conversations">;
    content: string;
    sender: Id<"users">;
  };
};

type ConversationStore = {
  selectedConversations: Conversation | null;
  setSelectedConversations: (conversation: Conversation | null) => void;
};

export const useConversationStore = create<ConversationStore>((set) => ({
  selectedConversations: null,
  setSelectedConversations: (conversation) =>
    set({ selectedConversations: conversation }),
}));

export interface IMessage {
  _id: Id<"messages">;
  content: string;
  _creationTime: number;
  messageType: string;
  senderID: Id<"users">;
  senderEmail: string;
  senderName: string;
  senderImage: string;
  senderIsOnline: boolean;
  isOnline?: boolean;
}
