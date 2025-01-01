import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProviderConfig } from "@/interfaces";
import connect from "@/utlis/db";
import UserModel from "@/models/userSchema";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    } as GoogleProviderConfig),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connect();

        try {
          // Check if user already exists in the database
          const existingUser = await UserModel.findOne({ email: user.email });
          
          if (!existingUser) {
            // If user does not exist, create a new one
            const newUser = new UserModel({
              email: user.email,
              name: user.name,
              image: user.image,
            });

            await newUser.save();
          }
          
          // Return true if the user is successfully signed in
          return true;
        } catch (err) {
          console.log("Error saving user", err);
          // Return false if there is an error
          return false;
        }
      }
      // Return false if the provider is not Google
      return true;
    },
  },
});

export { handler as GET, handler as POST };