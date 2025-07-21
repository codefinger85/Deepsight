"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Home, BarChart3, PieChart, FileText, Users, Settings, HelpCircle, Search, Download } from "lucide-react";
import MetricsCards from "@/components/dashboard/MetricsCards";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import SessionsTable from "@/components/dashboard/SessionsTable";

// Deepsight Icon Component
const DeepsightIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 513 513" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M338.425 499.606L275.211 347.531C287.038 345.072 298.037 340.332 307.738 333.788L371.029 486.053L338.425 499.606ZM333.582 307.554L486.147 370.871L499.677 338.256L346.945 274.869C344.577 286.737 339.969 297.789 333.582 307.554ZM346.975 238.159L499.824 175.034L486.341 142.397L333.669 205.451C340.038 215.227 344.628 226.286 346.975 238.159ZM307.667 179.038L370.824 26.7174L338.203 13.1933L275.128 165.325C286.958 167.773 297.961 172.503 307.667 179.038ZM237.718 165.343L174.505 13.2693L141.899 26.8227L205.193 179.085C214.892 172.541 225.892 167.802 237.718 165.343ZM179.35 205.315L26.7866 141.999L13.2519 174.612L165.987 237.999C168.355 226.131 172.965 215.081 179.35 205.315ZM165.954 274.717L13.1139 337.841L26.5918 370.476L179.263 307.425C172.893 297.649 168.302 286.591 165.954 274.717ZM205.262 333.836L142.108 486.153L174.725 499.677L237.8 347.548C225.971 345.1 214.968 340.37 205.262 333.836ZM368.386 170.501C361.248 161.073 352.964 152.573 343.742 145.213L425.995 63.8027L450.831 88.8987L368.386 170.501ZM396.08 274.091H512.465V238.78H396.079C396.792 244.565 397.159 250.458 397.159 256.437C397.159 262.415 396.793 268.307 396.08 274.091ZM343.033 368.222C352.303 360.92 360.643 352.472 367.84 343.09L449.754 425.213L424.754 450.154L343.033 368.222ZM238.634 397.105L238.489 512.412L273.798 512.459L273.945 397.149C268.218 397.864 262.384 398.233 256.465 398.233C250.425 398.233 244.474 397.849 238.634 397.105ZM86.9379 449.071L169.189 367.662C159.968 360.302 151.683 351.803 144.544 342.374L62.0982 423.977L86.9379 449.071ZM116.851 238.78H0.464844V274.091H116.85C116.137 268.307 115.77 262.415 115.77 256.437C115.77 250.458 116.138 244.565 116.851 238.78ZM169.9 144.648C160.63 151.95 152.291 160.397 145.094 169.779L63.1776 87.6543L88.1771 62.7172L169.9 144.648ZM274.301 115.769L274.448 0.458602L239.137 0.414062L238.991 115.723C244.716 115.009 250.548 114.641 256.465 114.641C262.507 114.641 268.46 115.024 274.301 115.769Z" />
  </svg>
);

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
          console.log('PWA Debug - getInstalledRelatedApps result:', relatedApps);
          setIsInstalled(relatedApps.length > 0);
        } catch (error) {
          console.log('PWA Debug - getInstalledRelatedApps error:', error);
        }
      } else {
        console.log('PWA Debug - getInstalledRelatedApps not supported');
      }
    };

    // Timeout fallback - assume can install after 3 seconds if no event
    const timeout = setTimeout(() => {
      if (!installPrompt && !isInstalled) {
        console.log('PWA Debug - No beforeinstallprompt after 3s, forcing canInstall=true');
        setCanInstall(true);
      }
    }, 3000);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: any) => {
      console.log('PWA Debug - beforeinstallprompt fired');
      e.preventDefault();
      setInstallPrompt(e);
      setCanInstall(true);
      setIsInstalled(false);
      clearTimeout(timeout);
    };

    // Listen for app installation
    const handleAppInstalled = () => {
      console.log('PWA Debug - appinstalled fired');
      setInstallPrompt(null);
      setCanInstall(false);
      setIsInstalled(true);
      clearTimeout(timeout);
    };

    checkInstalled();
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [installPrompt, isInstalled]);

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
                      <DeepsightIcon className="w-4 h-4 text-white" />
                      <span>Open Trading Tool</span>
                    </>
                  ) : canInstall ? (
                    <>
                      <DeepsightIcon className="w-4 h-4 text-white" />
                      <span>Install Trading Tool</span>
                    </>
                  ) : (
                    <>
                      <DeepsightIcon className="w-4 h-4 text-white" />
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