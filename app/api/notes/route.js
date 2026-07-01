import connectDB from "@/lib/db/mongodb";
import Note from "@/lib/db/models/Note";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/authOptions";

// Create new note
export async function POST(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { title, description } = body;

    if (!title || !description) {
      return Response.json(
        { success: false, message: "Title and description are required" },
        { status: 400 },
      );
    }

    const note = await Note.create({
      title,
      description,
      userId: session.user.id,
    });

    return Response.json(
      {
        success: true,
        data: note,
        message: "Note created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating note:", error);
    return Response.json(
      { success: false, message: "Failed to create note" },
      { status: 500 },
    );
  }
}

// Update an existing note
export async function PATCH(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { id, title, description } = body;

    if (!id || !title || !description) {
      return Response.json(
        {
          success: false,
          message: "Note id, title, and description are required",
        },
        { status: 400 },
      );
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: session.user.id },
      { title, description, updatedAt: new Date() },
      { new: true },
    );

    if (!note) {
      return Response.json(
        { success: false, message: "Note not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, data: note, message: "Note updated" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating note:", error);
    return Response.json(
      { success: false, message: "Failed to update note" },
      { status: 500 },
    );
  }
}

// Delete a note
export async function DELETE(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return Response.json(
        { success: false, message: "Note id is required" },
        { status: 400 },
      );
    }

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: session.user.id,
    });

    if (!note) {
      return Response.json(
        { success: false, message: "Note not found" },
        { status: 404 },
      );
    }

    return Response.json(
      { success: true, message: "Note deleted" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting note:", error);
    return Response.json(
      { success: false, message: "Failed to delete note" },
      { status: 500 },
    );
  }
}

// Get all notes
export async function GET(request) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 },
      );
    }

    const notes = await Note.find({ userId: session.user.id }).sort({
      createdAt: -1,
    });

    return Response.json({
      success: true,
      data: notes,
      total: notes.length,
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return Response.json(
      { success: false, message: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}
