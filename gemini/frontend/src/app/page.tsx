"use client";

import dynamic from "next/dynamic";
import { KanbanProvider } from "@/context/KanbanContext";

const KanbanBoard = dynamic(() => import("@/components/KanbanBoard"), { ssr: false });

export default function Home() {
  return (
    <KanbanProvider>
      <KanbanBoard />
    </KanbanProvider>
  );
}
