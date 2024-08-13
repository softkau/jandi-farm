import Image from "next/image";

export default function ProjectCard({ isFocused = false }) {
  return (
    <div className="">
      <div className="h-10 w-full flex items-center p-1">
        <div className="p-1 h-full aspect-square">
          <Image
            src={"/pen-icon.png"}
            layout="responsive"
            width={10}
            height={10}
          />
        </div>
        <div
          className={`ml-2 mr-auto ${isFocused ? "font-bold" : "font-medium"}`}
        >
          Project title
        </div>
        {isFocused ? (
          <div className="h-full aspect-square">
            <Image
              src={"/detail.png"}
              layout="responsive"
              width={10}
              height={10}
            />
          </div>
        ) : (
          <div className="h-full aspect-square flex items-center justify-center">
            <span>3</span>
          </div>
        )}
      </div>
      {isFocused && <div className="h-36 bg-white rounded-md m-1">test</div>}
    </div>
  );
}
