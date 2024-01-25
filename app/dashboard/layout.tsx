import React from "react";
import Sidenav from "@/app/ui/dashboard/sidenav/sidenav";
import Header from "../ui/dashboard/header/header";
import { ThemeProvider } from "../contexts/ThemeContext";
import { fetchBoards } from "../lib/data";
import './page.scss';
export default async function Layout( {children} : { children: React.ReactNode}){
    const boards = await fetchBoards();

    return (
        <main>
            <ThemeProvider>
                <Header boards={boards}/>
                <Sidenav boards={boards}/>
                <section>
                    {children}
                </section>
            </ThemeProvider>
        </main>
        
    )    
}

