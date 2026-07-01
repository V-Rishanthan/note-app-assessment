"use client";

import { useState } from "react";
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
import { Plus, Loader2 } from "lucide-react";

export default function AddNoteDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
  });

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

    try {
      const payload = { ...formData };

      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      let data = null;
      try {
        data = await response.json();
      } catch (e) {
        console.error("Invalid JSON response from /api/notes", e);
      }

      if (!response.ok) {
        const msg =
          data?.message || response.statusText || "Failed to create note";
        console.error("/api/notes error:", response.status, msg, data);
        alert(msg);
        setLoading(false);
        return;
      }

      alert("Note created successfully!");
      setIsOpen(false);
      setFormData({ title: "", description: "" });
      window.location.reload();
    } catch (error) {
      alert("Something went wrong");
    }

    setLoading(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="fixed bottom-8 right-8 bg-indigo-500 hover:bg-indigo-600 text-white p-4 rounded-full shadow-lg shadow-indigo-500/30 transition-all hover:scale-105 z-40">
          <Plus size={28} />
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md p-6 border-0 shadow-lg">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Create New Note
          </DialogTitle>
          <DialogDescription className="text-center mt-2">
            Add a title and description for your new note
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Field */}
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

          {/* Description Field */}
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

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setFormData({ title: "", description: "" });
                setErrors({ title: "", description: "" });
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
