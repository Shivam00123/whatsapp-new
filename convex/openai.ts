import OpenAI from "openai";
import { action } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { api } from "./_generated/api";

const apiKey = process.env.OPENAI_SECRET_KEY;

const openai = new OpenAI({ apiKey });

export const chat = action({
  args: {
    messageBody: v.string(),
    conversation: v.id("conversations"),
  },
  handler: async (ctx, args) => {
    console.log("Calling OpenAI chat with arguments:", args);
    try {
      const res = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a terse bot in a group chat responding to questions with 1-sentence answers.",
          },
          {
            role: "user",
            content: args.messageBody,
          },
        ],
      });
      const messageContent = res.choices[0].message.content;

      await ctx.runMutation(api.messages.sendChatGPTMessage, {
        content:
          messageContent ?? "I am sorry I don't understand this question",
        conversation: args.conversation,
      });
    } catch (error) {
      console.error("Error while calling OpenAI API:", error);
    }
  },
});
