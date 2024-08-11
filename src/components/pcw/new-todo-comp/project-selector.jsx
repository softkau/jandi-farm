'use client'

import React from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const ProjectSelector = React.forwardRef(({ projectList=[], onChange, value }, ref) => {
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