import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Todo from "@/models/todo";
import Project from "@/models/project";

export const POST = async (req, res) => {
  const { title, due_date, detail, tag, project, status } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  // tag format validation!
  let tagList = tag ? (Array.isArray(tag) ? tag : [tag]) : [];
  if (!tagList.every(t => /^#[^# ]+$/.test(t))) {
    return new Response("Illegal tag format!", { status: 422 });
  }
  // remove the preceding # symbol from tagList
  tagList = tagList.map(t => t.substring(1));

  const { done, is_public } = status || {};

  try {
    await connectToDB();

    let projectId = null;
    if (project) { // project 값이 있을 때
      if (typeof project === 'string' || project instanceof String) { // 값이 멀쩡한 값일 때
        // 같은 이름을 가진 project를 검색
        const proj = Project.findOne({
          owner: session.user.id,
          title: project
        });

        if (proj != null) { // project가 존재하면 id 설정
          projectId = proj._id;
        } else { // project가 없으면 컷
          return new Response("Project not found.", { status: 404 });
        }
      } else { // 이상한 값이 들어오면 컷
        return new Response("Bad request.", { status: 400 });
      }
    }
    
    const newTodo = new Todo({
      owner: session.user.id,
      title: title,
      due_date: new Date(due_date),
      detail: detail,
      tags: tagList,
      project: projectId,
      done: done,
      is_public: is_public
    });

    newTodo.save();

    return new Response(JSON.stringify(newTodo), { status: 201 });
  } catch (error) {
    console.log('[에러] /api/todo/new POST 실패');
    console.log(error);
    return new Response('Failed to create new Todo List', { status: 500 });
  }
}