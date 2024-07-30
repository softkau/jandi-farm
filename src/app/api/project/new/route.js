import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Project from "@/models/project";

export const POST = async (req, res) => {
  const { title, due_date, detail, status } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  const { is_public } = status || {};

  try {
    await connectToDB();

    const newProject = new Project({
      owner: session.user.id,
      title: title,
      due_date: new Date(due_date),
      detail: detail,
      is_public: is_public
    });

    const docSaved = await newProject.save();
    if (docSaved !== newProject) {
      console.log('[에러] DB에 Project 저장 실패');
      return new Response('Failed to create new Project', { status: 500 });
    }

    return new Response(newProject, { status: 201 });
  } catch (error) {
    console.log('[에러] /api/project/new POST 실패');
    console.log(error);
    return new Response('Failed to create new Project', { status: 500 });
  }
}