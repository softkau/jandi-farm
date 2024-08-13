"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useState, useEffect } from 'react';

/* 로그인/인증 모듈 */
import { signIn, signOut, useSession, getProviders } from 'next-auth/react';

export default function Navigation() {
  /* 세션 정보(시작) */
  const { data: session } = useSession();
  /* 세션 정보(끝) */

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
        {session?.user ? (
          <>
            <button
              type='button'
              className="bg-slate-700 pl-1 pr-1 rounded-md outline outline-1 outline-white"
              onClick={signOut}
            >
              로그아웃
            </button>
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
          </>
        ) : (
          <>
            <button
              type='button'
              className="bg-slate-300 text-black pl-1 pr-1 rounded-md outline outline-1 outline-black"
              onClick={signIn}
            >
              로그인
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
