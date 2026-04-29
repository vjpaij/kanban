import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kanban Board",
  description: "A focused Kanban MVP for project planning.",
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
