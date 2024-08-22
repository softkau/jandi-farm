"use client";

import ProjectCard from "./projectCard";
import Image from "next/image";
import { useState } from "react";

export default function ProjectContainer({
  projects,
  setProjects,
  selected,
  setSelected,
}) {
  // selected 핸들러
  const handleSelected = (projectName, isFocused) => {
    if (isFocused) {
      setSelected(null);
    } else {
      setSelected(projectName);
    }
  };

  // 입력 필드 값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setNewProject({
        ...newProject,
        status: {
          ...newProject.status,
          [name]: checked,
        },
      });
    } else {
      setNewProject({
        ...newProject,
        [name]: value,
      });
    }
  };

  // 프로젝트 추가 핸들러
  const handleAddProject = async () => {
    if (
      newProject.title.trim() &&
      newProject.detail.trim() &&
      newProject.due_date.trim()
    ) {
      try {
        const response = await fetch(`/api/project/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
        });

        if (!response) {
          throw new Error("프로젝트 추가 실패");
        }
        setProjects([...projects, newProject]);
        setNewProject({
          title: "",
          detail: "",
          due_date: "",
          status: {
            is_public: false,
          },
        });
        setShowForm(false);
      } catch (error) {
        console.log("프로젝트 추가 실패", error);
        setNewProject({
          title: "",
          detail: "",
          due_date: "",
          status: {
            is_public: false,
          },
        });
        setShowForm(false);
      }
    }
  };

  // 프로젝트 추가 취소 핸들러
  const handleCancel = () => {
    setNewProject({
      title: "",
      detail: "",
      due_date: "",
      status: {
        is_public: false,
      },
    });
    setShowForm(false);
  };

  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: "",
    detail: "",
    due_date: "",
    status: {
      is_public: false,
    },
  });
  return (
    <div className="w-full flex flex-col p-1 gap-2">
      {projects.map((data, idx) => (
        <ProjectCard
          key={idx}
          data={data}
          isFocused={data.title == selected ? true : false}
          handleSelected={handleSelected}
        />
      ))}
      {showForm && (
        <div className="mt-4">
          <input
            type="text"
            name="title"
            value={newProject.title}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 text-black rounded"
            placeholder="프로젝트 제목"
          />
          <textarea
            name="detail"
            value={newProject.detail}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 text-black rounded"
            placeholder="프로젝트 설명"
          />
          <input
            type="date"
            name="due_date"
            value={newProject.due_date}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 text-black rounded"
          />
          <label className="flex items-center">
            <input
              type="checkbox"
              name="is_public"
              checked={newProject.status.is_public}
              onChange={handleInputChange}
              className="mr-2"
            />
            공개 여부
          </label>
          <button
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2
          px-4 rounded"
            onClick={handleAddProject}
          >
            submit
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2
          px-4 rounded"
            onClick={handleCancel}
          >
            cancel
          </button>
        </div>
      )}
      {!showForm && (
        <div className="flex justify-center items-center p-2">
          <button
            className="h-10 w-full rounded-3xl border-2 p-1 border-gray-600 flex gap-2 justify-center items-center"
            onClick={() => setShowForm(true)}
          >
            <div className="h-full aspect-square ">
              <Image
                alt=""
                src={"/plus.png"}
                layout="responsive"
                width={1}
                height={1}
              />
            </div>
            <span>프로젝트 추가</span>
          </button>
        </div>
      )}
    </div>
  );
}
