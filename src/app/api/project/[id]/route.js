import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Project from "@/models/project";

/// TODO: 관리자 권한도 구현...?

/// /api/project/[id] GET 요청
/// [요약] id에 해당하는 Project Document를 불러옵니다.
/// 권한: 소유자(비공개) | 없음(공개)
///
/// * session이 없으면 401 반환
/// * 다음의 조건을 모두 만족할 경우, id에 해당하는 Project Document를 body에 포함하여 200 반환
///   1. 일치하는 id를 가진 Project Document가 DB에 존재
///   2. 공개된 Project이거나, 로그인된 사용자가 작성한 Project
/// * 불만족시 404 반환
/// * 서버 에러시 500 반환
export const GET = async (req, { params }) => {
  const { id } = params;
  
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  try {
    await connectToDB();

    const existingProject = await Project.findOne({
      _id: id,
      $or: [
        { owner: session.user.id },
        { is_public: true }
      ]
    });

    if (existingProject) {
      return new Response(existingProject, { status: 200 });
    } else {
      return new Response('Not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[에러] /api/project/[id] GET 실패');
    console.log(error);
    return new Response('Failed to fetch requested Project', { status: 500 });
  }
}

/// /api/project/[id] PATCH 요청
/// [요약] id에 해당하는 Project Document를 일부 업데이트합니다.
/// title, due_date, detail, status{ is_public } 중
/// 존재하는 속성의 값들로 Project Document가 변경됩니다.
/// 권한: 소유자
///
/// * session이 없으면 401 반환
/// * 업데이트 성공시 200 반환
/// * 올바르지 않은 속성으로 업데이트 요청시 422 반환
/// * id에 해당하는 Project가 없으면 404 반환
/// * 서버 에러시 500 반환
export const PATCH = async (req, { params }) => {
  const { id } = params;
  const { title, due_date, detail, status } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  let patch = {}
  if (title) {
    patch.title = title;
  }
  if (due_date) {
    if (isNaN(Date.parse(due_date))) {
      return new Response("Illegal date format.", { status: 422 });
    }
    patch.due_date = new Date(due_date);
  }
  if (detail) {
    patch.detail = detail;
  }
  if (status?.is_public) {
    patch.is_public = status.is_public;
  }

  try {
    await connectToDB();

    const updatedDoc = await Project.findOneAndUpdate(
      { _id: id, owner: session.user.id },
      patch,
      { new: true }
    );
    if (updatedDoc) {
      return new Response(updatedDoc, { status: 200 })
    } else {
      return new Response('Not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[에러] /api/project/[id] PATCH 실패');
    console.log(error);
    return new Response('Failed to patch requested Project', { status: 500 });
  }
}

/// /api/project/[id] DELETE 요청
/// [요약] id에 해당하는 Project Document를 삭제합니다.
/// 권한: 소유자
///
/// * session이 없으면 401 반환
/// * 삭제 성공시 200 반환
/// * id에 해당하는 Project가 없으면 404 반환
/// * 서버 에러시 500 반환
export const DELETE = async (req, { params }) => {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  try {
    await connectToDB();
    const originalDoc = await Project.findOneAndDelete({ _id : id, owner: session.user.id });
    if (originalDoc != null) {
      return new Response('Deleted requested Project', { status: 200 });
    } else {
      return new Response('Not found.', { status: 404 });
    }
  } catch (error) {
    console.log('[에러] /api/project/[id] DELETE 실패');
    console.log(error);
    return new Response('Failed to patch requested Project', { status: 500 });
  }
}