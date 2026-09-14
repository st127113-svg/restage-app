import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DwellWise Group3",
  description:
    "Upload a photo of an empty or existing room, pick a room type and style, and get an AI-redecorated version back.",
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
