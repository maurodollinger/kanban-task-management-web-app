'use client';
import { useTheme } from "../contexts/ThemeContext";

type PageProps = {
    children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
    const { sidebarHidden } = useTheme();
    return (
        <div className={`dashboard-select ${sidebarHidden ? 'paddingOn' : ''}`}>
            {children ? (
                children
            ) : (
                <div className='empty-board'>
                    <p className="heading-l">Select a board on the sidebar to get started</p>
                </div>
            )}
        </div>
    )
}