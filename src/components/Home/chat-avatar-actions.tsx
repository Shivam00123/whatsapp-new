import { IMessage, useConversationStore } from "@/store/chat-store";
import { useMutation } from "convex/react";
import { Ban, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../../convex/_generated/api";
import React from "react";

type ChatAvatarActionsProps = {
  message: IMessage;
  me: any;
};

const ChatAvatarActions = ({ me, message }: ChatAvatarActionsProps) => {
  const { selectedConversations, setSelectedConversations } =
    useConversationStore();

  const isMember = selectedConversations?.participants.includes(
    message.senderID
  );
  const kickUser = useMutation(api.conversations.kickUserFromGroup);
  const createConversation = useMutation(api.conversations.createConversations);
  const fromAI = message?.senderName === "ChatGPT";
  const isGroup = selectedConversations?.isGroup;

  const handleKickUser = async (e: React.MouseEvent) => {
    if (fromAI) return;
    e.stopPropagation();
    if (!selectedConversations) return;
    try {
      await kickUser({
        conversationId: selectedConversations._id,
        userId: message.senderID,
      });

      setSelectedConversations({
        ...selectedConversations,
        participants: selectedConversations.participants.filter(
          (id) => id !== message.senderID
        ),
      });
    } catch (error) {
      toast.error("Failed to kick user");
    }
  };

  const handleCreateConversation = async () => {
    if (fromAI) return;

    try {
      const conversationId = await createConversation({
        isGroup: false,
        participants: [me._id, message.senderID],
      });

      setSelectedConversations({
        _id: conversationId,
        name: message.senderName,
        participants: [me._id, message.senderID],
        isGroup: false,
        isOnline: message.senderIsOnline,
        image: message.senderImage,
      });
    } catch (error) {
      toast.error("Failed to create conversation");
    }
  };

  return (
    <div
      className="text-[11px] flex gap-4 justify-between font-bold cursor-pointer group"
      onClick={handleCreateConversation}
    >
      {(isGroup || fromAI) && message.senderName}

      {!isMember && !fromAI && isGroup && (
        <Ban size={16} className="text-red-500" />
      )}
      {isGroup && isMember && selectedConversations?.admin === me._id && (
        <LogOut
          size={16}
          className="text-red-500 opacity-0 group-hover:opacity-100"
          onClick={handleKickUser}
        />
      )}
    </div>
  );
};
export default ChatAvatarActions;
