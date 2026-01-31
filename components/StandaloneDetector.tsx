'use client';

import { useEffect, useState } from 'react';
import { Smartphone, Check, ExternalLink } from 'lucide-react';

export default function StandaloneDetector() {
  const [displayMode, setDisplayMode] = useState<'browser' | 'standalone' | 'checking'>('checking');

  useEffect(() => {
    // Check if running as standalone app
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone ||
                        document.referrer.includes('android-app://');

    setDisplayMode(isStandalone ? 'standalone' : 'browser');

    // Log for debugging
    console.log('Display Mode:', isStandalone ? 'Standalone App ✅' : 'Browser Mode 🌐');
  }, []);

  // Don't show anything if already in standalone mode
  if (displayMode === 'standalone' || displayMode === 'checking') {
    return null;
  }

  // Only show if in browser and not dismissed
  const dismissed = sessionStorage.getItem('standalone-hint-dismissed');
  if (dismissed) {
    return null;
  }

  return (
    <div className="fixed top-16 sm:top-20 left-2 right-2 sm:left-4 sm:right-4 md:left-auto md:right-4 md:w-80 bg-amber-500/90 backdrop-blur-sm text-white rounded-lg shadow-xl p-3 z-40 animate-slide-down">
      <button
        onClick={() => sessionStorage.setItem('standalone-hint-dismissed', 'true')}
        className="absolute -top-1 -right-1 bg-white text-amber-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg hover:scale-110 transition-transform"
      >
        ✕
      </button>
      
      <div className="flex items-start gap-2">
        <ExternalLink className="h-5 w-5 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium mb-1">
            Browser Mode
          </p>
          <p className="text-xs opacity-90">
            Install app for full-screen experience without browser UI!
          </p>
        </div>
      </div>
    </div>
  );
}
