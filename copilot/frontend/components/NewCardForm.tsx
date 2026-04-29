'use client';

import { useState } from 'react';

interface NewCardFormProps {
  onAdd: (title: string, details: string) => void;
}

export default function NewCardForm({ onAdd }: NewCardFormProps) {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim() || !details.trim()) {
      return;
    }

    onAdd(title.trim(), details.trim());
    setTitle('');
    setDetails('');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-3xl border border-slate-200 bg-white p-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Title</label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="New card title"
          aria-label="New card title"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">Details</label>
        <textarea
          value={details}
          onChange={(event) => setDetails(event.target.value)}
          className="min-h-[88px] w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-primary"
          placeholder="Add a short description"
          aria-label="New card details"
        />
      </div>
      <button type="submit" className="w-full rounded-2xl bg-secondary px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600">
        Add card
      </button>
    </form>
  );
}
