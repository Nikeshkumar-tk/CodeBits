import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { type MONGO_COLLECTIONS } from "@/lib/shared/enums";




export const appConfigs = createTRPCRouter({
    getConfig: protectedProcedure.input(z.enum(["SnippetLanguages"])).query(async ({ input, ctx }) => {
        const result = await ctx.mongo.getItems({ resource: input as MONGO_COLLECTIONS})
        return result
   })
})