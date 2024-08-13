'use client'

import React from 'react'
import { format } from "date-fns"
import { ko } from "date-fns/locale"

import { Calendar as CalendarIcon } from "lucide-react"
import { DayPicker } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarClassNames, CalendarComponents, CalendarFormatters } from '../calender-style'

const DatePicker = React.forwardRef(({ placeholder, onChange, value, ...props }, ref) => {

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP", { locale: ko }) : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <DayPicker
          mode="single"
          showOutsideDays={true}
          fixedWeeks={true}
          initialFocus
          selected={value}
          onSelect={onChange}
          className="p-3"
          locale={ko}

          classNames={CalendarClassNames}
          formatters={CalendarFormatters}
          components={CalendarComponents}
          { ...props }
        />
      </PopoverContent>
    </Popover>
  )
})

export default DatePicker