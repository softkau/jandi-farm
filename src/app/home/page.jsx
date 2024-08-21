"use client";

import ProjectContainer from "@/components/leftNav/projectContainer";
import TagContainer from "@/components/leftNav/tagContainer";
import DateContainer from "@/components/center/dateContainer";
import { useEffect, useState } from "react";
import { compareAsc } from "date-fns";

// 날짜별로 todo 그룹화
function groupByDate(components) {
  return components.reduce((acc, component) => {
    const { due_date } = component;
    if (!acc[due_date]) acc[due_date] = [];
    acc[due_date].push(component);
    return acc;
  }, {});
}

function filterTodo(jsonArray, targetTags, targetProject) {
  return jsonArray.filter(
    (item) =>
      targetTags.every((tag) => item.tags.includes(tag)) &&
      (targetProject ? item.project === targetProject : true)
  );
}

export default function Home() {
  // 디버깅용 임시 데이터
  const [projectList, setProjectList] = useState([
    "toy project",
    "산학협력 프로젝트",
    "소프트웨어 공학 개론",
  ]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tagList, setTagList] = useState([
    "운동",
    "코딩",
    "비지니스",
    "약속",
    "학교",
    "대충 겁나 긴 태그~~",
    "연구실",
    "tag1",
    "tag2",
    "tag3",
  ]);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [todoList, setTodoList] = useState([
    {
      _id: "1234",
      owner: "1234",
      title: "toy project",
      due_date: new Date("2024-09-19T15:00:00.000+00:00"),
      detail: "skku toy project",
      tags: ["tag1", "tag2"],
      project: "toy project",
      done: false,
    },
    {
      _id: "1235",
      owner: "1234",
      title: "done test",
      due_date: new Date("2024-09-19T15:00:00.000+00:00"),
      detail: "skku toy project",
      tags: ["tag1"],
      project: null,
      done: true,
    },
    {
      _id: "1236",
      owner: "1234",
      title: "todo 3",
      due_date: new Date("2024-09-21T15:00:00.000+00:00"),
      detail: "skku toy project",
      tags: ["tag1"],
      project: null,
      done: false,
    },
    {
      _id: "1237",
      owner: "1234",
      title: "todo 4",
      due_date: new Date("2024-08-21T15:00:00.000+00:00"),
      detail: "skku toy project",
      tags: ["tag1", "tag3"],
      project: null,
      done: false,
    },
  ]);
  const [groupedTodo, setGroupedTodo] = useState([]);

  // todoList를 selectedProject, selectedTags로 필터링
  // 필터링한 값을 날짜별로 그룹화하여 state변경
  // selectedProject, selectedTags, todoList에 의존하여 각 상태가 변할때마다 업데이트
  useEffect(() => {
    setGroupedTodo((prev) => {
      return groupByDate(
        filterTodo(todoList, Array.from(selectedTags), selectedProject)
      );
    });
  }, [selectedProject, selectedTags, todoList]);

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
      <div className="w-144 overflow-y-auto shrink-0 no-scrollbar">
        {Object.keys(groupedTodo)
          .sort((a, b) => compareAsc(a, b))
          .map((date, idx) => (
            <DateContainer key={idx} date={date} todoList={groupedTodo[date]} />
          ))}
      </div>
      <div className="w-96 h-full flex-shrink-0 border-2">right</div>
    </div>
  );
}
