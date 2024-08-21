"use client";

import { useState } from "react";
import Image from "next/image";
import TagCard from "./tagCard";

export default function TagContainer({
  tags,
  setTags,
  selectedTags,
  setSelectedTags,
}) {
  const [showForm, setShowForm] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleSelected = (tagName) => {
    const newSelected = new Set(selectedTags);
    if (newSelected.has(tagName)) {
      newSelected.delete(tagName);
    } else {
      newSelected.add(tagName);
    }
    setSelectedTags(newSelected);
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      setShowForm(false);
    } else if (e.key === "Escape") {
      setNewTag("");
      setShowForm(false);
    }
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
        {showForm && (
          <div
            className={`rounded-lg border-2 border-gray-500 px-2 cursor-pointer`}
          >
            <input
              type="text"
              value={newTag}
              className="w-24"
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              autoFocus
            />
          </div>
        )}
        {!showForm && (
          <div
            className={`rounded-lg border-2 border-gray-500 cursor-pointer`}
            onClick={() => setShowForm(true)}
          >
            <Image alt="" src={"/plus.png"} width="25" height="25" />
          </div>
        )}
      </div>
    </div>
  );
}
