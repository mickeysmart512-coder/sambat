'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
const tabs = [{ href: '/', label: 'Home', icon: '⌂' }, { href: '/tour', label: 'Events', icon: '◫' }, { href: '/music', label: 'Mixes', icon: '♪' }, { href: '/experiences', label: 'Gallery', icon: '◇' }];
export default function Navigation() {
  const pathname = usePathname(); const [playing, setPlaying] = useState(false);
  return <><header className="site-header"><Link href="/" className="wordmark">DJ <i>SAMBAT</i></Link><div className="availability"><span />2026/27 BOOKINGS OPEN</div><Link href="/dashboard" aria-label="My passes" className="passes-button">▦<small>My Passes</small></Link></header>{playing && <div className="mini-player"><button onClick={() => setPlaying(false)} aria-label="Pause mix">Ⅱ</button><div><b>LIVE FROM THE VIBE</b><span><i /></span></div><em>42:16</em></div>}<nav className="bottom-dock" aria-label="Primary navigation">{tabs.map(tab => <Link key={tab.href} href={tab.href} className={pathname === tab.href ? 'dock-tab active' : 'dock-tab'}><b>{tab.icon}</b><span>{tab.label}</span></Link>)}<Link href="/booking" className="dock-book">Book</Link></nav>{!playing && <button className="mix-trigger" onClick={() => setPlaying(true)} aria-label="Play featured mix">▶</button>}</>;
}
