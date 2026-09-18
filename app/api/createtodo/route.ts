import { connectDB } from "@/lib/db";
import Todo from "@/models/todo";

export async function POST(request: Request) {
  try {
    await connectDB();

    const data = await request.json();

    if (!data.title || !data.description) {
      return Response.json(
        {
          success: false,
          message: "Title and description are required",
        },
        { status: 400 }
      );
    }

    const createdTodo = await Todo.create({
      title: data.title,
      description: data.description,
    });

    return Response.json(
      {
        success: true,
        message: "todo added successfully",
        data: createdTodo,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Create todo error:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}