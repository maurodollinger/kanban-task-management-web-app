import React from "react";
import Sidenav from "@/app/ui/dashboard/sidenav/sidenav";
import Header from "../ui/dashboard/header/header";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function Layout( {children} : { children: React.ReactNode}){
    
    return (
        <ThemeProvider>
            <Header/>
            <section>
                <Sidenav/>
                {children}
            </section>
        </ThemeProvider>
        
    )    
}