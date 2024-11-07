'use client'

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { format } from "date-fns"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"

import CardWrapper from "./new-todo-comp/cardwrapper"
import ProjectSelector from "./new-todo-comp/project-selector"
import TagSelector from "./new-todo-comp/tag-selector"
import DatePicker from "./new-todo-comp/datepicker"
import { convertTodoFromResponseJSON } from "./utils"

const SubHeader = ({ children }) => (<h2 className="text-xl font-bold mb-3">{children}</h2>)
const VSeperator = () => (<Separator orientation="vertical" className="absolute right-0"/>)

const formSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  due_date: z.date(),
  tag: z.array(z.string()),
  project: z.string(),
  status: z.object({
    done: z.boolean(),
    is_public: z.boolean()
  })
})

const TodoEditor = React.forwardRef(({ gs = placeholder, className, unmount, todoId = null }, ref) => {
  const {
    focusedDate,
    selectedTags,
    selectedProject,
    todoList,
    setTodoList,
    projectList,
    tagList
  } = gs;

  const selectedTodo = todoList.find(todo => todo.id === todoId);
  if (!selectedTodo && todoId != null) {
    alert('Invalid todo ID detected!')
    unmount();
  }

  const form = useForm({
    defaultValues: {
      title:    selectedTodo?.title ?? '',
      detail:   selectedTodo?.detail ?? '',
      due_date: selectedTodo?.due_date ?? focusedDate,
      tag:      selectedTodo?.tags ?? selectedTags,
      project:  selectedTodo?.project ?? (selectedProject?.title ?? "(없음)"),
      status:   selectedTodo?.status ?? {
        done: false,
        is_public: false
      }
    },
    resolver: zodResolver(formSchema)
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
    if (!projectList.find(x => x.title === values.project)) {
      values.project = null;
    }
    values.due_date = format(values.due_date, 'P');

    console.log(values)

    setSubmitting(true);
    try {
      if (!todoId) {
        const res = await fetch("/api/todo/new", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        const json = await res.json();
        setTodoList([...todoList, convertTodoFromResponseJSON(json)]);
      } else {
        const res = await fetch(`/api/todo/${todoId}`, {
          method: "PATCH",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(values)
        });
        const json = await res.json();
        setTodoList(todoList.map(todo => (todo._id === todoId
          ? convertTodoFromResponseJSON(json)
          : todo
        )))
      }
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
    unmount();
  }

  return (
    <CardWrapper title={todoId ? "일정 수정" : "새 일정 추가"} className={ className } ref={ref}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="제목"
                    className="border-none
                              focus-visible:ring-offset-0
                              focus-visible:ring-inset
                              font-semibold
                              text-xl"
                    { ...field }
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Separator className="my-0" />
          <FormField
            control={form.control}
            name="detail"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    placeholder="내용..."
                    className="w-full h-40 rounded-md px-3 pb-2 pt-3 text-sm focus:outline-none"
                    { ...field }
                  >
                  </textarea>
                </FormControl>
              </FormItem>
            )}
          />
          <Separator className="my-0" />

          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <strong className="w-20 mt-2 mr-2 indent-1">마감일</strong>
                <FormControl>
                  <div className="w-auto">
                    <DatePicker placeholder="마감일을 지정해주십시오..." { ...field } required />
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="project"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <strong className="w-20 mt-2 mr-2 indent-1">프로젝트</strong>
                <FormControl>
                  <ProjectSelector projectList={ projectList.map(x => x.title) } { ...field }/>
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem className="my-2 flex">
                <strong className="w-20 mt-2 mr-2 indent-1">태그</strong>
                <div className="max-w-96 flex-grow">
                  <FormControl>
                    <TagSelector className="w-full" tagList={tagList} { ...field } />
                  </FormControl>
                </div>
              </FormItem>

            )}
          />
          <Separator className='mb-2' />
          <div className="flex flex-row-reverse gap-2">
            {
              !submitting ? (
                <Button
                  className="rounded-2xl font-bold w-[80px] bg-green-300 text-black hover:bg-green-200"
                  type="submit"
                >
                  {todoId ? "저장" : "추가"}
                </Button>
              ) : (
                <Button
                  disabled
                  className="rounded-3xl font-bold w-[80px] bg-gray-100 text-gray-600"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                  {todoId ? "저장 중..." : "추가 중..."}
                </Button>
              )
            }
            <Button
              className="rounded-2xl font-bold w-[80px] bg-gray-200 text-black hover:bg-gray-100"
              onClick={(e)=>{e.preventDefault(); unmount();}}
            >
              취소
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  )
})

export default TodoEditor