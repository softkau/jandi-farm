import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Project from "@/models/project";
import { NextResponse } from "next/server";

/// /api/todo/new POST 요청
/// [요약] 새로운 Project Document를 생성합니다.
/// title, due_date, detail, status{ is_public } 속성값으로
/// 현재 로그인된 사용자를 소유자로 설정한 새로운 Project Document가 생성됩니다.
/// 권한: 로그인된 상태
///
/// * session이 없으면 401 반환
/// * 생성 성공시 201 반환
/// * 올바르지 않은 속성으로 생성 요청시 422 반환
/// * 서버 에러시 500 반환
export const POST = async (req) => {
  const { title, due_date, detail, status } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  if (isNaN(Date.parse(due_date))) {
    return new Response("Illegal date format!", { status: 422 });
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

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.log('[에러] /api/project/new POST 실패');
    console.log('에러 이름:', error.name);
    console.log('에러 메세지:', error.message);
    if (error.message.startsWith('E11000')) {
      return NextResponse.json('Project with the same name already exists!', { status: 400 });
    }
    return new Response('Failed to create new Project', { status: 500 });
  }
}