import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/app/shadcn dashboard/components/app-sidebar"
import { ChartAreaInteractive } from "@/app/shadcn dashboard/components/chart-area-interactive"
import { DataTable } from "@/app/shadcn dashboard/components/data-table"
import { SectionCards } from "@/app/shadcn dashboard/components/section-cards"
import { SiteHeader } from "@/app/shadcn dashboard/components/site-header"

import data from "./data.json"

export default function Page() {
  return (
    <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 64)",
            "--header-height": "calc(var(--spacing) * 12 + 1px)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
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
