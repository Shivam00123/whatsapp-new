"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Video, X } from "lucide-react";
import MessageInput from "./message-input";
import MessageContainer from "./message-container";
import ChatPlaceHolder from "@/components/Home/chat-placeholder";
import GroupMembersDialog from "./group-members-dialog";
import { useConversationStore } from "@/store/chat-store";

const RightPanel = () => {
  const { selectedConversations, setSelectedConversations } =
    useConversationStore();
  if (!selectedConversations) return <ChatPlaceHolder />;

  const conversationName = selectedConversations?.isGroup
    ? selectedConversations.groupName
    : selectedConversations?.name;

  const conversationImage = selectedConversations?.isGroup
    ? selectedConversations?.groupImage
    : selectedConversations.image;

  return (
    <div className="w-3/4 flex flex-col">
      <div className="w-full sticky top-0 z-40">
        {/* Header */}
        <div className="flex justify-between bg-gray-primary p-3">
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage src={conversationImage} className="object-cover" />
              <AvatarFallback>
                <div className="animate-pulse bg-gray-tertiary w-full h-full rounded-full" />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p>{conversationName}</p>
              {selectedConversations?.isGroup && (
                <GroupMembersDialog
                  selectedConversations={selectedConversations}
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-7 mr-5">
            <a href="/video-call" target="_blank">
              <Video size={23} />
            </a>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => setSelectedConversations(null)}
            />
          </div>
        </div>
      </div>
      {/* CHAT MESSAGES */}
      <MessageContainer />

      {/* INPUT */}
      <MessageInput />
    </div>
  );
};
export default RightPanel;
