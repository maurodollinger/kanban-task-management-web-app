import React from "react";
import Sidenav from "@/app/ui/sidenav/sidenav";
import Header from "../ui/header/header"; "../contexts/ThemeContext";
import './page.scss';
import Modal from "../ui/modal/modal";

export default async function Layout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            <Header />
            <Sidenav />
            <section>
                {children}
            </section>
            <Modal />
        </main>

    )
}

