'use client'
import { DayPicker } from "react-day-picker"
import { cn } from '@/lib/utils'
import { CalendarClassNames, ChevronFactory, CalendarFormatters } from './calender-style'
import { ko } from 'date-fns/locale'
import { getJandiModifier } from './jandi-styles'

const modifiersClassNames = {
  lvl0: "bg-todo0 text-black rounded-md hover:bg-slate-300",
  lvl1: "bg-todo1 text-black rounded-md hover:bg-todo1/50",
  lvl2: "bg-todo2 text-black rounded-md hover:bg-todo2/50",
  lvl3: "bg-todo3 text-white rounded-md hover:bg-todo3/50",
  lvl4: "bg-todo4 text-white rounded-md hover:bg-todo4/50",
};

const TodoCalendar = ({ gs, className, viewMonth, decViewMonth, incViewMonth, ...props }) => {
  const {
    focusedDate,
    selectedTags,
    selectedProject,
    todoList,
    setFocusedDate
  } = gs;

  const modifiers = getJandiModifier(
    todoList,
    new Date(viewMonth.getFullYear(), viewMonth.getMonth(), 1),
    new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1),
    {
      done: false,
      project: selectedProject,
      tag: selectedTags
    }
  );

  return (
    <DayPicker
      mode="single"
      selected={focusedDate}
      onSelect={setFocusedDate}
      showOutsideDays={false}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      defaultMonth={viewMonth}
      className={cn("p-3", className)}
      classNames={{
        ...CalendarClassNames,
        day: `caret-transparent h-8 w-8 p-0 m-0.5 text-center text-sm`,
        day_button: "h-8 w-8 font-normal",
        selected: "!text-red-400 ring ring-2 ring-red-400",
      }}
      formatters={CalendarFormatters}
      components={{
        Chevron: ChevronFactory(decViewMonth, incViewMonth)
      }}
      locale={ko}
      required
      { ...props }
    />
  )
}

export default TodoCalendar