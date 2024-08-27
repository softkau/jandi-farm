import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import React from "react"

const CardWrapper = React.forwardRef(({ children, title, className }, ref) => {
  return (
    <Card className={cn("rounded-3xl", className)} ref={ref}>
      <CardHeader className="justify-start">
        <h1 className="text-2xl font-bold">{title}</h1>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
})

export default CardWrapper