import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/shadcn dashboard/components/app-sidebar"
import { ChartAreaInteractive } from "@/app/shadcn dashboard/components/chart-area-interactive"
import { DataTable } from "@/app/shadcn dashboard/components/data-table"
import { SectionCards } from "@/app/shadcn dashboard/components/section-cards"
import { SiteHeader } from "@/app/shadcn dashboard/components/site-header"

import data from "./shadcn dashboard/data.json"

export default function Page() {
  return (
    <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "50px",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset className="flex flex-col h-screen">
          <SiteHeader />
          <div className="flex-1 overflow-auto">
            <div className="@container/main flex flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
  )
}
