"use client"

import { useState } from "react"
import { DatabaseBackup } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DataRefreshButtonProps {
  onRefreshData: () => void
}

export function DataRefreshButton({ onRefreshData }: DataRefreshButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRefreshClick = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    
    try {
      await onRefreshData()
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="p-1.5 h-fit gap-1.5"
      onClick={handleRefreshClick}
      disabled={isLoading}
    >
      <DatabaseBackup className="h-4 w-4" strokeWidth="1.5" />
      <span>{isLoading ? "Refreshing..." : "Refresh data"}</span>
    </Button>
  )
}