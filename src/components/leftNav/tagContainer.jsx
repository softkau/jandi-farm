import TagCard from "./tagCard";

export default function TagContainer() {
  const testData = [
    "운동",
    "코딩",
    "비지니스",
    "약속",
    "학교",
    "대충 겁나 긴 태그~~",
    "연구실",
    "동아리",
  ];
  return (
    <div className="w-full">
      <span className="font-bold m-4">Tags</span>
      <div className="w-full flex flex-wrap gap-2 p-3">
        {testData.map((data, idx) => (
          <TagCard key={idx} name={data} isSelected={idx % 3 == 1} />
        ))}
      </div>
    </div>
  );
}
