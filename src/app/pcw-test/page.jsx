'use client'
import NewTodo from "@/components/pcw/new-todo.jsx"
import { useEffect, useState } from "react"
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import CalendarView from "@/components/pcw/calendar-view";
import TagSelector from "@/components/pcw/new-todo-comp/tag-selector";
import ProjectSelector from "@/components/pcw/new-todo-comp/project-selector";

const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const getRandomBool = () => {
  return Math.random() * 2 < 1;
}

const getRandomElement = (arr) => {
  const idx = Math.min(Math.floor(Math.random() * arr.length), arr.length-1);
  return arr[idx];
}

const getRandomElements = (arr) => {
  let res = [];
  arr.forEach(x => { getRandomBool() && res.push(x) });
  return res;
}

const generateTodos = (iterations, start, end) => {
  let todos = [];
  for (let it = 0; it < iterations; it++) {
    todos.push({
      title: `자동 생성된 TODO #${it}`,
      detail: "아무거나",
      due_date: getRandomDate(start, end),
      tag: getRandomElements(["abc", "bcd", "asdfasdf"]),
      project: getRandomElement([null, "projectA", "projectB", "projectC"]),
      status: {
        done: getRandomBool(),
        is_public: false
      }
    });
  }

  return todos;
}

const PcwTest = () => {
  const [projectList, setProjectList] = useState(["projectA", "projectB", "projectC"])
  const [selectedProject, setSelectedProject] = useState("")
  const [tagList, setTagList] = useState(["abc", "bcd", "asdfasdf"])
  const [selectedTags, setSelectedTags] = useState([])
  const [todoList, setTodoList] = useState([]);
  const [focusedDate, setFocusedDate] = useState(new Date());

  useEffect(() => {
    setTodoList(generateTodos(200, new Date(2024, 7, 1), new Date(2024, 8, 31)));
  }, []);

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
    <div className="w-full relative flex flex-row h-screen">
      
      <div className="flex-grow relative">

        {/* 여기에 적당한 Todo Card 렌더링 */}
        
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
      <div className="w-[280px] h-full relative bg-zinc-50">
        <CalendarView gs={placeholder} />
        <ProjectSelector
          projectList={["", ...projectList]}
          onChange={setSelectedProject}
          value={selectedProject}
        />
        <TagSelector
          tagList={tagList}
          onChange={setSelectedTags}
          value={selectedTags}
        />
      </div>
    </div>
  )
}

export default PcwTest