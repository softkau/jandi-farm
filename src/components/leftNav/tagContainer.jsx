"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import TagCard from "./tagCard";

export default function TagContainer({
  tags,
  setTags,
  selectedTags,
  setSelectedTags,
}) {
  const { data: session } = useSession();
  const [showForm, setShowForm] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleDelete = async (name) => {
    try {
      const response = await fetch(`/api/user/${session.user.id}/tag`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tags: [name] }),
      });
      if (!response.ok) {
        throw new Error("태그 삭제 실패");
      }
      setTags((prevItems) => prevItems.filter((item) => item !== name));
    } catch (error) {
      console.log("태그 삭제 실패 : ", error);
    }
  };

  const handleSelected = (tagName) => {
    //const newSelected = new Set(selectedTags);
    //if (newSelected.has(tagName)) {
    //  newSelected.delete(tagName);
    //} else {
    //  newSelected.add(tagName);
    //}
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((x) => x !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleAddTag = async (e) => {
    if (e.key === "Enter" && newTag.trim()) {
      const trimmedTag = newTag.trim();
      if (tags.includes(trimmedTag)) {
        alert(`태그 "${trimmedTag}"이(가) 이미 존재합니다`);
        return;
      }
      try {
        const response = await fetch(`/api/user/${session.user.id}/tag`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tags: [trimmedTag] }),
        });

        if (!response.ok) {
          throw new Error("태그 추가 실패");
        }
        setTags([...tags, newTag.trim()]);
        setNewTag("");
        setShowForm(false);
      } catch (error) {
        console.log("태그 추가 실패 : ", error);
        setNewTag("");
        setShowForm(false);
      }
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
            isSelected={selectedTags.includes(data)}
            handleSelected={handleSelected}
            handleDeleteByName={handleDelete}
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
