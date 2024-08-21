import TodoCard from "./todoCard";
import { format } from "date-fns";

function DateDivider({ date }) {
  return (
    <div className="flex items-center my-12">
      <div className="flex-grow border-t border-black"></div>
      <span className="px-4 text-gray-600 text-2xl font-bold">{date}</span>
      <div className="flex-grow border-t border-black"></div>
    </div>
  );
}

export default function DateContainer({ date, todoList }) {
  const handleDone = (id) => {};

  return (
    <div className="w-full">
      <DateDivider date={format(date, `yyyy.MM.dd`)} />
      <div className="w-full px-12 pb-12 flex flex-col items-center gap-4">
        {todoList.map((data, idx) => (
          <TodoCard
            key={idx}
            title={data.title}
            done={data.done}
            detail={data.detail}
            tags={data.tags}
          />
        ))}
      </div>
    </div>
  );
}
