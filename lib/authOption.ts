import { NextApiRequest } from "next";
import dbConnect from "./dbConnect";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { isRateLimited, resetAttempts } from "./rateLimiter";
const bcrypt = require('bcrypt');

const authOptions : AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },

      // @ts-ignore
      async authorize(credentials, req : NextApiRequest) {

        const { email, password } = credentials ?? {};

        // console.log("USR ::", email, password)

        if (!email || !password) {
          throw new Error("Email and password required");
        }

        // Extract IP address
        const ip =
          req.headers["x-forwarded-for"]?.toString().split(",")[0]?.trim() ||
          req.socket?.remoteAddress ||
          "unknown";

        const { limited, message } = isRateLimited(ip);
        if (limited) {
          throw new Error(message || "Rate limit exceeded.");
        }

        const collection = await dbConnect("lib_user");
        const user = await collection.findOne({ email });

        // console.log("USER :::", user);

        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new Error("Invalid credentials");
        }

        resetAttempts(ip); // Clear on success
        
        return user;
      }
    })
  ],

  callbacks: {

    async session({ session, token }) {
      
        session.user = {
            username: token.username,
            email: token.email,
            role: token.role,
            user_status: token.user_status,
            libraryId: token.libraryId,
        };
        // console.log("SESSION USR :::", session);

        return session;
    },
    async jwt({ token, user }) {
    //   console.log("TKN ", token)
    //   console.log("USR :::", user);
      if (user) {
        token.username = user.username;
        token.email = user.email;
        token.role = user.role;
        token.user_status = user.user_status;
        token.libraryId = user.libraryId;
      }
    //   console.log("TOKEN :::", token);
      return token;
    }
  },
  pages: {
    signIn: "/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
}


export default authOptions;