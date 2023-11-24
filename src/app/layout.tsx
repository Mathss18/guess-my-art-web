import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import GlobalProviders from "./global-providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guess My Art",
  description: "Guess My Art",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProviders>{children}</GlobalProviders>
      </body>
    </html>
  );
}
