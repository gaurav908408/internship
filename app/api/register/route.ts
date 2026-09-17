import User from "@/models/userModel"

export async function POST(request: Request) {
  try {
    
    const contentType = request.headers.get("content-type");

    if (!contentType?.includes("application/json")) {
      return Response.json(
        {
          success: false,
          message: "Content-Type must be application/json",
        },
        { status: 400 }
      );
    }

    
    let data;

    try {
      data = await request.json();
    } catch {
      return Response.json(
        {
          success: false,
          message: "Invalid JSON body",
        },
        { status: 400 }
      );
    }

    
    if (
      typeof data.name !== "string" ||
      typeof data.email !== "string" ||
      typeof data.password !== "string"
    ) {
      return Response.json(
        {
          success: false,
          message: "Name, email and password are  strings",
        },
        { status: 400 }
      );
    }


    const name = data.name.trim();
    const email = data.email.trim();
    const password = data.password.trim();


    if (!name || !email || !password) {
      return Response.json(
        {
          success: false,
          message: "Name, email and password are required",
        },
        { status: 400 }
      );
    }


     const user = await User.create({
      name,
      email,
    password
     });

    return Response.json(
      {
        success: true,
        message: "User registered successfully",
      },
      { status: 201 }
    );

  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
