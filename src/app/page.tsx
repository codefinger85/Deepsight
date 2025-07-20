"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Home, BarChart3, PieChart, FileText, Users, Settings, HelpCircle, Search } from "lucide-react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import SessionsTable from "@/components/dashboard/SessionsTable";

// Function to open trading tool in popup window
const openTradingTool = () => {
  const width = 300;
  const height = window.screen.height; // Full viewport height
  const left = window.screen.width - width - 50; // Position on right side with margin
  const top = 0;
  
  // Modern browsers ignore UI hiding parameters for security
  // Use Chrome application mode for cleaner UI
  const popup = window.open(
    '/trading',
    'trading-tool',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  );
  
  // Focus the popup window
  if (popup) {
    popup.focus();
  }
};

const sidebarItems = [
  { icon: Home, label: "Home", active: false },
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: PieChart, label: "Analytics", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: Users, label: "Team", active: false },
];

const bottomSidebarItems = [
  { icon: Settings, label: "Settings" },
  { icon: HelpCircle, label: "Support" },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        {/* Logo */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-slate-900">Deepsight</h1>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 pb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href="#"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Documents Section */}
        <div className="px-4 py-4">
          <h3 className="px-3 mb-2 text-xs font-medium text-slate-500 uppercase tracking-wider">Documents</h3>
          <ul className="space-y-1">
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                <FileText className="w-4 h-4" />
                Data Library
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50">
                <FileText className="w-4 h-4" />
                Reports
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom Section */}
        <div className="px-4 pb-6">
          <ul className="space-y-1">
            {bottomSidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.label}>
                  <a
                    href="#"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
                <p className="text-sm text-slate-500">Trading Analytics Overview</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  onClick={openTradingTool}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800 px-3 py-2 gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open Trading Tool</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 p-6 overflow-auto">
          {/* Metrics Cards */}
          <MetricsCards />
          
          {/* Performance Chart */}
          <PerformanceChart />
          
          {/* Sessions Table */}
          <SessionsTable />
        </div>
      </div>
    </div>
  );
}