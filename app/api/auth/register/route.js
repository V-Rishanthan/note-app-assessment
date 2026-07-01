import connectDB from "@/lib/db/mongodb";
import User from "@/lib/db/models/User";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();
    const { name, email, password } = body || {};

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({ message: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return new Response(JSON.stringify({ message: "User already exists" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = new User({
      name: String(name).trim(),
      email: normalizedEmail,
      password: hashed,
    });
    await user.save();

    return new Response(JSON.stringify({ message: "User created" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("/api/auth/register error:", error);
    return new Response(
      JSON.stringify({
        message: "Server error",
        error: error?.message || String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
