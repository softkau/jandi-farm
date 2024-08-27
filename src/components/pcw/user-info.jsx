import { LogOut, SlidersVertical, CircleUserRound } from "lucide-react"
import { Button } from "../ui/button"
import { signOut } from "next-auth/react"

const UserInfo = ({ className, ...props }) => {
  return (
    <div>
      <CircleUserRound />
      <Button variant="ghost">
        <SlidersVertical />
        설정
      </Button>
      <Button variant="ghost" onClick={signOut}>
        <LogOut />
        로그아웃
      </Button>
    </div>
  )
}

export default UserInfo