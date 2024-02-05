'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { useDragScroll } from '@/app/hooks/useDragScroll';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { sidebarHidden } = useTheme();
    const [ref] = useDragScroll();

    return (
        <div ref={ref} className={`dashboard-main ${sidebarHidden ? 'paddingOn' : ''}`}>
            {children}
        </div>
    )
}

