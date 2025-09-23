import * as React from "react"

interface CustomBadgeProps {
  text: string
  className?: string
}

export function CustomBadge({ text, className = "" }: CustomBadgeProps) {
  return (
    <div className={`flex items-center justify-between px-2 ml-2 border border-border-primary w-fit rounded-md py-1 bg-bg-secondary ${className}`}>
      <div className="text-text-secondary text-xs font-regular flex-1 text-sm flex">
        {text}
      </div>
    </div>
  )
}