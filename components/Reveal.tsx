'use client';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { usePerformanceTier } from '@/lib/performance-tier';
export default function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null); const [visible, setVisible] = useState(false); const tier = usePerformanceTier();
  useEffect(() => { if (tier === 'low' || !ref.current) return setVisible(true); const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: .15 }); observer.observe(ref.current); return () => observer.disconnect(); }, [tier]);
  return <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(14px)', transition: `opacity 500ms var(--ease-out-expo) ${delay}ms, transform 500ms var(--ease-out-expo) ${delay}ms` }}>{children}</div>;
}
