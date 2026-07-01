"use client";

import { useEffect, useState } from "react";
import { Edit3, Trash2 } from "lucide-react";

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
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const data = await response.json();
        alert(data?.message || "Failed to delete note");
        return;
      }

      alert("Note deleted successfully");
      setNotes((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error(error);
      alert("Something went wrong while deleting the note");
    }
  }

  function handleEdit(note: Note) {
    window.dispatchEvent(
      new CustomEvent("open-note-dialog", { detail: { note } }),
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold">Your Notes</h1>
        <p className="text-sm text-slate-500">
          {notes.length} note{notes.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            No notes found. Create your first note!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note._id}
              className="relative rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="absolute right-4 top-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(note)}
                  className="rounded-full bg-indigo-100 p-2 text-indigo-600 hover:bg-indigo-200 transition-colors"
                  aria-label="Edit note"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(note._id)}
                  className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 transition-colors"
                  aria-label="Delete note"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <h2 className="text-xl font-semibold mb-2">{note.title}</h2>
              <p className="text-gray-600 text-sm line-clamp-3">
                {note.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
