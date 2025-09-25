"use client"

import { useState, useEffect } from "react"
import { ChartColumnBig } from "lucide-react"
import { Button } from "@/components/ui/button"

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

export function PWAInstallButton() {
  const { isInstalled, canInstall, handleClick } = usePWAInstall();

  return (
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
  )
}