import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Todo from "@/models/todo";
import Project from "@/models/project";
import { NextResponse } from "next/server";

/// /api/todo/new POST 요청
/// [요약] 새로운 Todo Document를 생성합니다.
/// title, due_date, detail, tag, project, status{ done, is_public } 속성값으로
/// 현재 로그인된 사용자를 소유자로 설정한 새로운 Todo Document가 생성됩니다.
/// 권한: 로그인된 상태
///
/// * session이 없으면 401 반환
/// * 생성 성공시 201 반환
/// * 올바르지 않은 속성으로 생성 요청시 422 반환
/// * 존재하지 않는 project로 설정 시도시 404 반환(*추후 변동 가능)
/// * 서버 에러시 500 반환
export const POST = async (req) => {
  const { title, due_date, detail, tag, project, status } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  if (isNaN(Date.parse(due_date))) {
    return new Response("Illegal date format!", { status: 422 });
  }
  // tag format validation!
  let tagList = tag ? (Array.isArray(tag) ? tag : [tag]) : [];
  if (!tagList.every(t => /^[^# ]+$/.test(t))) {
    return new Response("Illegal tag format!", { status: 422 });
  }

  const { done, is_public } = status || {};

  try {
    await connectToDB();

    let projectId = null;
    if (project) {
      const proj = await Project.findOne({
        owner: session.user.id,
        title: project
      });

      if (proj != null) { // project가 존재하면 id 설정
        projectId = proj._id;
      } else { // project가 없으면 컷
        return new Response("Project not found.", { status: 404 });
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

    const docSaved = await newTodo.save();
    if (docSaved !== newTodo) {
      console.log('[에러] DB에 Todo 저장 실패');
      return new Response('Failed to create new Todo List', { status: 500 });
    } 

    return NextResponse.json(docSaved, { status: 201 });
  } catch (error) {
    console.log('[에러] /api/todo/new POST 실패');
    console.log(error);
    return new Response('Failed to create new Todo List', { status: 500 });
  }
}