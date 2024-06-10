import { IMessage } from "@/store/chat-store";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ChatBubbleAvatarProps = {
  message: IMessage;
  isMember: boolean;
  isGroup: boolean | undefined;
  fromChatGPT: boolean;
};

const ChatBubbleAvatar = ({
  isGroup,
  isMember,
  message,
  fromChatGPT,
}: ChatBubbleAvatarProps) => {
  if (!isGroup && !fromChatGPT) return null;

  return (
    <Avatar className="overflow-visible relative">
      {message.senderIsOnline && isMember && (
        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border-2 border-foreground" />
      )}
      <AvatarImage
        src={
          message.senderImage
            ? message.senderImage
            : fromChatGPT
              ? "/gpt.png"
              : ""
        }
        className="rounded-full object-cover w-8 h-8"
      />
      <AvatarFallback className="w-8 h-8 ">
        <div className="animate-pulse bg-gray-tertiary rounded-full"></div>
      </AvatarFallback>
    </Avatar>
  );
};
export default ChatBubbleAvatar;
