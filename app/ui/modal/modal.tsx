'use client';
import { usePathname, useSearchParams } from "next/navigation";
import Card from "../card";
import './modal.scss';
import Link from "next/link";
import CreateBoard from "../board-modals/CreateBoard";
import CreateTask from "../board-modals/CreateTask";
import EditTask from "../board-modals/EditTask";
import EditBoard from "../board-modals/EditBoard";
import ViewTask from "../board-modals/ViewTask";
import Delete from "../board-modals/Delete";

export default function Modal() {
    const searchParams = useSearchParams();
    const modal = searchParams.get("modal");
    const pathname = usePathname();
    const taskId = searchParams.get('task-id') || undefined;

    return (
        <>
            {modal && (
                <>
                    <Link href={pathname} onClick={(e) => e.stopPropagation()}>
                        <div className="modal-overlay" ></div>
                    </Link>
                    <Card className="modal">
                        {modal === 'create-board' && <CreateBoard />}
                        {modal === 'create-task' && <CreateTask />}
                        {modal === 'edit-task' && <EditTask taskId={taskId} />}
                        {modal === 'edit-board' && <EditBoard />}
                        {modal === 'view-task' && <ViewTask taskId={taskId} />}
                        {modal === 'delete' && <Delete taskId={taskId} />}
                    </Card>
                </>
            )}
        </>
    )
}