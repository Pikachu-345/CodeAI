import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const CreateWorkspace = mutation({
    args: {
        messages: v.any(),
        fileData: v.optional(v.any()),
        user: v.id("users"),
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.insert("workspace", {
            messages: args.messages,
            fileData: args.fileData,
            user: args.user,
        });
        return result;
    }
});