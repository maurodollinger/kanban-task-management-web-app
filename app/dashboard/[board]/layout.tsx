'use client';

import { useTheme } from '@/app/contexts/ThemeContext';

export default function Layout( {children} : { children: React.ReactNode}){
    const { sidebarHidden } = useTheme();
    return (
        <div className={`dashboard-main ${sidebarHidden ? 'paddingOn' : ''}`}>
                {children}
        </div>
    )    
}

