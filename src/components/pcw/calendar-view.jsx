import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import JandiCalendar from "./calendar-comp/jandi-calendar"
import TodoCalendar from "./calendar-comp/todo-calendar"
import { useState, useEffect } from "react"

const CalendarView = ({ gs, ...props }) => {
  // {Date} viewMonth - 달력에 현재 보여지는 달(month)
  // 달력의 [^|v] 버튼을 누를 때 표시되는 month 값을 tracking 함
  // Jandi/TodoCalendar는 viewMonth 값을 기준으로 jandi를 렌더링함 
  const [viewMonth, setViewMonth] = useState(new Date(
    gs.focusedDate.getFullYear(), gs.focusedDate.getMonth(), 1
  ));

  useEffect(() => {
    setViewMonth(new Date(
      gs.focusedDate.getFullYear(), gs.focusedDate.getMonth(), 1
    ))
  }, [gs.focusedDate])

  const decViewMonth = () => {
    setViewMonth(new Date(
      viewMonth.getFullYear(), viewMonth.getMonth()-1, 1
    ));
  }
  const incViewMonth = () => {
    setViewMonth(new Date(
      viewMonth.getFullYear(), viewMonth.getMonth()+1, 1
    ));
  }

  return (
    <Tabs defaultValue="jandi" className="flex flex-col w-[280px] justify-center" { ...props }>
      <TabsList className="justify-start bg-transparent pl-3">
        <TabsTrigger value="jandi">JANDI</TabsTrigger>
        <TabsTrigger value="todo">TODO</TabsTrigger>
      </TabsList>
      <TabsContent value="jandi" className="mt-0">
        <JandiCalendar
          className=""
          gs={gs}
          viewMonth={viewMonth}
          decViewMonth={decViewMonth}
          incViewMonth={incViewMonth}
        />
      </TabsContent>
      <TabsContent value="todo" className="mt-0">
        <TodoCalendar
          className=""
          gs={gs}
          viewMonth={viewMonth}
          decViewMonth={decViewMonth}
          incViewMonth={incViewMonth}
        />
      </TabsContent>
    </Tabs>
  )
}

export default CalendarView