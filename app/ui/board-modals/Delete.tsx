import { usePathname, useSearchParams } from "next/navigation";
import Button from "../custom-button/button";
import { useBoardContext } from "@/app/contexts/BoardContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getTask } from "@/app/lib/actions";


export default function Delete({ taskId = undefined }: { taskId: string | undefined }) {
    const pathname = usePathname();
    const { currentBoard } = useBoardContext();
    const searchParams = useSearchParams()
    const type = searchParams.get('type');

    const [taskName, setTaskName] = useState('');

    useEffect(() => {
        if (taskId != undefined) {
            getTask(taskId).then((result) => {
                setTaskName(result[0].task_title);
            });
        }

    }, [taskId])

    return (
        <div className="delete-modal">
            <h1 className="heading-l">Delete this {type} ?</h1>
            <p className="body-l">
                {type === 'board' && `Are you sure you want to delete the ‘${currentBoard.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
                {type === 'task' && `Are you sure you want to delete the ‘${taskName}’ task and its subtasks? This action cannot be reversed.`}
            </p>
            <div>
                <Button buttonType="destructive">Delete</Button>
                <Link href={pathname}><Button buttonType="secondary">Cancel</Button></Link>
            </div>
        </div>
    )
}