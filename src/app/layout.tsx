import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "OpenCodeLingo - Learn to Code, Unlocked",
  description:
    "A free, open-source platform for learning any programming language. No hearts, no lives, just learning.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} p-3 md:p-5`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
