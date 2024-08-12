'use client'
import NewTodo from "@/components/pcw/new-todo"
import TodoCalendar from "@/components/pcw/todo-calendar"
import { useState } from "react"
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";

const PcwTest = () => {
  const [projectList, setProjectList] = useState(["projectA", "projectB", "projectC"])
  const [selectedProject, setSelectedProject] = useState("projectB")
  const [tagList, setTagList] = useState(["abc", "bcd", "asdfasdf"])
  const [selectedTags, setSelectedTags] = useState(["abc", "asdfasdf"])
  const [todoList, setTodoList] = useState([])
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