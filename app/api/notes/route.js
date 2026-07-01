import connectDB from "@/lib/db/mongodb";
import Note from "@/lib/db/models/Note";
import User from "@/lib/db/models/User";

// Create a new note
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, description, userEmail } = body;

    // Optional userId: if userEmail provided, look up the user and attach id.
    let userId = undefined;
    if (userEmail) {
      const user = await User.findOne({
        email: String(userEmail).toLowerCase().trim(),
      });
      if (user) userId = user._id;
    }

    if (!title || !description) {
      return Response.json(
        { success: false, message: "Title and description are required" },
        { status: 400 },
      );
    }

    const createPayload = { title, description };
    if (userId) createPayload.userId = userId;

    const note = await Note.create(createPayload);

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
      { success: false, message: "Failed to create note: " + error.message },
      { status: 500 },
    );
  }
}

// Get all notes
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const userEmail = searchParams.get("userEmail");
    let filter = {};
    if (userEmail) {
      const user = await User.findOne({
        email: String(userEmail).toLowerCase().trim(),
      });
      if (user) filter.userId = user._id;
      else filter.userId = null; // no results
    }

    const notes = await Note.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments(filter);

    return Response.json({
      success: true,
      data: notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return Response.json(
      { success: false, message: "Failed to fetch notes" },
      { status: 500 },
    );
  }
}
