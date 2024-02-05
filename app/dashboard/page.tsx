'use client';
import { useTheme } from "../contexts/ThemeContext";
import { Board } from "../lib/definitions";

type PageProps = {
    children: React.ReactNode;
}

export default function Page({ children }: PageProps) {
    const { sidebarHidden } = useTheme();
    return (
        <>
            {children ? (
                children
            ) : (
                <div className={`emptyBoard ${sidebarHidden ? 'paddingOn' : ''}`}>
                    <p>Select a board from the sidebar to open it</p>
                </div>
            )}
        </>
    )
}