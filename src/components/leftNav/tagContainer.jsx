import TagCard from "./tagCard";
import { TagBadge } from "@/components/pcw/new-todo-comp/tag-selector";

export default function TagContainer({
  tags,
  setTags,
  selectedTags,
  setSelectedTags,
}) {
  const handleSelected = (tagName) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagName)) {
      newSelected.delete(tagName);
    } else {
      newSelected.add(tagName);
    }
    setSelectedTags(newSelected);
  };

  return (
    <div className="w-full">
      <span className="font-bold m-4">Tags</span>
      <div className="w-full flex flex-wrap gap-2 p-3">
        {tags.map((data, idx) => (
          <TagCard
            key={idx}
            name={data}
            isSelected={selectedTags.has(data)}
            handleSelected={handleSelected}
          />
        ))}
      </div>
    </div>
  );
}
