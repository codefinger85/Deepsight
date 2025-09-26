"use client"

import { IconSettings, IconMoon, IconLogout, IconUser } from "@tabler/icons-react"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataRefreshButton } from "./dataRefreshButton"

export function SiteHeader({ onRefreshData }: { onRefreshData: () => void }) {
  return (
    <header className="bg-background sticky top-0 z-10 flex h-[70px] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]">
      <div className="flex w-full items-center gap-1 px-6">
        <div className="flex items-center gap-2">
          <Image 
            src="/Deepsight logo.svg" 
            alt="Deepsight" 
            width={130} 
            height={26}
            className="h-auto w-[130px]"
          />
        </div>
        <div className="ml-auto flex items-center gap-4 ">
          <DataRefreshButton onRefreshData={onRefreshData} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer border">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="bg-bg-secondary text-text-secondary">
                  <IconUser className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2">
              <DropdownMenuItem className="cursor-pointer text-text-secondary hover:text-text-primary">
                <IconSettings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-text-secondary hover:text-text-primary">
                <IconMoon className="mr-2 h-4 w-4" />
                Dark Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-text-secondary hover:text-text-primary">
                <IconLogout className="mr-2 h-4 w-4" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
