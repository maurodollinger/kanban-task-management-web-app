'use client';

import { useTheme } from '@/app/contexts/ThemeContext';
import { useScrollContainer } from 'react-indiana-drag-scroll';

export default function Layout({ children }: { children: React.ReactNode }) {
    const { sidebarHidden } = useTheme();
    const scrollContainer = useScrollContainer();

    return (
        <div ref={scrollContainer.ref} className={`dashboard-main ${sidebarHidden ? 'paddingOn' : ''}`}>
            {children}
        </div>
    )
}

