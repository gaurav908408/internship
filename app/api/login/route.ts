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

    
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

    if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
      console.error("JWT secrets are missing");

      return Response.json(
        {
          success: false,
          message: "JWT configuration is missing",
        },
        {
          status: StatusCodes.INTERNAL_SERVER_ERROR,
        }
      );
    }

    
    const accessToken = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    
    const refreshToken = jwt.sign(
      {
        userId: user._id.toString(),
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: "5d",
      }
    );

    
    return Response.json(
      {
        success: true,
        message: "Login successful",

        accessToken,
        refreshToken,

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