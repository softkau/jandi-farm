'use client'
import NewTodo from "@/components/pcw/new-todo.jsx"
import TodoCalendar from "@/components/pcw/todo-calendar"
import { useState } from "react"
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const generateTodos = (iterations, start, end) => {
  let todos = [];
  for (let it = 0; it < iterations; it++) {
    todos.push({
      title: `자동 생성된 TODO #${it}`,
      detail: "아무거나",
      due_date: getRandomDate(start, end),
      tag: [],
      project: null,
      status: {
        done: true,
        is_public: false
      }
    });
  }

  return todos;
}

const placeholderTodos = generateTodos(50, new Date(2024, 7, 1), new Date(2024, 8, 1));

const PcwTest = () => {
  const [projectList, setProjectList] = useState(["projectA", "projectB", "projectC"])
  const [selectedProject, setSelectedProject] = useState("projectB")
  const [tagList, setTagList] = useState(["abc", "bcd", "asdfasdf"])
  const [selectedTags, setSelectedTags] = useState(["abc", "asdfasdf"])
  const [todoList, setTodoList] = useState(placeholderTodos);
  const [focusedDate, setFocusedDate] = useState(new Date());

  const placeholder = {
    projectList,
    selectedProject,
    tagList,
    selectedTags,
    focusedDate,
    todoList,
    setProjectList,
    setSelectedProject,
    setTagList,
    setSelectedTags,
    setFocusedDate,
    setTodoList
  };

  const [showNewTodo, setShowNewTodo] = useState(false)

  return (
    <div className="w-full h-full relative">
      <TodoCalendar gs={placeholder} />
      {
        showNewTodo ? (
          <NewTodo
            gs={placeholder}
            className="absolute right-1 bottom-1"
            unmount={()=>{setShowNewTodo(false)}}
          />
        ) : (
          <Button
            variant="pcw_create"
            className="absolute shadow-md w-[50px] h-[50px] p-0 right-1 bottom-1 rounded-full"
            onClick={()=>{setShowNewTodo(true)}}
          >
            <Plus />
          </Button>
        )
      }
    </div>
  )
}

export default PcwTest