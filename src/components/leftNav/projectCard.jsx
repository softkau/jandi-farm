"use client";

import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
// TODO : data 구체화하기
export default function ProjectCard({
  isFocused = false,
  data,
  handleSelected,
  todoList
}) {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // 프로젝트에 남은 TODO 개수 계산
  const leftTodo = todoList.filter(t => !t.status.done && t.project === data._id).length

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
        className="h-10 w-full flex items-center p-1 cursor-pointer"
        onClick={() => handleSelected(data._id, isFocused)}
        onContextMenu={handleContextMenu}
      >
        <div className="p-1 h-full aspect-square">
          <Image
            src={"/pen-icon.png"}
            alt=""
            layout="responsive"
            width={1}
            height={1}
          />
        </div>
        <div
          className={`ml-2 mr-auto ${isFocused ? "font-bold" : "font-medium"}`}
        >
          {data.title}
        </div>
        {isFocused ? (
          <div className="h-full aspect-square">
            <Image
              src={"/detail.png"}
              alt=""
              layout="responsive"
              width={1}
              height={1}
            />
          </div>
        ) : (
          <div className="h-full aspect-square flex items-center justify-center">
            <span>{leftTodo}</span>
          </div>
        )}
      </div>
      {showMenu && (
        <ul
          ref={menuRef}
          className="absolute bg-white shadow-lg border rounded-md"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">수정</li>
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">삭제</li>
        </ul>
      )}
      {isFocused && (
        <div className="h-36 bg-white rounded-md m-1">
          <div>{data.detail}</div>
          <div>{format(data.due_date, "PPP", { locale: ko })}</div>
        </div>
      )}
    </div>
  );
}
