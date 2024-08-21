"use client";

import ProjectContainer from "@/components/leftNav/projectContainer";
import TagContainer from "@/components/leftNav/tagContainer";
import TodoContainer from "@/components/center/todoContainer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Home() {
  // 세션 가져오기 -> 유저 정보
  const { data: session } = useSession();

  // state 설정
  const [projectList, setProjectList] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [todoList, setTodoList] = useState([]);

  // 프로젝트 fetch
  useEffect(() => {
    if (session?.user?.id) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/user/${session.user.id}/project`);
          const json = await response.json();
          setProjectList(json);
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
          setTodoList(json);
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
          <ProjectContainer
            projects={projectList}
            setProjects={setProjectList}
            selected={selectedProject}
            setSelected={setSelectedProject}
          />
          <TagContainer
            tags={tagList}
            setTags={setTagList}
            selectedTags={selectedTags}
            setSelectedTags={setSelectedTags}
          />
        </div>
      </div>
      <TodoContainer
        todoList={todoList}
        selectedTags={selectedTags}
        selectedProject={selectedProject}
      />
      <div className="w-96 h-full flex-shrink-0 border-2">right</div>
    </div>
  );
}
