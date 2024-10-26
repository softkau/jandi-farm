import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1 className="font-bold text-4xl">Root 페이지입니다. 잔디농장 HOME을 클릭해서 접속해주세요...</h1>
      <Link href={"/home"}>잔디농장 HOME</Link>
    </div>
  );
}

