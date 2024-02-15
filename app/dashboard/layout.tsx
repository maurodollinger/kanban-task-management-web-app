import React from "react";
import Sidenav from "@/app/ui/sidenav/sidenav";
import Header from "../ui/header/header"; "../contexts/ThemeContext";
import './page.scss';
import { BoardProvider } from "../contexts/BoardContext";
import Modal from "../ui/modal/modal";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            <BoardProvider>
                <Header />
                <Sidenav />
                <section>
                    {children}
                </section>
                <Modal />
            </BoardProvider>
        </main>

    )
}

