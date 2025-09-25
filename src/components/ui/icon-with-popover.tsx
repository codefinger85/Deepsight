"use client"

import * as React from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipPortal,
} from "@/components/ui/tooltip"

interface IconWithPopoverProps {
  icon: React.ElementType
  children: React.ReactNode
  className?: string
  side?: "top" | "right" | "bottom" | "left"
  align?: "start" | "center" | "end"
  sideOffset?: number
  alignOffset?: number
}

export function IconWithPopover({ 
  icon: IconComponent, 
  children, 
  className = "",
  side = "bottom",
  align = "center", 
  sideOffset = 4,
  alignOffset = 0
}: IconWithPopoverProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <IconComponent 
          className={`h-4 w-4 text-text-tertiary hover:text-text-secondary cursor-pointer transition-colors ${className}`}
        />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="rounded-lg p-4" 
          side={side} 
          align={align}
          sideOffset={sideOffset}
          alignOffset={alignOffset}
        >
          <div className="text-sm max-w-[250px]">{children}</div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  )
}