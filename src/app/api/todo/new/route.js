import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Todo from "@/models/todo";

export const POST = async (req, res) => {
  const { title, due_date, detail, tag, project } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  try {
    await connectToDB();
    
    const newTodo = new Todo({
      owner: session.user.id,
      title: title,
      due_date: new Date(due_date),
      detail: detail,
      tag: (tag ? tag : null),
      project: null // TODO: link projects!
    });

    newTodo.save();

    return new Response(JSON.stringify(newTodo), { status: 201 });
  } catch (error) {
    console.log('[에러] /api/todo/new POST 실패');
    console.log(error);
    return new Response('Failed to create new Todo List', { status: 500 });
  }
}