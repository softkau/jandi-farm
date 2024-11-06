'use client'

import React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const ProjectSelector = React.forwardRef(({ projectList=[], onChange, value=null }, ref) => {
  const [open, setOpen] = React.useState(false)

  const projects = projectList.map(proj => {
    return { value: proj, label: proj }
  })
 
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {projects.find(project => project.value === value)?.label ?? "없음"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="프로젝트 검색..." />
          <CommandList>
            <CommandEmpty>일치하는 프로젝트가 없음</CommandEmpty>
            <CommandGroup>
              {projects.map(project => (
                <CommandItem
                  key={project.value}
                  value={project.value}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? null : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === project.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {project.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
  
  return (
    <RadioGroup className="block space-y-2" onValueChange={onChange} value={value}>
      {
        projectList.map((project, idx) => {
          return (
            <div className="flex items-center space-x-2" key={idx}>
              <RadioGroupItem
                value={project}
                id={project}
              />
              <Label htmlFor={project}>{project}</Label>
            </div>
          )
        })
      }
    </RadioGroup>
  )
})

export default ProjectSelector