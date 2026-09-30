import React from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { PrayerId } from '@/domain/types';

export type IconName = PrayerId | 'pin' | 'chevron' | 'back' | 'check' | 'close' | 'gps' | 'palette' | 'clock' | 'arrow' | 'info';
export function Icon({ name, color = '#49694E', size = 22 }: { name: IconName; color?: string; size?: number }) {
  const common = { fill: 'none', stroke: color, strokeWidth: 1.55, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const moon = <Path d="M19.5 15A8 8 0 0 1 9 4.5a8.4 8.4 0 1 0 10.5 10.5Z" {...common} />;
  const sun = <><Circle cx="12" cy="12" r="4" {...common} /><Path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" {...common} /></>;
  const sunset = <><Path d="M6 15a6 6 0 0 1 12 0M3 15h18M5 19h14M12 3v3M3.8 7.5l2 2m12.4 0 2-2" {...common} /></>;
  const shapes: Record<IconName, React.ReactNode> = {
    imsak: moon, yatsi: moon, gunes: sunset, aksam: sunset, ogle: sun,
    ikindi: <><Circle cx="9" cy="9" r="4" {...common} /><Path d="M9 1v2M1 9h2m12-6-1.5 1.5M3 3l1.5 1.5M8 19a4 4 0 1 1 1.5-7.7A5 5 0 0 1 19 13a3 3 0 0 1 0 6Z" {...common} /></>,
    pin: <><Path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" {...common} /><Circle cx="12" cy="10" r="2.3" {...common} /></>,
    chevron: <Path d="m8 10 4 4 4-4" {...common} />,
    back: <Path d="m14 5-7 7 7 7" {...common} />,
    arrow: <Path d="M4 12h16m-6-6 6 6-6 6" {...common} />,
    check: <Path d="m5 12 4 4L19 6" {...common} />,
    close: <Path d="m6 6 12 12M6 18 18 6" {...common} />,
    gps: <><Circle cx="12" cy="12" r="7" {...common} /><Circle cx="12" cy="12" r="2" {...common} /><Path d="M12 2v3m0 14v3M2 12h3m14 0h3" {...common} /></>,
    palette: <><Circle cx="12" cy="12" r="8" {...common} /><Path d="M12 4v16" {...common} /><Path d="M12 4a8 8 0 0 1 0 16Z" fill={color} opacity=".22" /></>,
    clock: <><Circle cx="12" cy="12" r="8" {...common} /><Path d="M12 7v5l3 2" {...common} /></>,
    info: <><Circle cx="12" cy="12" r="8" {...common} /><Path d="M12 11v5" {...common} /><Circle cx="12" cy="7.7" r=".8" fill={color} /></>,
  };
  return <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden={true}>{shapes[name]}</Svg>;
}
export function Logo({ size = 30, color = '#628567' }: { size?: number; color?: string }) {
  return <Svg width={size} height={size} viewBox="0 0 40 40" aria-hidden={true}>
    <Rect width="40" height="40" rx="13" fill={color} />
    <Circle cx="20" cy="20" r="11.5" fill="none" stroke="#FFFFFF" opacity=".4" strokeDasharray="1 3" />
    <Path d="M21 9a11 11 0 1 0 9 15A9 9 0 0 1 21 9Z" fill="#FFFFFF" />
    <Circle cx="28" cy="14" r="1.8" fill="#FFFFFF" />
  </Svg>;
}
