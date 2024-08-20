import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Todo from "@/models/todo";
import User from "@/models/user"
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export const GET = async (req, { params }) => {
  const { id: userId } = params;
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json("You must be logged in.", { status: 401 });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return NextResponse.json("Invalid User ID.", { status: 422 });
  }

  if (userId !== session.user?.id) {
    return NextResponse.json("Permission denied.", { status: 401 });
  }

  try {
    await connectToDB();

    const existingUser = await User.findById(userId);
    
    if (!existingUser) {
      return NextResponse.json("User not found.", { status: 404 });
    }

    return NextResponse.json(existingUser.data.tags, { status: 200 });
  } catch (error) {
    console.log('[에러] /api/user/[id]/tag GET 실패');
    console.log(error);
    return NextResponse.json('Failed to fetch requested tag lists', { status: 500 });
  }
}

export const POST = async (req, { params }) => {
  const { id: userId } = params;
  const { tags } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json("You must be logged in.", { status: 401 });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return NextResponse.json("Invalid User ID.", { status: 422 });
  }

  if (!Array.isArray(tags) || !tags.every(t => /^[^# ]+$/.test(t))) {
    return NextResponse.json("Illegal tag format!", { status: 422 });
  }

  if (userId !== session.user?.id) {
    return NextResponse.json("Permission denied.", { status: 401 });
  }

  try {
    await connectToDB();

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json("User not found.", { status: 404 });
    }

    existingUser.data.tags.addToSet(...tags);
    await existingUser.save();

    return NextResponse.json(existingUser.data.tags, { status: 200 });
  } catch (error) {
    console.log('[에러] /api/user/[id]/tag POST 실패');
    console.log(error);
    return NextResponse.json('Failed to update requested tag lists', { status: 500 });
  }
}

export const PUT = async (req, { params }) => {
  const { id: userId } = params;
  const { tags } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json("You must be logged in.", { status: 401 });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return NextResponse.json("Invalid User ID.", { status: 422 });
  }

  if (!Array.isArray(tags) || !tags.every(t => /^[^# ]+$/.test(t))) {
    return NextResponse.json("Illegal request.", { status: 422 });
  }

  if (userId !== session.user?.id) {
    return NextResponse.json("Permission denied.", { status: 401 });
  }

  try {
    await connectToDB();

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json("User not found.", { status: 404 });
    }

    existingUser.data.tags = [...new Set(tags)];
    await existingUser.save();

    return NextResponse.json(existingUser.data.tags, { status: 200 });
  } catch (error) {
    console.log('[에러] /api/user/[id]/tag PUT 실패');
    console.log(error);
    return NextResponse.json('Failed to replace requested tag lists', { status: 500 });
  }
}

export const DELETE = async (req, { params }) => {
  const { id: userId } = params;
  const { tags } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json("You must be logged in.", { status: 401 });
  }

  if (!mongoose.isValidObjectId(userId)) {
    return NextResponse.json("Invalid User ID.", { status: 422 });
  }

  if (!Array.isArray(tags)) {
    return NextResponse.json("Illegal request.", { status: 422 });
  }

  if (userId !== session.user?.id) {
    return NextResponse.json("Permission denied.", { status: 401 });
  }

  try {
    await connectToDB();

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return NextResponse.json("User not found.", { status: 404 });
    }

    existingUser.data.tags.pull(...tags);
    await existingUser.save();

    return NextResponse.json(existingUser.data.tags, { status: 200 });
  } catch (error) {
    console.log('[에러] /api/user/[id]/tag DELETE 실패');
    console.log(error);
    return NextResponse.json('Failed to delete requested tag lists', { status: 500 });
  }
}