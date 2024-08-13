'use client'
import React from 'react'
import { DayPicker } from "react-day-picker"
import { cn } from '@/lib/utils'
import { CalendarClassNames, CalendarComponents, CalendarFormatters } from './calender-style'
import { ko } from 'date-fns/locale'

const modifiersClassNames = {
  lvl0: "bg-jandi0 text-black rounded-md hover:bg-slate-300",
  lvl1: "bg-jandi1 text-black rounded-md hover:bg-jandi1/50",
  lvl2: "bg-jandi2 text-black rounded-md hover:bg-jandi2/50",
  lvl3: "bg-jandi3 text-white rounded-md hover:bg-jandi3/50",
  lvl4: "bg-jandi4 text-white rounded-md hover:bg-jandi4/50",
};

const TodoCalendar = ({ gs, className }) => {
  const {
    focusedDate,
    selectedTags,
    selectedProject,
    todoList,
    projectList,
    tagList,
    setFocusedDate
  } = gs;

  const month = focusedDate?.getMonth();
  const year = focusedDate?.getFullYear();
  const numDays = new Date(year, month+1, 0).getDate();
  const firstWeekDay = new Date(year, month, 1).getDay();
  const lastWeekDay = new Date(year, month+1, 0).getDay();

  const firstVisibleDate = 1-(firstWeekDay ? firstWeekDay : 7);
  const lastVisibleDate =  numDays + (6-lastWeekDay ? 6-lastWeekDay : 7);
  const firstVisible = new Date(year, month, firstVisibleDate);
  const lastVisible = new Date(year, month, lastVisibleDate);

  let jandi = {}
  for (let d = firstVisibleDate; d <= lastVisibleDate; d++) {
    jandi[new Date(year, month, d)] = 0;
  }
  
  todoList
    .filter(t => new Date(t?.due_date) >= firstVisible && new Date(t?.due_date) <= lastVisible)
    .forEach(t => {
      jandi[new Date(new Date(t?.due_date).toDateString())]++;
    });

  const max = Math.max(...Object.values(jandi));

  const lvl1Limit = 1;
  const lvl2Limit = Math.max(max / 4, lvl1Limit);
  const lvl3Limit = Math.max(max * 2 / 4, lvl2Limit);
  const lvl4Limit = Math.max(max * 3 / 4, lvl3Limit);

  const filterJandi = (lower, upper) => Object.keys(jandi).filter(
    d => jandi[d] >= lower && jandi[d] < upper
  );

  // 자바 스크립트로 이 배열을 적절히 populate 해야 함
  const certifiedGrassic = {
    dense1: [new Date(2024, 7, 1), new Date(2024, 7, 4)],
    dense2: [new Date(2024, 7, 8), new Date(2024, 7, 9)],
    dense3: [new Date(2024, 7, 2), new Date(2024, 7, 5)],
    dense4: [new Date(2024, 7, 6), new Date(2024, 6, 31)]
  };

  const modifiers = {
    lvl0: true,
    lvl1: filterJandi(lvl1Limit, lvl2Limit).map(x => new Date(x)),
    lvl2: filterJandi(lvl2Limit, lvl3Limit).map(x => new Date(x)),
    lvl3: filterJandi(lvl3Limit, lvl4Limit).map(x => new Date(x)),
    lvl4: filterJandi(lvl4Limit, max + 1).map(x => new Date(x)),
  };

  console.log(modifiers);
  

  return (
    <DayPicker
      mode="single"
      selected={focusedDate}
      onSelect={setFocusedDate}
      showOutsideDays={true}
      modifiers={modifiers}
      modifiersClassNames={modifiersClassNames}
      className={cn("p-3", className)}
      classNames={{
        ...CalendarClassNames,
        day: `caret-transparent h-8 w-8 p-0 m-0.5 text-center text-sm`,
        day_button: "h-8 w-8 font-normal",
        selected: "text-red-400 ring ring-2 ring-red-400"
      }}
      formatters={CalendarFormatters}
      components={CalendarComponents}
      locale={ko}
      required
    />
  )
}

export default TodoCalendar