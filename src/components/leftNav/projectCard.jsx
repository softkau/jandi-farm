"use client";

import { format, getDate } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronUp, Folder, FolderOpen } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { AiFillCrown } from "react-icons/ai";

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
  const [owner, setOwner] = useState("");
  const [slave, setSlave] = useState([]);
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

  // shared project owner 가져오기
  useEffect(() => {
    if (data.shared_users?.length > 0) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/user/${data.owner}`);
          const result = await response.json();
          setOwner(result);
        } catch (error) {
          console.error("Error shared owner data fetch:", error);
        }
      };
      fetchData();
    }
  }, []);

  // shared project coworker 가져오기
  useEffect(() => {
    if (data.shared_users?.length > 0) {
      const fetchSlaves = async () => {
        try {
          const promises = data.shared_users.map(async (userId) => {
            const response = await fetch(`/api/user/${userId}`);
            return response.json();
          });
          const results = await Promise.all(promises);
          setSlave(results);
        } catch (error) {
          console.error("Error shared slave data fetch:", error);
        }
      };
      fetchSlaves();
    }
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
          <div className="border-b-2 border-gray-200 pb-2 mb-2">
            <div className="flex justify-between items-center">
              <div>{format(data.due_date, "PPP", { locale: ko })}</div>
              <div>
                {(() => {
                  const diffDays = Math.ceil(
                    (new Date(data.due_date) - new Date()) /
                      (1000 * 60 * 60 * 24)
                  );
                  if (diffDays > 0) return `D-${diffDays}`;
                  if (diffDays === 0) return "D-day";
                  return `D+${Math.abs(diffDays)}`;
                })()}
              </div>
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
          </div>
          <div className="border-b-2 border-gray-200 pb-2">
            <div className="my-5">{data.detail}</div>
          </div>
          {data.shared_users?.length > 0 && (
            <div className="my-5 flex items-center space-x-2  pb-5">
              <span className="font-bold">유저:</span>
              <div className="relative group">
                <Image
                  src={owner.image}
                  alt={owner.username}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <AiFillCrown className="absolute top-0 right-0 text-yellow-400 bg-white p-1 rounded-full text-lg" />
                <div className="absolute bottom-0 left-0 hidden group-hover:block bg-white text-black text-xs p-1 rounded shadow-lg z-50">
                  <div>{owner.username}</div>
                  <div>{owner.email}</div>
                </div>
              </div>
              {slave.map((member, idx) => (
                <div
                  key={idx}
                  className="relative group -ml-2"
                  style={{ zIndex: slave.length - idx }}
                >
                  <Image
                    src={member.image}
                    alt={member.username}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="absolute bottom-0 left-0 hidden group-hover:block bg-white text-black text-xs p-1 rounded shadow-lg z-50">
                    <div>{member.username}</div>
                    <div>{member.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
