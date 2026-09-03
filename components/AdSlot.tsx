"use client";
import { useEffect } from "react";

export default function AdSlot({ slot, format = 'auto', className = '' }: { slot?: string, format?: 'auto'|'rectangle'|'leaderboard'|'in-article', className?: string }) {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'development') {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`border-2 border-dashed border-gray-600 bg-gray-800/50 flex items-center justify-center text-gray-500 font-mono text-sm p-4 rounded-lg my-4 ${className}`} style={{ minHeight: format === 'leaderboard' ? '90px' : '250px' }}>
        Ad Slot: {format}
      </div>
    );
  }

  return (
    <div className={`my-4 overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center" }}
        data-ad-layout={format === 'in-article' ? 'in-article' : undefined}
        data-ad-format={format === 'in-article' ? 'fluid' : format}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID || 'ca-pub-2501861627867479'}
        data-ad-slot={slot}
        data-full-width-responsive="true"
      />
    </div>
  );
}
