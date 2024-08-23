"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { format } from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import CardWrapper from "./new-todo-comp/cardwrapper";
import ProjectSelector from "./new-todo-comp/project-selector";
import TagSelector from "./new-todo-comp/tag-selector";
import DatePicker from "./new-todo-comp/datepicker";

const SubHeader = ({ children }) => (
  <h2 className="text-xl font-bold mb-3">{children}</h2>
);
const VSeperator = () => (
  <Separator orientation="vertical" className="absolute right-0" />
);

const formSchema = z.object({
  title: z.string().min(1),
  detail: z.string().min(1),
  due_date: z.date(),
  tag: z.array(z.string()),
  project: z.string(),
  status: z.object({
    done: z.boolean(),
    is_public: z.boolean(),
  }),
});

const NewTodo = ({ gs = placeholder, className, unmount }) => {
  const {
    focusedDate,
    selectedTags,
    selectedProject,
    todoList,
    projectList,
    tagList,
  } = gs;
  console.log("%crendering NewTodo", "background-color: red; color: white");

  const form = useForm({
    defaultValues: {
      title: "",
      detail: "",
      due_date: focusedDate,
      tag: selectedTags,
      project: selectedProject,
      status: {
        done: false,
        is_public: false,
      },
    },
    resolver: zodResolver(formSchema),
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (values) => {
<<<<<<< HEAD
    if (!projectList.find(x => x.title === values.project)) {
=======
    if (!projectList.find((x) => x.title === values.project)) {
>>>>>>> hotfix/center-ui-fix
      values.project = null;
    }
    values.due_date = format(values.due_date, "P");

    console.log(values);

    setSubmitting(true);
    try {
      const res = await fetch("/api/todo/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      console.log(res);
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <CardWrapper title="새 일정 추가하기" className={className}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex space-x-4 mb-3">
            <FormField
              control={form.control}
              name="project"
              render={({ field }) => (
                <FormItem>
                  <div className="w-32 h-full flex flex-col">
                    <SubHeader>Projects</SubHeader>
                    <div className="relative flex flex-row flex-grow">
                      <FormControl>
                        <ProjectSelector
                          projectList={[
                            "(없음)",
                            ...projectList.map((x) => x.title),
                          ]}
                          {...field}
                        />
                      </FormControl>
                      <VSeperator />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <div className="w-32 h-full flex flex-col">
                    <SubHeader>Tags</SubHeader>
                    <div className="relative flex flex-row flex-grow">
                      <FormControl>
                        <TagSelector tagList={tagList} {...field} />
                      </FormControl>
                      <VSeperator />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="w-64">
              <SubHeader>Detail</SubHeader>
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
                                   focus-visible:ring-inset"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="detail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <textarea
                        placeholder="내용..."
                        className="w-full h-40 rounded-md px-3 py-2 text-sm"
                        {...field}
                      ></textarea>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <DatePicker
                        placeholder="마감일을 지정해주십시오..."
                        {...field}
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-row-reverse gap-3">
            {!submitting ? (
              <Button
                className="rounded-3xl"
                type="submit"
                variant="pcw_create"
              >
                할 일 등록
              </Button>
            ) : (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                등록 중...
              </Button>
            )}
            <Button
              className="rounded-3xl"
              variant="destructive"
              onClick={unmount}
            >
              취소
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewTodo;
