import { useSearchParams } from "next/navigation";
import Button from "../custom-button/button";
import { useBoardContext } from "@/app/contexts/BoardContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteBoard, deleteTask, getTask } from "@/app/lib/actions";
import { useModal } from "@/app/contexts/ModalContext";
import Card from "../card";



export default function Delete() {
    const { pathname, router, taskId } = useModal();
    const { currentBoard, updateBoards, refreshData } = useBoardContext();
    const [disabled, setDisabled] = useState(false);
    const searchParams = useSearchParams()
    const type = searchParams.get('type');

    const [taskName, setTaskName] = useState('');

    const handleDelete = () => {
        if (type === 'board' && currentBoard) {
            setDisabled(true)
            deleteBoard(currentBoard?.id).then(() => {
                updateBoards()
                refreshData();
            }).finally(() => {
                router.push('/dashboard');
            })
        }
        if (taskId && type === 'task') {
            setDisabled(true);
            deleteTask(taskId).then(() => {
                refreshData();
            }).finally(() => {
                router.push(`/dashboard/${currentBoard?.slug}`);
            })
        }
    }

    useEffect(() => {
        if (taskId != undefined) {
            getTask(taskId).then((result) => {
                setTaskName(result[0].task_title);
            });
        }

    }, [taskId])

    return (
        <Card className="modal">
            <div className="delete-modal">
                <h1 className="heading-l">Delete this {type} ?</h1>
                <p className="body-l">
                    {type === 'board' && currentBoard && `Are you sure you want to delete the ‘${currentBoard.name}’ board? This action will remove all columns and tasks and cannot be reversed.`}
                    {type === 'task' && `Are you sure you want to delete the ‘${taskName}’ task and its subtasks? This action cannot be reversed.`}
                </p>
                <div>
                    <Button onClick={handleDelete} buttonType="destructive" disabled={disabled}>
                        Delete
                    </Button>
                    <Link href={pathname}><Button buttonType="secondary" disabled={disabled}>Cancel</Button></Link>
                </div>
            </div>
        </Card>
    )
}