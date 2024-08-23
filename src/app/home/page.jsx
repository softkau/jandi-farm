"use client";

import ProjectContainer from "@/components/leftNav/projectContainer";
import TagContainer from "@/components/leftNav/tagContainer";
import TodoContainer from "@/components/center/todoContainer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import CalendarView from "@/components/pcw/calendar-view";
import NewTodo from "@/components/pcw/new-todo";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

// import { ObjectId } from "bson";

export default function Home() {
  // 세션 가져오기 -> 유저 정보
  const { data: session } = useSession();

  // state 설정
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [todoList, setTodoList] = useState([]);
  const [focusedDate, setFocusedDate] = useState(new Date());

  const [showNewTodo, setShowNewTodo] = useState(false);

  // 프로젝트 fetch
  useEffect(() => {
    if (session?.user?.id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/user/${session.user.id}/project`);
          const json = await response.json();
          setProjectList(
            json.map((project) => {
              return {
                _id: project._id,
                title: project.title,
                detail: project.detail,
                due_date: new Date(project.due_date),
                status: {
                  is_public: project.is_public,
                },
              };
            })
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [session?.user?.id]);

  // 태그 fetch
  useEffect(() => {
    if (session?.user?.id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/user/${session.user.id}/tag`);
          const json = await response.json();
          setTagList(json);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [session?.user?.id]);

  // 투두 리스트 fetch
  useEffect(() => {
    if (session?.user?.id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/user/${session.user.id}/todo`);
          const json = await response.json();
          setTodoList(
            json.map((todo) => {
              return {
                title: todo.title,
                detail: todo.detail,
                due_date: new Date(todo.due_date),
                tags: todo.tags,
                project: todo.project,
                status: {
                  done: todo.done,
                  is_public: todo.is_public,
                },
              };
            })
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [session?.user?.id]);

  return (
    <div className="w-full h-screen flex justify-between">
      <div className="w-80 h-full flex-shrink-0 flex flex-col bg-gray-100">
        <div className="h-20 bg-green-200 flex justify-center items-center">
          logo
        </div>
        <div className="h-full flex flex-col justify-between">
          {/*
          
          
          */}
          <ProjectContainer
            projects={projectList}
            setProjects={setProjectList}
            selected={selectedProject}
            setSelected={setSelectedProject}
            todoList={todoList}
            setTodoList={setTodoList}
          />

          <TagContainer
            tags={tagList}
            setTags={setTagList}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
      </div>
      <div className="flex-grow relative">
        <div className="flex h-full justify-center">
          <TodoContainer
            todoList={todoList}
            selectedTags={selectedTags}
            selectedProject={selectedProject}
            className="h-full"
          />
        </div>

        {showNewTodo ? (
          <NewTodo
            gs={{
              projectList: projectList,
              selectedProject: selectedProject,
              tagList: tagList,
              selectedTags: selectedTags,
              focusedDate: focusedDate,
            }}
            className="absolute right-1 bottom-1"
            unmount={() => {
              setShowNewTodo(false);
            }}
          />
        ) : (
          <Button
            variant="pcw_create"
            className="absolute shadow-md w-[50px] h-[50px] p-0 right-1 bottom-1 rounded-full"
            onClick={() => {
              setShowNewTodo(true);
            }}
          >
            <Plus />
          </Button>
        )}
      </div>

      <div className="w-[280px] h-full relative bg-zinc-50">
        <CalendarView
          gs={{
            projectList: projectList,
            selectedProject: selectedProject,
            tagList: tagList,
            selectedTags: selectedTags,
            todoList: todoList,
            focusedDate: focusedDate,
            setFocusedDate: setFocusedDate,
          }}
        />
      </div>
    </div>
  );
}
