import { connectDB } from "@/lib/db";
import User from "@/models/userModel";
import { loginSchema } from "@/validation/userValidation";
import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();

    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        {
          status: StatusCodes.BAD_REQUEST,
        }
      );
    }

    const { email, password } = result.data;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: StatusCodes.UNAUTHORIZED,
        }
      );
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return Response.json(
        {
          success: false,
          message: "Invalid email or password",
        },
        {
          status: StatusCodes.UNAUTHORIZED,
        }
      );
    }

    // Create JWT token
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    // Success response
    return Response.json(
      {
        success: true,
        message: "Login successful",
        token: token,
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      {
        status: StatusCodes.OK,
      }
    );
  } catch (error) {
    console.error("Login error:", error);

    return Response.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      }
    );
  }
}