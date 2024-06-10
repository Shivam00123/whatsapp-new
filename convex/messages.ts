import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { api, internal } from "./_generated/api";

export const sendTextMessage = mutation({
  args: {
    conversation: v.id("conversations"),
    sender: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq(
          "tokenIdentifier",
          identity.tokenIdentifier.replace("https://", "")
        )
      )
      .unique();
    if (!user) {
      throw new ConvexError("User not found");
    }

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversation))
      .first();

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    if (!conversation.participants.includes(user?._id)) {
      throw new ConvexError(
        "You are not allowed to send message on this conversation!"
      );
    }

    const message = await ctx.db.insert("messages", {
      conversation: args.conversation,
      sender: args.sender,
      content: args.content,
      messageType: "text",
    });

    if (args.content.startsWith("@gpt")) {
      const res = await ctx.scheduler.runAfter(0, api.openai.chat, {
        messageBody: args.content,
        conversation: args.conversation,
      });
    }
    if (args.content.startsWith("@dall-e")) {
      const res = await ctx.scheduler.runAfter(0, api.openai.dall_e, {
        messageBody: args.content,
        conversation: args.conversation,
      });
    }
  },
});

export const sendMediaMessage = mutation({
  args: {
    conversation: v.id("conversations"),
    sender: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversation))
      .first();

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    let content = (await ctx.storage.getUrl(args.content)) as string;

    await ctx.db.insert("messages", {
      conversation: args.conversation,
      sender: args.sender,
      content,
      messageType: "image",
    });
  },
});
export const sendVideoMessage = mutation({
  args: {
    conversation: v.id("conversations"),
    sender: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const conversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("_id"), args.conversation))
      .first();

    if (!conversation) {
      throw new ConvexError("Conversation not found");
    }

    let content = (await ctx.storage.getUrl(args.content)) as string;

    await ctx.db.insert("messages", {
      conversation: args.conversation,
      sender: args.sender,
      content,
      messageType: "video",
    });
  },
});

export const getMessages = query({
  args: {
    conversationID: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new ConvexError("Unauthorized");

    const Allmessages = await ctx.db
      .query("messages")
      .withIndex("by_conversation", (q) =>
        q.eq("conversation", args.conversationID)
      )
      .collect();

    const userprofileCache = new Map();

    const senderDetails = await Promise.all(
      Allmessages?.map(async (message) => {
        let sender;

        if (userprofileCache.has(message.sender)) {
          sender = userprofileCache.get(message.sender);
        } else {
          sender = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("_id"), message.sender))
            .unique();
          userprofileCache.set(message.sender, sender);
        }
        return {
          ...{
            _id: message?._id,
            content: message.content,
            _creationTime: message._creationTime,
            messageType: message.messageType,
          },
          ...{
            senderID: sender?._id || "ChatGPT",
            senderEmail: sender?.email,
            senderName: sender?.name || message?.sender,
            senderImage: sender?.image,
            senderIsOnline: sender?.isOnline,
          },
        };
      })
    );
    return senderDetails;
  },
});

export const sendChatGPTMessage = mutation({
  args: {
    content: v.string(),
    conversation: v.id("conversations"),
    messageType: v.union(v.literal("text"), v.literal("image")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      content: args.content,
      sender: "ChatGPT",
      messageType: args.messageType,
      conversation: args.conversation,
    });
  },
});
