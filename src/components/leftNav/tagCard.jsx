"use client";

import { useState, useEffect, useRef } from "react";

export default function TagCard({
  name,
  isSelected,
  handleSelected = () => {},
  handleDeleteByName,
  textSize,
}) {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const handleDelete = (name) => {
    handleDeleteByName(name);
    setShowMenu(false);
  };

  // 우클릭시 이벤트 발생
  const handleContextMenu = (e) => {
    e.preventDefault();
    setMenuPosition({ x: e.pageX, y: e.pageY - 80 });
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
        className={`rounded-lg border-2 border-gray-500 px-2 cursor-pointer ${textSize} ${
          isSelected && "bg-gray-500"
        }`}
        onClick={() => handleSelected(name)}
        onContextMenu={handleContextMenu}
      >
        {name}
      </div>
      {showMenu && (
        <ul
          ref={menuRef}
          className="absolute bg-white shadow-lg border rounded-md"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <li className="px-4 py-2 cursor-pointer hover:bg-gray-100">수정</li>
          <li
            className="px-4 py-2 cursor-pointer hover:bg-gray-100"
            onClick={() => handleDelete(name)}
          >
            삭제
          </li>
        </ul>
      )}
    </div>
  );
}
