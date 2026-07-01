"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Trash2 } from "lucide-react";

interface FormData {
  title: string;
  description: string;
}

export default function AddNoteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const customEvent = event as CustomEvent;
      const note = customEvent.detail?.note;

      if (note) {
        setEditingId(note._id);
        setFormData({ title: note.title, description: note.description });
        setIsOpen(true);
      }
    };

    window.addEventListener("open-note-dialog", handleOpen as EventListener);
    return () => {
      window.removeEventListener(
        "open-note-dialog",
        handleOpen as EventListener,
      );
    };
  }, []);

  function resetForm() {
    setFormData({ title: "", description: "" });
    setErrors({ title: "", description: "" });
    setEditingId(null);
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  function validateForm() {
    let isValid = true;
    const newErrors = { title: "", description: "" };

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const method = editingId ? "PATCH" : "POST";
    const body: any = {
      title: formData.title,
      description: formData.description,
    };
    if (editingId) body.id = editingId;

    try {
      const response = await fetch("/api/notes", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data?.message || "Failed to save note");
        setLoading(false);
        return;
      }

      alert(
        editingId ? "Note updated successfully!" : "Note created successfully!",
      );
      setIsOpen(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!editingId) return;
    if (!confirm("Delete this note?")) return;

    setLoading(true);

    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: editingId }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data?.message || "Failed to delete note");
        setLoading(false);
        return;
      }

      alert("Note deleted successfully!");
      setIsOpen(false);
      resetForm();
      window.location.reload();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetForm();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <button className="fixed bottom-8 right-8 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 z-40">
          <Plus size={28} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 border-0 shadow-lg">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center">
            {editingId ? "Edit Note" : "Create New Note"}
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            {editingId
              ? "Update or delete this note"
              : "Add a title and description for your new note"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
              disabled={loading}
              className={`h-11 border-0 bg-gray-50 focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.title && (
              <p className="text-sm text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter note description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              disabled={loading}
              className={`border-0 bg-gray-50 focus:ring-2 focus:ring-indigo-500 resize-none ${
                errors.description ? "ring-2 ring-red-500" : ""
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            {editingId && (
              <Button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="flex-1 h-11 bg-red-500 hover:bg-red-600 text-white rounded-full font-medium border-0 shadow-none"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                resetForm();
              }}
              disabled={loading}
              className="flex-1 h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-medium border-0 shadow-none"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full font-medium border-0 shadow-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                "Save Changes"
              ) : (
                "Save Note"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
