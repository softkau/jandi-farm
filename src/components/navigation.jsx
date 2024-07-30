"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathName = usePathname();

  const getLinkClass = (path) => {
    return pathName === path ? "font-bold" : "font-normal";
  };

  const NAV_LIST = [
    ["/", "홈"],
    ["/mypage", "마이페이지"],
    ["/todo", "일일 TODO"],
    ["/projects", "프로젝트"],
  ];

  return (
    <nav className="bg-gray-600 p-4 flex justify-between items-center text-white">
      {/* 네비게이션 바 */}
      <div className="flex space-x-4">
        {NAV_LIST.map((path, idx) => (
          <Link key={idx} href={path[0]} className="hover:underline">
            <div className={getLinkClass(path[0])}>{path[1]}</div>
          </Link>
        ))}
      </div>
      {/* 프로필 링크 */}
      <div className="flex items-center space-x-4">
        <Link href="/mypage">
          {" "}
          <span>skku_account</span>
        </Link>
        <Link href="/mypage">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
        </Link>
      </div>
    </nav>
  );
}
