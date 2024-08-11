'use client'

import React from 'react'
import { Toggle } from '@/components/ui/toggle'
import { cn } from "@/lib/utils"

const TagBadge = ({ title, bgColor, txtColor, ...props }) => {
  return (
    <Toggle
      { ...props }
      className={`h-7 rounded-full data-[state=on]:font-bold caret-transparent`}
    >
      {title}
    </Toggle>
  )
}

const TagSelector = React.forwardRef(({ tagList=[], onChange, value }, ref) => {
  return (
    <div className="flex flex-wrap content-start gap-1">
    {
      tagList.map((tag, index) => {
        return (
          <TagBadge
            title={tag}
            key={index}
            data-state={value.includes(tag) ? 'on' : 'off'}
            onClick={() => {
              if (value.includes(tag)) {
                onChange(value.filter(x => x !== tag))
              } else {
                onChange([...value, tag])
              }
            }}
          />
        )
      })
    }
    </div>
  )
})

export default TagSelector