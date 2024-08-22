import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { format } from "date-fns"

const CalendarClassNames = {
  months: "flex flex-col w-fit relative",
  month: "space-y-4",
  month_caption: "flex justify-start w-fit items-center",
  caption_label: "text-md font-medium",
  nav: "absolute space-x-1 items-center right-0",
  month_grid: "border-collapse",
  weekdays: "flex",
  weekday: "text-muted-foreground w-9 font-normal text-[0.8rem]",
  week: "flex w-full",
  day: `h-9 w-9 p-0 text-center text-sm`,
  day_button: cn(
    buttonVariants({ variant: "ghost" }),
    "h-9 w-9 font-normal"
  ),
  selected: 
   `bg-primary text-primary-foreground
    hover:bg-accent hover:text-accent-foreground rounded-md`,
  today: "bg-accent text-accent-foreground rounded-md",
  outside: "day-outisde text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
  disabled: "text-muted-foreground opacity-5",
  hidden: "invisible",
}

const CalendarFormatters = {
  formatCaption: (month, options) => format(month, "y년 LLLL", options)
}

const CalendarComponents = {
  Chevron: ({ ...props }) => (
    <>
      {(props.orientation === "left") ? (
        <ChevronUp className="h-6 w-6" />
      ) : (
        <ChevronDown className="h-6 w-6" />
      )}
    </>
  )
}

const ChevronFactory = (onPrev, onNext) => {
  return ({ ...props }) => (
    <>
      {(props.orientation === "left") ? (
        <ChevronUp onClick={onPrev} className="h-6 w-6" />
      ) : (
        <ChevronDown onClick={onNext} className="h-6 w-6" />
      )}
    </>
  )
}

export { CalendarClassNames, CalendarFormatters, CalendarComponents, ChevronFactory }