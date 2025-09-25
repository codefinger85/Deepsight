"use client"

import { IconCirclePlusFilled, IconSettings, IconMoon, IconLogout, IconUser } from "@tabler/icons-react"
import { ChartColumnBig, DatabaseBackup } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipPortal,
} from "@/components/ui/tooltip"

// PWA Install functionality
const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
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
    isInstalled: mounted ? isInstalled : false,
    canInstall: mounted ? canInstall : false,
    handleClick
  };
};

export function SiteHeader({ onRefreshData }: { onRefreshData: () => void }) {
  const { isInstalled, canInstall, handleClick } = usePWAInstall();
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
          <Button 
            variant="outline" 
            size="sm" 
            className="p-1.5 h-fit gap-1.5"
            onClick={onRefreshData}
          >
            <DatabaseBackup className="h-4 w-4" strokeWidth="1.5" />
            <span>Refresh data</span>
          </Button>
          <Button 
            size="sm"
            onClick={handleClick}
            disabled={!isInstalled && !canInstall}
            className="bg-button-secondary border border-border-primary rounded-lg text-text-secondary font-normal hover:bg-button-muted disabled:bg-button-muted disabled:cursor-not-allowed disabled:text-text-tertiary gap-1.5 shadow-sm"
          >
            <ChartColumnBig className="text-text-secondary" strokeWidth={1.5} />
            <span>
              {isInstalled ? "Launch App" : canInstall ? "Install App" : "App Unavailable"}
            </span>
          </Button>
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
