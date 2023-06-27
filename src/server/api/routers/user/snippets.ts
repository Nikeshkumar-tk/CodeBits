import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../../trpc";
import { MONGO_COLLECTIONS } from "@/lib/shared/enums";
import logger from "@/lib/shared/utils/logger";
import { ISnippetSchema } from "@/lib/shared/schemas/interfaces";

const ZAddSnippetUserInfo = z.object({
    username: z.string(),
    userEmail: z.string()
})
const ZAddSnippetHandlerInputSchema = z.object({
    title: z.string(),
    description: z.optional(z.string()),
    private: z.boolean(),
    snippet: z.string(),
    language: z.string()
})
const ZAddSnippetSchema = ZAddSnippetHandlerInputSchema.merge(ZAddSnippetUserInfo)

export const snippetRouter = createTRPCRouter({
    add:protectedProcedure.input(ZAddSnippetHandlerInputSchema).mutation(async ({ctx, input}) => {
        const { session } = ctx
        try {
            const newSnippetObject = ZAddSnippetSchema.parse({
                ...input,
                userEmail: session.user.email,
                username: session.user.name
            })
            const result = await ctx.mongo.createItem({ data: newSnippetObject, resource: MONGO_COLLECTIONS.SNIPPETS })
            return result
        } catch (error) {
            logger.error({
                message: "Operation failed",
                error
            })
        }
    }),
    getAllSnippets:publicProcedure.input(z.null()).query(async ({ctx}) => {
        const snippets = await ctx.mongo.getItems({resource:MONGO_COLLECTIONS.SNIPPETS})
        return snippets as ISnippetSchema[]
    })
})