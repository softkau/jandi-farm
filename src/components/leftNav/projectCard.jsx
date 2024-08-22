import Image from "next/image";

// TODO : data 구체화하기
export default function ProjectCard({
  isFocused = false,
  data,
  handleSelected,
}) {
  return (
    <div>
      <div
        className="h-10 w-full flex items-center p-1 cursor-pointer"
        onClick={() => handleSelected(data._id, isFocused)}
      >
        <div className="p-1 h-full aspect-square">
          <Image
            src={"/pen-icon.png"}
            alt=""
            layout="responsive"
            width={1}
            height={1}
          />
        </div>
        <div
          className={`ml-2 mr-auto ${isFocused ? "font-bold" : "font-medium"}`}
        >
          {data.title}
        </div>
        {isFocused ? (
          <div className="h-full aspect-square">
            <Image
              src={"/detail.png"}
              alt=""
              layout="responsive"
              width={1}
              height={1}
            />
          </div>
        ) : (
          <div className="h-full aspect-square flex items-center justify-center">
            <span>3</span>
          </div>
        )}
      </div>
      {isFocused && (
        <div className="h-36 bg-white rounded-md m-1">
          <div>{data.detail}</div>
          <div>{data.due_date}</div>
        </div>
      )}
    </div>
  );
}
