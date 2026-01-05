import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const CreateUser = mutation({
    args: { 
        name: v.string(), 
        email: v.string(), 
        image: v.string(), 
        uid: v.string() 
    },
    handler: async (ctx, args) => {
        const user=await ctx.db.query('users').filter((q)=>q.eq(q.field('email'),args.email)).collect();
        if(user.length===0){
            await ctx.db.insert("users", {
                name: args.name,
                email: args.email,
                image: args.image,
                uid: args.uid,
            });   
        }
    }
});

export const GetUserByEmail = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        const user=await ctx.db.query('users').filter((q)=>q.eq(q.field('email'),args.email)).collect();
        if(user.length>0){
            return user[0];
        }
        return null;
    }
});