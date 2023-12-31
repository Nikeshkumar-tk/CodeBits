/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaClient } from "@prisma/client";
import MongoDal from "@/lib/shared/dals/mongo";
import { env } from "@/env.mjs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};
const globalForMongo = globalThis as unknown as {
  mongo: MongoDal | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const mongo = globalForMongo.mongo ?? new MongoDal()

if (env.NODE_ENV !== "production") globalForMongo.mongo = mongo;

