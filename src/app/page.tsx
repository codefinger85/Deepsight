"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Home, BarChart3, PieChart, FileText, Users, Settings, HelpCircle, Search, Download } from "lucide-react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import SessionsTable from "@/components/dashboard/SessionsTable";

// PWA Install functionality
const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    // Check if PWA is already installed
    const checkInstalled = async () => {
      if ('getInstalledRelatedApps' in navigator) {
        try {
          const relatedApps = await (navigator as any).getInstalledRelatedApps();
          setIsInstalled(relatedApps.length > 0);
        } catch (error) {
          console.log('getInstalledRelatedApps not available');
        }
      }
    };

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
      setIsInstalled(false); // If this event fires, PWA is not installed
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
    };

    checkInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleClick = async () => {
    if (canInstall && installPrompt) {
      // PWA can be installed - install it
      const result = await installPrompt.prompt();
      if (result.outcome === 'accepted') {
        setInstallPrompt(null);
        setCanInstall(false);
        setIsInstalled(true);
      }
    } else if (isInstalled) {
      // PWA is installed - open it
      window.open('/trading', '_blank');
    }
  };

  return {
    isInstalled,
    canInstall,
    handleClick
  };
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
  const { isInstalled, canInstall, handleClick } = usePWAInstall();

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
                  onClick={handleClick}
                  disabled={!isInstalled && !canInstall}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed px-3 py-2 gap-2"
                >
                  {isInstalled ? (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Trading Tool</span>
                    </>
                  ) : canInstall ? (
                    <>
                      <Download className="w-4 h-4" />
                      <span>Install Trading Tool</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Trading Tool Unavailable</span>
                    </>
                  )}
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