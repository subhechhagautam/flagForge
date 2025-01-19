import NextAuth, { DefaultUser, DefaultSession, DefaultJWT } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            totalScore?: number;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        totalScore?: number;
    }

    interface JWT extends DefaultJWT {
        totalScore?: number;
    }
}