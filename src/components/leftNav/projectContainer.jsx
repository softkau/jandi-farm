import ProjectCard from "./projectCard";

export default function ProjectContainer({}) {
  return (
    <div className="w-full flex flex-col p-1 gap-2">
      <ProjectCard />
      <ProjectCard isFocused={true} />
      <ProjectCard />
      <ProjectCard />
    </div>
  );
}
