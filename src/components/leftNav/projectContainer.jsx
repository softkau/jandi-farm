import ProjectCard from "./projectCard";
import Image from "next/image";

export default function ProjectContainer({}) {
  return (
    <div className="w-full flex flex-col p-1 gap-2">
      <ProjectCard />
      <ProjectCard isFocused={true} />
      <ProjectCard />
      <ProjectCard />
      <div className="flex justify-center items-center p-2">
        <button className="h-10 w-full rounded-3xl border-2 p-1 border-gray-600 flex gap-2 justify-center items-center">
          <div className="h-full aspect-square ">
            <Image src={"/plus.png"} layout="responsive" width={1} height={1} />
          </div>
          <span>프로젝트 추가</span>
        </button>
      </div>
    </div>
  );
}
