import { MessageSeenSvg } from "@/lib/svgs";
import { IMessage, useConversationStore } from "@/store/chat-store";
import { Dialog, DialogContent, DialogDescription } from "../ui/dialog";
import ChatBubbleAvatar from "./chat-bubble-avatar";
import DateIndicator from "./date-indicator";
import Image from "next/image";
import ReactPlayer from "react-player";
import { useState } from "react";
import ChatAvatarActions from "./chat-avatar-actions";
import { Bot } from "lucide-react";

type ChatBubbleProps = {
  message: IMessage;
  me: any;
  previousMessage?: IMessage;
};

const ChatBubble = ({ me, message, previousMessage }: ChatBubbleProps) => {
  const [open, setOpen] = useState(false);
  const date = new Date(message._creationTime);
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  const time = `${hour}:${minute}`;

  const { selectedConversations } = useConversationStore();
  const isMember =
    selectedConversations?.participants.includes(message.senderID) || false;
  const isGroup = selectedConversations?.isGroup;
  const fromMe = message.senderID === me._id;
  const fromChatGPT: boolean = message.senderName === "ChatGPT";
  const bgClass = fromMe
    ? "bg-green-chat"
    : fromChatGPT
      ? "bg-blue-500 text-white"
      : "bg-white dark:bg-gray-primary";

  if (!fromMe) {
    return (
      <>
        <DateIndicator message={message} previousMessage={previousMessage} />

        <div className="flex gap-1 w-2/3">
          <ChatBubbleAvatar
            isGroup={isGroup}
            isMember={isMember}
            message={message}
            fromChatGPT={fromChatGPT}
          />
          <div
            className={`flex flex-col z-20 max-w-fit px-2 pt-1 rounded-md shadow-md relative ${bgClass}`}
          >
            {!fromChatGPT && (
              <OtherMessageIndicator fromChatGPT={fromChatGPT} />
            )}
            {fromChatGPT && (
              <Bot size={16} className="absolute bottom-[2px] left-2" />
            )}
            {<ChatAvatarActions message={message} me={me} />}
            {fromChatGPT && message.messageType !== "image" && (
              <TextMessage message={message} />
            )}
            {!fromChatGPT && <TextMessage message={message} />}
            {message.messageType === "image" && (
              <ImageMessage
                message={message}
                handleClick={() => setOpen(true)}
              />
            )}
            {message.messageType === "video" && (
              <VideoMessage message={message} />
            )}

            {open && (
              <ImageDialog
                src={message.content}
                open={open}
                onClose={() => setOpen(false)}
              />
            )}
            <MessageTime time={time} fromMe={fromMe} />
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <DateIndicator message={message} previousMessage={previousMessage} />

      <div className="flex gap-1 w-2/3 ml-auto">
        <div
          className={`flex  z-20 max-w-fit px-2 pt-1 rounded-md shadow-md ml-auto relative ${bgClass}`}
        >
          <SelfMessageIndicator />
          {message.messageType === "text" && <TextMessage message={message} />}
          {message.messageType === "image" && message?.content && (
            <ImageMessage message={message} handleClick={() => setOpen(true)} />
          )}
          {message.messageType === "video" && (
            <VideoMessage message={message} />
          )}
          {open && message?.content && (
            <ImageDialog
              src={message.content}
              open={open}
              onClose={() => setOpen(false)}
            />
          )}
          {/* <LoadingImageDialog open={true} /> */}
          <MessageTime time={time} fromMe={fromMe} />
        </div>
      </div>
    </>
  );
};
export default ChatBubble;

const MessageTime = ({ time, fromMe }: { time: string; fromMe: boolean }) => {
  return (
    <p className="text-[10px] mt-2 self-end flex gap-1 items-center">
      {time} {fromMe && <MessageSeenSvg />}
    </p>
  );
};

interface IOtherMessageIndicator {
  fromChatGPT: boolean;
}

const OtherMessageIndicator = ({ fromChatGPT }: IOtherMessageIndicator) => (
  <div
    className={`absolute ${fromChatGPT ? "bg-blue-500 text-white" : "bg-white dark:bg-gray-primary"} top-0 -left-[4px] w-3 h-3 rounded-bl-full`}
  />
);

const SelfMessageIndicator = () => (
  <div className="absolute bg-green-chat top-0 -right-[3px] w-3 h-3 rounded-br-full overflow-hidden" />
);

const TextMessage = ({ message }: { message: IMessage }) => {
  const isLink = /^(ftp|http|https):\/\/[^ "]+$/.test(message.content); // Check if the content is a URL

  return (
    <div>
      {isLink ? (
        <a
          href={message.content}
          target="_blank"
          rel="noopener noreferrer"
          className={`mr-2 text-sm font-light text-blue-400 underline`}
        >
          {message.content}
        </a>
      ) : (
        <p className={`mr-2 text-sm font-light`}>{message.content}</p>
      )}
    </div>
  );
};

const VideoMessage = ({ message }: { message: IMessage }) => {
  return (
    <ReactPlayer
      url={message.content}
      width="250px"
      height="250px"
      controls={true}
      light={true}
    />
  );
};

const ImageMessage = ({
  message,
  handleClick,
}: {
  message: IMessage;
  handleClick: () => void;
}) => {
  console.log({ CONTENT: message });
  return (
    <div className="w-[250px] h-[250px] m-2 relative">
      <Image
        src={message?.content}
        fill
        className="cursor-pointer object-cover rounded"
        alt="image"
        onClick={handleClick}
      />
    </div>
  );
};

const ImageDialog = ({
  src,
  onClose,
  open,
}: {
  open: boolean;
  src: string;
  onClose: () => void;
}) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose();
      }}
    >
      <DialogContent className="min-w-[750px]">
        <DialogDescription className="relative h-[450px] flex justify-center">
          <Image
            src={src}
            fill
            className="rounded-lg object-contain"
            alt="image"
          />
        </DialogDescription>
      </DialogContent>
    </Dialog>
  );
};
