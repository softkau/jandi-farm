import ProjectContainer from "@/components/leftNav/projectContainer";
import TagContainer from "@/components/leftNav/tagContainer";

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-between">
      <div className="w-80 h-full flex-shrink-0 flex flex-col bg-gray-100">
        <div className="h-20 bg-green-200 flex justify-center items-center">
          logo
        </div>
        <div className="h-full flex flex-col justify-between">
          <ProjectContainer />
          <TagContainer />
        </div>
      </div>
      <div className="w-144 border-2">center</div>
      <div className="w-96 h-full flex-shrink-0 border-2">right</div>
    </div>
  );
}
