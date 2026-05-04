import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const accelerateUrl =
  process.env.PRISMA_ACCELERATE_URL ?? process.env.ACCELERATE_URL;

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    accelerateUrl:
      accelerateUrl ??
      (() => {
        throw new Error(
          "PrismaClient requires `accelerateUrl` (or a SQL driver adapter). Set PRISMA_ACCELERATE_URL.",
        );
      })(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export { prisma };
