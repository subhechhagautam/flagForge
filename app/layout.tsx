import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Authprovider from "@/providers/auth-provider";
const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flag Forge",
  description: "CTF - Capture The Flag (CTF)",
  metadataBase: new URL("https://flagforge.aryan4.com.np"),
  alternates: {
    canonical: "/",
    languages: {
      en: "/en",
      hi: "/hi",
      bn: "/bn",
    },
  },

  applicationName: "FlagForge CTF",
  referrer: "origin-when-cross-origin",
  keywords: [],
  authors: [{ name: "@Aryanstha", url: "https://github.com/aryan4859" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Authprovider>
          <Navbar />
          {children}
          <Footer />
        </Authprovider>
      </body>
    </html>
  );
}
