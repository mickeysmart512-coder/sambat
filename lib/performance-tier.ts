'use client';
import { useEffect, useState } from 'react';

export type PerformanceTier = 'low' | 'high';
export function getPerformanceTier(): PerformanceTier {
  if (typeof window === 'undefined') return 'high';
  const navigatorWithMemory = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return reduced || navigatorWithMemory.connection?.saveData || (navigator.hardwareConcurrency || 4) <= 2 || (navigatorWithMemory.deviceMemory || 4) <= 2 ? 'low' : 'high';
}
export function usePerformanceTier() { const [tier, setTier] = useState<PerformanceTier>('high'); useEffect(() => setTier(getPerformanceTier()), []); return tier; }
