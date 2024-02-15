'use client';
import { useTheme } from "../contexts/ThemeContext";

export default function Page() {
    const { sidebarHidden } = useTheme();
    return (
        <div className={`dashboard-select ${sidebarHidden ? 'paddingOn' : ''}`}>
            <div className='empty-board'>
                <p className="heading-l">Select a board on the sidebar to get started</p>
            </div>
        </div>
    )
}