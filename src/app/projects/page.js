import Project from "@/components/project";
import Todo from "@/components/todo";

export default function Home() {
  const projcets = [1, 2, 3, 4, 5, 6, 7];
  return (
    <>
      <div className="border-4 border-gray-300 w-144 pr-12 overflow-y-scroll no-scrollbar">
        {projcets.map((n, idx) => (
          <Project key={idx} name={"test" + n} />
        ))}
      </div>
      <div className="border-4 border-gray-300 w-144 pl-12 overflow-y-scroll no-scrollbar">
        {projcets.map((n, idx) => (
          <Todo key={idx} name={"test" + n} />
        ))}
      </div>
    </>
  );
}
