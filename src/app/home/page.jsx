"use client";

import ProjectContainer from "@/components/leftNav/projectContainer";
import TagContainer from "@/components/leftNav/tagContainer";
import { useState } from "react";

export default function Home() {
  // 디버깅용 임시 데이터
  const [projectList, setProjectList] = useState([
    "토이 프로젝트",
    "산학협력 프로젝트",
    "소프트웨어 공학 개론",
  ]);
  const [selectedProject, setSelectedProject] = useState();
  const [tagList, setTagList] = useState([
    "운동",
    "코딩",
    "비지니스",
    "약속",
    "학교",
    "대충 겁나 긴 태그~~",
    "연구실",
  ]);
  const [selectedTags, setSelectedTags] = useState(new Set());

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
      <div className="w-144 border-2">center</div>
      <div className="w-96 h-full flex-shrink-0 border-2">right</div>
    </div>
  );
}
