import connectDB from "@/lib/db/mongodb";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ success: true, message: "MongoDB is connected!" });
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
