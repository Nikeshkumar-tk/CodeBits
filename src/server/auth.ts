/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/server/db";
import { IdentityProvider, User } from "@prisma/client";
import ErrorCode from "@/lib/shared/errors/ErrorCode";
import { decodePassword } from "@/lib/shared/utils/hash";
import { USER_ROLES } from "@/lib/shared/enums";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }
  interface User {
    email:string,
    role:USER_ROLES,
    username:string
    identityProvider:IdentityProvider,
  }
}
declare module "next-auth/jwt" {
interface JWT {
  id?: string | number;
  name?: string | null;
  username?: string | null;
  email?: string | null;
  role?: USER_ROLES
  identityProvider:IdentityProvider,
}
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ token, session }) {
      console.log("consoling from token", token)
      session.user.email = token?.email!;
      session.user.identityProvider = token.identityProvider;
      session.user.role = token.role!;
      session.user.username = token.name!
      return session;
    },
    async jwt({ token, user, session, account, profile }) {
      console.log("consoling from token", token)
      const existingUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });
      if (!existingUser) return token;
      token.email = existingUser.email;
      token.id = existingUser.id;
      token.name = existingUser.name;
      token.role = existingUser.role as USER_ROLES;
      token.identityProvider = existingUser.identityProvider;
      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env.GOOGLE_CLIENT_ID!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Username",
          type: "email",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      async authorize(credentials, req) {
        let result:Omit<User, "image"> | null = null;
        if (!credentials) {
          console.error(`For some reason credentials are missing`);
          throw new Error(ErrorCode.DataNotPrivided);
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email.toLowerCase(),
          },
          select: {
            email: true,
            emailVerified: true,
            role: true,
            name: true,
            id: true,
            identityProvider: true,
            password: true,
          },
        });
        if (!user) throw new Error(ErrorCode.IncorrectCredentials);
        const isPasswordVerified = await decodePassword(
          user.password as string,
          credentials.password
        );
        if (isPasswordVerified) result = user;
        return result;
      },
    })
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
}
