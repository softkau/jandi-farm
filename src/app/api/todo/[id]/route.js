import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/utils/database";
import Todo from "@/models/todo";
import Project from "@/models/project";
import { NextResponse } from "next/server";

/// TODO: 관리자 권한도 구현...?

/// /api/todo/[id] GET 요청
/// [요약] id에 해당하는 Todo Document를 불러옵니다.
/// 권한: 소유자(비공개) | 없음(공개)
///
/// * session이 없으면 401 반환
/// * 다음의 조건을 모두 만족할 경우, id에 해당하는 Todo Document를 body에 포함하여 200 반환
///   1. 일치하는 id를 가진 Todo Document가 DB에 존재
///   2. 공개된 Todo이거나, 로그인된 사용자가 작성한 Todo || 공개되거나 공유된 프로젝트의 Todo
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

    const existingTodo = await Todo.findById(id);

    if (!existingTodo) {
      return new Response("Not found.", { status: 404 });
    }
    if (existingTodo.owner !== session.user.id && !existingTodo.is_public) {
      const proj = await Project.findById(existingTodo.project);
      if (!proj) return new Response("Not found.", { status: 404 });
      
      if (!proj.is_public && !proj.shared_users.includes(session.user.id))
        return new Response("Not found.", { status: 404 });
    }

    return new Response(existingTodo, { status: 200 });    
  } catch (error) {
    console.log("[에러] /api/todo/[id] GET 실패");
    console.log(error);
    return new Response("Failed to fetch requested Todo List", { status: 500 });
  }
};

/// /api/todo/[id] PATCH 요청
/// [요약] id에 해당하는 Todo Document를 일부 업데이트합니다.
/// title, due_date, detail, tag, project, status{ done, is_public } 중
/// 존재하는 속성의 값들로 Todo Document가 변경됩니다.
/// 권한: 소유자
///
/// * session이 없으면 401 반환
/// * 업데이트 성공시 200 반환
/// * 올바르지 않은 속성으로 업데이트 요청시 422 반환
/// * id에 해당하는 Todo가 없으면 404 반환
/// * 없는 project로 업데이트 시도시 404 반환(*추후 변동 가능)
/// * 서버 에러시 500 반환
export const PATCH = async (req, { params }) => {
  const { id } = params;
  const { title, due_date, detail, tag, project, status } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  let patch = {};
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
  if (tag) {
    let tagList = Array.isArray(tag) ? tag : [tag];
    if (tagList.every((x) => /^[^# ]+$/.test(x))) {
      patch.tags = tagList
    } else {
      console.error(tagList)
      return new Response(`Illegal tag format ${tagList}`, { status: 422 });
    }
  }
  if (status?.done !== undefined) {
    patch.done = status.done;
  }
  if (status?.is_public) {
    patch.is_public = status.is_public;
  }

  try {
    await connectToDB();

    // project 변경 시도
    if (project) {
      const proj = await Project.findOne({ title: project });
      if (!proj) {
        return new Response("Project not found.", { status: 404 });
      }

      // code updated for clarity
      if (proj.owner != session.user.id) {
        // if it's not even visible to the user, then return 404
        if (!proj.shared_users.includes(session.user.id)) {
          return new Response("Project not found.", { status: 404 });
        }
      }
      patch.project = proj._id;
    }

    const updatedDoc = await Todo.findOneAndUpdate(
      { _id: id, owner: session.user.id },
      patch,
      { new: true }
    );
    if (updatedDoc) {
      return NextResponse.json(updatedDoc, { status: 200 });
    } else {
      return new Response("Not found.", { status: 404 });
    }
  } catch (error) {
    console.log("[에러] /api/todo/[id] PATCH 실패");
    console.log(error);
    return new Response("Failed to patch requested Todo List", { status: 500 });
  }
};

/// /api/todo/[id] DELETE 요청
/// [요약] id에 해당하는 Todo Document를 삭제합니다.
/// 권한: 소유자
///
/// * session이 없으면 401 반환
/// * 삭제 성공시 200 반환
/// * id에 해당하는 Todo가 없으면 404 반환
/// * 서버 에러시 500 반환
export const DELETE = async (req, { params }) => {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("You must be logged in.", { status: 401 });
  }

  try {
    await connectToDB();
    const originalDoc = await Todo.findOneAndDelete({
      _id: id,
      owner: session.user.id,
    });
    if (originalDoc != null) {
      return new Response("Deleted requested Todo List", { status: 200 });
    } else {
      return new Response("Not found.", { status: 404 });
    }
  } catch (error) {
    console.log("[에러] /api/todo/[id] DELETE 실패");
    console.log(error);
    return new Response("Failed to patch requested Todo List", { status: 500 });
  }
};
