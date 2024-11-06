"use client";

import { useEffect, useState } from "react";
import { compareAsc } from "date-fns";
import DateContainer from "@/components/center/dateContainer";
import { cn } from "@/lib/utils";

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

export default function TodoContainer({
  todoList,
  setTodoList,
  selectedTags,
  selectedProject,
  className,
}) {
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
    <div
      className={cn("w-144 overflow-y-auto shrink-0 no-scrollbar", className)}
    >
      {Object.keys(groupedTodo)
        .sort((a, b) => compareAsc(a, b))
        .map((date, idx) => (
          <DateContainer
            key={idx}
            date={date}
            todoList={groupedTodo[date]}
            setTodoList={setTodoList}
            className="w-144"
          />
        ))}
    </div>
  );
}
