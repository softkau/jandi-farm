import TagCard from "../leftNav/tagCard";

export default function TodoCard({ data, handleDone }) {
  return (
    <div
      className={`w-full rounded-md shadow-md px-6 py-4 flex flex-col gap-4 ${
        data.status.done ? "bg-gray-100 opacity-75" : "bg-white"
      }`}
    >
      <div className="flex justify-between">
        <span className={`font-bold ${data.status.done && "line-through"}`}>
          {data.title}
        </span>
        <input
          type="checkbox"
          checked={data.status.done}
          onChange={() => handleDone(data.id)}
          className="h-4 aspect-square text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        />
      </div>
      <div>{data.detail}</div>
      <div className="flex flex-row-reverse gap-2">
        {data.tags.map((name, idx) => (
          <TagCard key={idx} name={name} textSize={"text-sm"} />
        ))}
      </div>
    </div>
  );
}
