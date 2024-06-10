import { useQuery } from "convex/react";
import ChatBubble from "./chat-bubble";
import { api } from "../../../convex/_generated/api";
import { useConversationStore } from "@/store/chat-store";
import { useEffect, useRef, useState } from "react";

const MessageContainer = () => {
  const { selectedConversations } = useConversationStore();
  const messages = useQuery(api.messages.getMessages, {
    conversationID: selectedConversations!._id,
  });
  const [loadingDallEImage, setLoadingDallEImage] = useState<boolean>(true);
  const lastMsgRef = useRef<HTMLDivElement>(null);

  const me = useQuery(api.users.getMe);

  useEffect(() => {
    setTimeout(() => {
      lastMsgRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="relative p-3 flex-1 overflow-auto h-full bg-chat-tile-light dark:bg-chat-tile-dark">
      <div className="mx-12 flex flex-col gap-3">
        {messages?.map((msg, idx) => (
          <div key={msg._id} ref={lastMsgRef}>
            <ChatBubble
              message={msg}
              me={me}
              previousMessage={idx > 0 ? messages[idx - 1] : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default MessageContainer;

const LoadingDallEImage = () => {
  return <div className="w-[250px] h-[250px] m-2 relative bg-gray-500"></div>;
};
