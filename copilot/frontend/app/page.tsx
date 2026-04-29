'use client';

import Board from '@/components/Board';
import { initialColumns } from '@/lib/data';
import type { Column } from '@/lib/types';

export default function Home() {
  const initialState: Column[] = initialColumns;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 rounded-[2rem] border border-slate-200 bg-white/90 p-8 shadow-card backdrop-blur-md">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
              <h1 className="text-3xl font-semibold text-navy sm:text-4xl">Kanban Board</h1>
            </div>
          </div>
        </section>

        <Board initialColumns={initialState} />
      </div>
    </main>
  );
}
