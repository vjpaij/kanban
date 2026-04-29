"use client";

import dynamic from "next/dynamic";

export const KanbanBoardClient = dynamic(
  () => import("./KanbanBoard").then((mod) => mod.KanbanBoard),
  {
    loading: () => <main aria-label="Loading board" />,
    ssr: false,
  },
);
