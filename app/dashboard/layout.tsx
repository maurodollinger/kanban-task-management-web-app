import React from "react";
import Sidenav from "@/app/ui/dashboard/sidenav/sidenav";
import Header from "../ui/dashboard/header/header";
import { ThemeProvider } from "../contexts/ThemeContext";
import './page.scss';
import { BoardProvider } from "../contexts/BoardContext";
import Modal from "../ui/modal/modal";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            <ThemeProvider>
                <BoardProvider>
                    <Header />
                    <Sidenav />
                    <section>
                        {children}
                    </section>
                    <Modal />
                </BoardProvider>
            </ThemeProvider>
        </main>

    )
}

