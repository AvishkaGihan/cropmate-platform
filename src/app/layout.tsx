import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cropmate - Connecting Farmers with Vendors",
  description:
    "A platform where vendors can buy crops from farmers and drivers can deliver them",
  keywords: [
    "agriculture",
    "farmers",
    "vendors",
    "crop marketplace",
    "food supply chain",
  ],
  authors: [{ name: "Avishka Gihan" }],
  creator: "Avishka Gihan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
