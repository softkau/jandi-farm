import TodoCard from "./todoCard";

function DateDivider({ date }) {
  return (
    <div className="flex items-center my-12">
      <div className="flex-grow border-t border-black"></div>
      <span className="px-4 text-gray-600 text-2xl font-bold">{date}</span>
      <div className="flex-grow border-t border-black"></div>
    </div>
  );
}

export default function DateContainer({ todoList }) {
  const handleDone = (id) => {};

  return (
    <div className="w-full">
      <DateDivider date={"2024.08.27"} />
      <div className="w-full px-12 pb-12 flex flex-col items-center gap-4">
        {/* {todoList.map((data, idx) => )} */}
        {[1, 2, 3, 4].map((data, idx) => (
          <TodoCard
            title={"todo card"}
            done={idx % 2}
            detail={
              "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. "
            }
            tags={["tag1", "tag2", "tag3214"]}
          />
        ))}
      </div>
    </div>
  );
}
