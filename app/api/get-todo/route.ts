import { connectDB } from "@/lib/db";
import Todo from "@/models/todo";

export async function GET(request: Request) {
  try {
    await connectDB();

    const todo = await Todo.find();

    return Response.json(
      {
        success: true,
        message: "all todo fetch successfully",
        data: todo,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Get todo error:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}