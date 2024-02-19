'use client';

import { useBoardContext } from "@/app/contexts/BoardContext";
import BoardLinks from "../sidenav/board-links";
import ColorModeSwitch from "../sidenav/color-mode-switch";
import Card from "../card";

export default function MenuMobile() {
    const { boards } = useBoardContext();
    return (
        <Card className="modal menu">
            <BoardLinks boards={boards} />
            <div>
                <ColorModeSwitch />
            </div>
        </Card>
    )
}