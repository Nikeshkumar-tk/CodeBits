import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { hashPassword } from "@/lib/shared/utils/hash";
import { IdentityProvider } from "@prisma/client";
import { prisma } from "@/server/db";
import ErrorCode from "@/lib/shared/errors/ErrorCode";

export const authRouter = createTRPCRouter({
  register: publicProcedure
  .input(
    z.object({
      name: z.string(),
      email: z.string(),
      password: z.string(),
      identityProvider:z.optional(z.enum(["GOOGLE", "CODEBITS"]))
    })
  )
  .mutation(async ({ input: data }) => {
    if(!data.email || !data.name || !data.password) throw new Error(ErrorCode.DataNotPrivided)
    data.password = await hashPassword(data.password)
    data.identityProvider = IdentityProvider.CODEBITS
    const user = await prisma.user.create({ data });
    if(!user) throw new Error(ErrorCode.InternalServerError)
    return user
  }),
});
