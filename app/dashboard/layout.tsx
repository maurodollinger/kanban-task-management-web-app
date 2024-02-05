import React from "react";
import Sidenav from "@/app/ui/dashboard/sidenav/sidenav";
import Header from "../ui/dashboard/header/header";
import { ThemeProvider } from "../contexts/ThemeContext";
import { fetchBoards, fetchColumnsNames } from "../lib/data";
import './page.scss';
import Page from "./page";
import { BoardProvider } from "../contexts/BoardContext";
import Modal from "../ui/modal/modal";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const boards = await fetchBoards();
    const columnNames = await fetchColumnsNames();

    return (
        <main>
            <ThemeProvider>
                <BoardProvider initialBoards={boards} columnNames={columnNames}>
                    <Header />
                    <Sidenav />
                    <section>
                        <Page>
                            {children}
                        </Page>
                    </section>
                    <Modal />
                </BoardProvider>
            </ThemeProvider>
        </main>

    )
}

