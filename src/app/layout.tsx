import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jin's Research Group",
  description: "Jin's Research Group - Anhui Normal University",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
