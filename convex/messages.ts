import { ConvexError, v } from "convex/values";
import { mutation } from "./_generated/server";

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

    if (!conversation.participants.includes(user._id)) {
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
  },
});
