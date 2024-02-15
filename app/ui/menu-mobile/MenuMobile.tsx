'use client';

import { useBoardContext } from "@/app/contexts/BoardContext";
import BoardLinks from "../sidenav/board-links";
import ColorModeSwitch from "../sidenav/color-mode-switch";

export async function MenuMobile() {
    const { boards } = useBoardContext();
    return (
        <div >
            <BoardLinks boards={boards} />
            <div>
                <ColorModeSwitch />
            </div>
        </div>
    )
}