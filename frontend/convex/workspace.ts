import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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

export const GetWorkspaceById = query({
    args: {
        workspaceId: v.id("workspace"),
    },
    handler: async (ctx, args) => {
        const workspace = await ctx.db.get(args.workspaceId);
        return workspace;
    }
});

export const UpdateWorkspaceById = mutation({
    args: {
        workspaceId: v.id("workspace"),
        messages: v.any(),
    },
    handler: async (ctx, args) => {
        const result = ctx.db.patch(args.workspaceId,{
            messages: args.messages
        });
        return result;
    }
})