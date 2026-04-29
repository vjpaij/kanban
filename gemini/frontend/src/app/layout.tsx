import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kanban Premium",
  description: "A gorgeous, glassmorphism Kanban board",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={outfit.className}>
        <div className="background-mesh"></div>
        <div className="app-container">
          <header className="header">
            <div className="header-content">
              <h1>Kanban<span className="accent">Pro</span></h1>
              <div className="header-glow"></div>
            </div>
          </header>
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
