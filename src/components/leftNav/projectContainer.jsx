"use client";

import { Plus } from "lucide-react";
import ProjectCard from "./projectCard";
import Image from "next/image";
import { useState } from "react";

export default function ProjectContainer({
  projects,
  setProjects,
  selected,
  setSelected,
  todoList,
  setTodoList,
}) {
  // 프로젝트 삭제 핸들러

  const handleDelete = async (id) => {
    try {
      // 프로젝트 삭제 전 소속된 todo 먼저 불러오기
      const todoResponse = await fetch(`/api/project/${id}/todo`, {
        method: "GET",
      });
      if (!todoResponse.ok) {
        throw new Error("todo 연결 실패");
      }

      // 프로젝트 삭제 요청
      const projectResponse = await fetch(`/api/project/${id}`, {
        method: "DELETE",
      });
      if (!projectResponse.ok) {
        throw new Error("프로젝트 연결 실패");
      }

      // 삭제한 프로젝트 state 업데이트
      setProjects((prevItems) => prevItems.filter((item) => item._id !== id));

      // 소속된 todo 삭제 요청
      const todos = await todoResponse.json();
      // 삭제 요청 실패한 todo
      const failedTodos = [];
      // 각 todo에 대해서 삭제 요청
      await Promise.all(
        todos.map(async (todo) => {
          const deleteTodoResponse = await fetch(`/api/todo/${todo._id}`, {
            method: "DELETE",
          });

          if (!deleteTodoResponse.ok) {
            failedTodos.push(todo._id);
            console.error(`삭제 실패 ${todo._id}`);
          }
        })
      );

      // 삭제 실패한 todo 제외하고 로컬 state에 반영
      setTodoList((prevTodoList) =>
        prevTodoList.filter(
          (todo) => todo.project !== id || failedTodos.includes(todo._id)
        )
      );
    } catch (error) {
      console.log("삭제 실패", error);
    }
  };

  // selected 핸들러
  const handleSelected = (projectId, isFocused) => {
    if (isFocused) {
      setSelected(null);
    } else {
      setSelected(projectId);
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
    } else if (type === "date") {
      setNewProject({
        ...newProject,
        [name]: new Date(value),
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
    if (newProject.title.trim() && newProject.detail.trim()) {
      try {
        const response = await fetch(`/api/project/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newProject),
        });

        if (!response.ok) {
          throw new Error("프로젝트 추가 실패");
        }
        const json = await response.json();
        setProjects([...projects, { ...newProject, _id: json._id }]);
        setNewProject({
          title: "",
          detail: "",
          due_date: "",
          status: {
            is_public: false,
          },
          shared_users: [],
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
          shared_users: [],
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
      shared_users: [],
    });
    setShowForm(false);
  };

  const handleRemoveSharedUser = (emailToRemove) => {
    setNewProject((prev) => ({
      ...prev,
      shared_users: prev.shared_users.filter(
        (email) => email !== emailToRemove
      ),
    }));
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const handleAddSharedUser = () => {
    if (sharedEmail && validateEmail(sharedEmail)) {
      setNewProject((prev) => ({
        ...prev,
        shared_users: [...prev.shared_users, sharedEmail],
      }));
      setSharedEmail("");
    } else {
      alert("유효한 이메일을 입력해주세요.");
    }
  };

  const [showForm, setShowForm] = useState(false);
  const [sharedEmail, setSharedEmail] = useState("");

  const [newProject, setNewProject] = useState({
    title: "",
    detail: "",
    due_date: "",
    status: {
      is_public: false,
    },
    shared_users: [],
  });

  return (
    <div className="w-full flex flex-col p-1 gap-2">
      <div className="my-projects border-b-2 pb-4 mb-4">
        <h2 className="text-xl font-bold m-2">My Projects</h2>
        {projects
          .filter((data) => data.shared_users?.length == 0)
          .map((data, idx) => (
            <ProjectCard
              key={idx}
              data={data}
              todoList={todoList}
              isFocused={data._id === selected ? true : false}
              handleSelected={handleSelected}
              handleDeleteById={handleDelete}
            />
          ))}
      </div>
      <div className="shared-projects">
        <h2 className="text-xl font-bold mb-2 m-2">Shared Projects</h2>
        {projects
          .filter((data) => data.shared_users?.length > 0)
          .map((data, idx) => (
            <ProjectCard
              key={idx}
              data={data}
              todoList={todoList}
              isFocused={data._id === selected ? true : false}
              handleSelected={handleSelected}
              handleDeleteById={handleDelete}
            />
          ))}
      </div>
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

          <div className="mb-4">
            <label className="block mb-2">공동 작업자 이메일</label>
            <div className="flex">
              <input
                type="email"
                value={sharedEmail}
                onChange={(e) => setSharedEmail(e.target.value)}
                className="flex-grow p-2 text-black rounded"
                placeholder="이메일 입력"
              />
              <button
                type="button"
                onClick={handleAddSharedUser}
                className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                +
              </button>
            </div>
            {newProject.shared_users?.length > 0 && (
              <ul className="mt-2">
                {newProject.shared_users.map((email, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center bg-gray-200 p-2 rounded mb-1"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => handleRemoveSharedUser(email)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="date"
            name="due_date"
            value={
              newProject.due_date
                ? new Date(newProject.due_date).toISOString().substring(0, 10)
                : ""
            }
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
        <div className="flex justify-center items-center p-2 mt-5">
          <button
            className="h-10 w-full rounded-3xl border-2 p-1 border-gray-600 flex gap-2 justify-center items-center"
            onClick={() => setShowForm(true)}
          >
            <Plus />
            <span>프로젝트 추가</span>
          </button>
        </div>
      )}
    </div>
  );
}
