import { cn } from "@/lib/utils";
import TodoCard from "./todoCard";
import { format } from "date-fns";

function DateDivider({ date }) {
  const isToday = format(new Date(), "yyyy.MM.dd") === date;
  return (
    <div className="flex items-center my-12">
      <div className="flex-grow border-t border-black"></div>
      <span className="px-4 text-gray-600 text-2xl font-bold">
        {date} {isToday && <span className="text-black-500">(Today)</span>}
      </span>
      <div className="flex-grow border-t border-black"></div>
    </div>
  );
}

export default function DateContainer({
  date,
  todoList,
  setTodoList,
  className,
}) {
  const handleDone = async (id) => {
    try {
      const updateTodo = todoList.find((todo) => todo.id === id);
      console.log(updateTodo);
      if (!updateTodo) throw new Error("Todo id not found");

      const newStatus = !updateTodo.status.done;

      const response = await fetch(`/api/todo/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: { done: newStatus } }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo status");
      }
      console.log(response);
      setTodoList((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id
            ? { ...todo, status: { ...todo.status, done: newStatus } }
            : todo
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete todo");
      }

      setTodoList((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className={cn("w-full", className)}>
      <DateDivider date={format(date, `yyyy.MM.dd`)} />
      <div className="w-full px-12 pb-12 flex flex-col items-center gap-4">
        {todoList.map((data) => (
          <TodoCard
            key={data.id}
            data={data}
            handleDone={handleDone}
            handleDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
