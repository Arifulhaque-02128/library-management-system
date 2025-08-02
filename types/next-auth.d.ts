import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      username?: string;
      role?: string;
      user_status?: string;
      libraryId?: number;
    } & DefaultSession["user"];
  }

  interface User {
    email: string;
    username?: string;
    role?: string;
    user_status?: string;
    libraryId?: number;
  }

}

declare module "next-auth/jwt" {
  interface JWT {
    email: string;
    username?: string;
    role?: string;
    user_status?: string;
    libraryId?: number;
  }
}

