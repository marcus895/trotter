import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trotter — AI Travel Planning",
  description:
    "Your personal AI travel planner. Trotter finds the best flights, hotels, and experiences, then sends you directly to the right place to book.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
