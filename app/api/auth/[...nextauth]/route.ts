import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { GoogleProviderConfig } from "@/interfaces";
import connect from "@/utlis/db";
import UserModel from "@/models/userSchema";


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'email profile',  // Ensure email and profile scopes are requested
        },
      },
    } as GoogleProviderConfig),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Log account and user info for debugging
      console.log('SignIn Callback:', { user, account });

      // Proceed only if the provider is Google
      if (account?.provider === "google") {
        await connect(); // Connect to database

        try {
          // Check if user already exists in the database
          const existingUser = await UserModel.findOne({ email: user.email });

          // If user doesn't exist, create a new user
          if (!existingUser) {
            const newUser = new UserModel({
              email: user.email,
              name: user.name,
              image: user.image,
            });

            // Save new user to the database
            await newUser.save();
            console.log("New user created:", newUser);
          } else {
            console.log("Existing user signed in:", existingUser);
          }

          // Return true to allow sign-in
          return true;
        } catch (err) {
          console.log("Error during sign-in:", err);
          return false; // Prevent sign-in if an error occurs
        }
      }
      return false; // Block sign-in for other providers
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      // Optionally log session data for debugging
      console.log("Session callback:", { session, token });

      if (token) {
        session.user = {
          ...session.user,
          email: token.email,
          name: token.name,
          image: token.picture,
        };
      }

      // Optionally you can modify session properties here
      return session;
    },
  },
});

export { handler as GET, handler as POST };
