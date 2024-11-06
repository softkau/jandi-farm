import TagCard from "../leftNav/tagCard";
import { FaTrashAlt, FaExclamationTriangle } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TodoCard({ data, handleDone, handleDelete, openTodoEditor }) {
  const [showConfirm, setShowConfirm] = useState(false);
  const deleteButtonRef = useRef(null);

  const handleDeleteClick = (id) => {
    if (showConfirm) {
      handleDelete(id);
    } else {
      setShowConfirm(true);
    }
  };

  const handleClickOutside = (event) => {
    if (
      deleteButtonRef.current &&
      !deleteButtonRef.current.contains(event.target)
    ) {
      setShowConfirm(false);
    }
  };

  const handleEscKey = (event) => {
    if (event.key === "Escape") {
      setShowConfirm(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, []);

  return (
    <div
      className={`w-full rounded-md shadow-md px-6 py-4 flex flex-col gap-4 ${
        data.status.done ? "bg-gray-100 opacity-75" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center">
        <span className={`font-bold ${data.status.done && "line-through"}`}>
          {data.title}
        </span>
        <div className="flex items-center gap-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.status.done}
              onChange={() => handleDone(data.id)}
              className="sr-only peer"
            />
            <div className="w-6 h-6 bg-gray-200 rounded-md peer-checked:bg-green-700 peer-focus:ring-4 peer-focus:ring-teal-300 dark:peer-focus:ring-teal-800 transition-all duration-300 flex items-center justify-center">
              {data.status.done && (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              )}
            </div>
          </label>
        </div>
      </div>
      <div>{data.detail}</div>
      <div className="flex flex-row gap-2 justify-between">
        <button
          onClick={() => openTodoEditor(data.id)}
          className={cn('flex items-center gap-1 text-green-200')}
        >
          <Pencil />수정
        </button>
        
        {/*<button
          ref={deleteButtonRef}
          onClick={() => handleDeleteClick(data.id)}
          className={`flex items-center gap-1 ${
            showConfirm ? "text-red-600" : "text-red-300"
          }`}
        >
          {showConfirm ? <FaExclamationTriangle /> : <FaTrashAlt />}
          <span>{showConfirm ? "Confirm" : "Delete"}</span>
        </button>*/}
        <div className="flex flex-row gap-2">
          {data.tags.map((name, idx) => (
            <TagCard key={idx} name={name} textSize={"text-sm"} />
          ))}
        </div>
      </div>
    </div>
  );
}
