"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronUp, Folder, FolderOpen } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// TODO : data 구체화하기
export default function ProjectCard({
  isFocused = false,
  data,
  handleSelected,
  handleEditById,
  handleDeleteById,
  todoList,
}) {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // 프로젝트에 남은 TODO 개수 계산
  const leftTodo = todoList.filter(
    (t) => !t.status.done && t.project === data._id
  ).length;

  const totalTodo = todoList.filter((t) => t.project === data._id).length;

  // 우클릭시 이벤트 발생
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.pageX, y: e.pageY });
    setShowMenu(true);
  };

  // 화면 아무곳이나 누르거나 esc누르면 누르면 취소
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setShowMenu(false);
    }
  };
  const handleEscKey = (e) => {
    if (e.key === "Escape") {
      setShowMenu(false);
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
  };

  const handleDelete = (id) => {
    handleDeleteById(id);
    setShowMenu(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div>
      <div
        className="h-10 w-full flex items-center p-1 cursor-pointer select-none transition-all hover:bg-zinc-200/70"
        onClick={() => handleSelected(data._id, isFocused)}
        onContextMenu={handleContextMenu}
      >
        {isFocused ? <FolderOpen /> : <Folder />}
        <div
          className={`ml-2 mr-auto flex-grow ${
            isFocused ? "font-bold" : "font-medium"
          }`}
        >
          {data.title}
        </div>
        {isFocused ? (
          <ChevronUp className="animate-chevron-spin" />
        ) : (
          <span>{`${totalTodo - leftTodo} / ${totalTodo}`}</span>
        )}
      </div>
      {showMenu && (
        <ul
          ref={menuRef}
          className="absolute bg-white shadow-lg border rounded-md"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <li
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={handleEdit}
          >
            수정
          </li>
          <li
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleDelete(data._id)}
          >
            삭제
          </li>
        </ul>
      )}
      {isFocused && (
        <div className="h-auto bg-white rounded-md m-1 p-2">
          <div className="flex justify-between items-center">
            <div>{format(data.due_date, "PPP", { locale: ko })}</div>
            <div>{`D-${Math.ceil(
              (new Date(data.due_date) - new Date()) / (1000 * 60 * 60 * 24)
            )}`}</div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${((totalTodo - leftTodo) / totalTodo) * 100}%`,
                }}
              ></div>
            </div>
            <div className="text-sm text-gray-500 mt-1">{`${
              totalTodo - leftTodo
            } / ${totalTodo} 완료`}</div>
          </div>
          <div className="mt-2">{data.detail}</div>
        </div>
      )}
    </div>
  );
}
