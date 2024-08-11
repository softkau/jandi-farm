import { Card, CardHeader, CardContent } from "@/components/ui/card"

const CardWrapper = ({ children, title }) => {
  return (
    <Card className="rounded-3xl">
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