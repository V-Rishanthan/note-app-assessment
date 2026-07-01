"use client";

import { useEffect, useState } from "react";

interface Note {
  _id: string;
  title: string;
  description: string;
}

export default function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchNotes();
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-6">Your Notes</h1>

      {loading ? (
        <p>Loading...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-500">No notes found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
              <p className="text-gray-600 text-sm">{note.description}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
