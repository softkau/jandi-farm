import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const CardWrapper = ({ children, title, className }) => {
  return (
    <Card className={cn("rounded-3xl", className)}>
      <CardHeader className="justify-start">
        <h1 className="text-2xl font-bold">{title}</h1>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
}

export default CardWrapper