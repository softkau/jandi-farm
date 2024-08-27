"use client"
import { LogOut, SlidersVertical, CircleUserRound, LogIn } from "lucide-react"
import { Button } from "../ui/button"
import { signOut, signIn } from "next-auth/react"
import { cn } from "@/lib/utils"
import Image from "next/image"

const UserInfo = ({ session, className, ...props }) => {
  return (
    <div className={cn("flex flex-col w-full h-1/3 overflow-hidden items-center p-5", className)}>
      {
      session?.user ? (
        <>
          <Image
            src={session.user.image}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: '70%', height: 'auto' }}
            className="rounded-full"
          />
          <br />
          <div className="flex flex-col w-full justify-start items-start">
            <Button variant="ghost" className="h-[30px] p-1">
              <SlidersVertical />
              설정
            </Button>
            <Button variant="ghost" className="h-[30px] p-1" onClick={signOut}>
              <LogOut />
              로그아웃
            </Button>
          </div>
          
        </>
      ) : (
        <>
          <CircleUserRound style={{ width: '70%', height: 'auto' }}/>
          <br />
          <div className="flex flex-col w-full justify-start items-start">
            <Button variant="ghost" className="h-[30px] p-1" onClick={signIn}>
              <LogIn />
              로그인
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

export default UserInfo