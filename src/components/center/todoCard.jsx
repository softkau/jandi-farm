import TagCard from "../leftNav/tagCard";

export default function TodoCard({ title, done, detail, tags }) {
  return (
    <div className="w-full rounded-md shadow-md px-6 py-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <span className={`font-bold ${done && "line-through"}`}>{title}</span>
        <input
          type="checkbox"
          checked={done}
          readOnly
          className="h-4 aspect-square text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        />
      </div>
      <div>{detail}</div>
      <div className="flex flex-row-reverse gap-2">
        {tags.map((data, idx) => (
          <TagCard key={idx} name={data} textSize={"text-sm"} />
        ))}
      </div>
    </div>
  );
}
