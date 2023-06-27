import { authRouter } from "@/server/api/routers/auth";
import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user/_router";
import { appConfigs } from "./routers/configs/_router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  user:userRouter,
  configs:appConfigs
});

// export type definition of API
export type AppRouter = typeof appRouter;
