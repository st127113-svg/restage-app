import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DwellWise — AI room redesign, priced",
  description:
    "Upload a photo of a room, pick a room type and style, and get an AI-redecorated version back with a priced, shoppable, hireable plan.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
