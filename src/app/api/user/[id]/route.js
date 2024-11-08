import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Todo from "@/models/todo";
import User from "@/models/user";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import Project from "@/models/project";

export const GET = async (req, { params }) => {
  const { id: userId } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json("You must be logged in.", { status: 401 });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return NextResponse.json("Invalid User ID.", { status: 422 });
  }

  try {
    await connectToDB();

    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json("User not found.", { status: 404 });
    }

    const { username, image, email } = user;

    return NextResponse.json({ email, username, image }, { status: 200 });
  } catch (error) {
    console.log("[에러] /api/user/[id] GET 실패");
    console.log(error);
    return NextResponse.json("Failed to fetch requested User Info", {
      status: 500,
    });
  }
};
