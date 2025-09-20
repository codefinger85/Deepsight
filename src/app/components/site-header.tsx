"use client"

import { IconCirclePlusFilled, IconSettings, IconMoon, IconLogout, IconUser } from "@tabler/icons-react"
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

// Deepsight Icon Component  
const DeepsightIcon = ({ className }: { className?: string }) => (
  <svg width="28" height="28" viewBox="0 0 513 513" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M338.425 499.606L275.211 347.531C287.038 345.072 298.037 340.332 307.738 333.788L371.029 486.053L338.425 499.606ZM333.582 307.554L486.147 370.871L499.677 338.256L346.945 274.869C344.577 286.737 339.969 297.789 333.582 307.554ZM346.975 238.159L499.824 175.034L486.341 142.397L333.669 205.451C340.038 215.227 344.628 226.286 346.975 238.159ZM307.667 179.038L370.824 26.7174L338.203 13.1933L275.128 165.325C286.958 167.773 297.961 172.503 307.667 179.038ZM237.718 165.343L174.505 13.2693L141.899 26.8227L205.193 179.085C214.892 172.541 225.892 167.802 237.718 165.343ZM179.35 205.315L26.7866 141.999L13.2519 174.612L165.987 237.999C168.355 226.131 172.965 215.081 179.35 205.315ZM165.954 274.717L13.1139 337.841L26.5918 370.476L179.263 307.425C172.893 297.649 168.302 286.591 165.954 274.717ZM205.262 333.836L142.108 486.153L174.725 499.677L237.8 347.548C225.971 345.100 214.968 340.37 205.262 333.836ZM368.386 170.501C361.248 161.073 352.964 152.573 343.742 145.213L425.995 63.8027L450.831 88.8987L368.386 170.501ZM396.08 274.091H512.465V238.78H396.079C396.792 244.565 397.159 250.458 397.159 256.437C397.159 262.415 396.793 268.307 396.08 274.091ZM343.033 368.222C352.303 360.92 360.643 352.472 367.84 343.09L449.754 425.213L424.754 450.154L343.033 368.222ZM238.634 397.105L238.489 512.412L273.798 512.459L273.945 397.149C268.218 397.864 262.384 398.233 256.465 398.233C250.425 398.233 244.474 397.849 238.634 397.105ZM86.9379 449.071L169.189 367.662C159.968 360.302 151.683 351.803 144.544 342.374L62.0982 423.977L86.9379 449.071ZM116.851 238.78H0.464844V274.091H116.85C116.137 268.307 115.77 262.415 115.77 256.437C115.77 250.458 116.138 244.565 116.851 238.78ZM169.9 144.648C160.63 151.95 152.291 160.397 145.094 169.779L63.1776 87.6543L88.1771 62.7172L169.9 144.648ZM274.301 115.769L274.448 0.458602L239.137 0.414062L238.991 115.723C244.716 115.009 250.548 114.641 256.465 114.641C262.507 114.641 268.46 115.024 274.301 115.769Z" />
  </svg>
);

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

export function SiteHeader() {
  const { isInstalled, canInstall, handleClick } = usePWAInstall();
  return (
    <header className="bg-background/90 sticky top-0 z-10 flex h-[70px] shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-[--header-height]">
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
            size="sm"
            onClick={handleClick}
            disabled={!isInstalled && !canInstall}
            className="h-8 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed gap-1"
          >
            <DeepsightIcon className="text-white" />
            <span>
              {isInstalled ? "Open Trading Tool" : canInstall ? "Install Trading Tool" : "Trading Tool Unavailable"}
            </span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="h-9 w-9 cursor-pointer">
                <AvatarImage src="/avatars/user.jpg" alt="User" />
                <AvatarFallback className="bg-slate-100 text-slate-600">
                  <IconUser className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem className="cursor-pointer">
                <IconSettings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <IconMoon className="mr-2 h-4 w-4" />
                Dark Mode
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
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
