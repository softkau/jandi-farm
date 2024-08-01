import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Project from "@/models/project";
import Todo from "@/models/todo";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

/// 프로젝트에 포함된 TODO의 공개 상태와 상관 없이
/// 프로젝트가 공개 상태이면 전부 조회 가능하도록 하였음
/// 이 사항은 추후 변경될 수도 있음
export const GET = async (req, { params }) => {
  const { id: projectId } = params;
  
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json("You must be logged in.", { status: 401 });
  }

  if (!mongoose.isValidObjectId(projectId)) {
    return NextResponse.json("Invalid Project ID!", { status: 422 });
  }

  try {
    await connectToDB();

    const existingProject = await Project.findById(projectId);
    // return NextResponse.json(existingProject, { status: 200 });
    if (existingProject
      && (existingProject.owner.toString() === session.user.id)
    ) {
      const projectTodos = await Todo.find({ project: projectId });
      return NextResponse.json(projectTodos, { status: 200 });
    } else {
      return NextResponse.json('Project not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[에러] /api/project/[id]/todo GET 실패');
    console.log(error);
    return NextResponse.json('Failed to fetch requested Todo List', { status: 500 });
  }
}