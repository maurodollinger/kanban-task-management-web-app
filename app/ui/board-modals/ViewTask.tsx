'use client';

import { SetStateAction, useEffect, useState } from "react";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { SubTaskData, TaskData } from "@/app/lib/definitions";
import { getTask } from "@/app/lib/actions";
import Popup from "../popup/popup";
import Link from "next/link";
import Button from "../custom-button/button";
import Image from "next/image";


export default function ViewTask({ taskId }: { taskId: string | undefined }) {
    const [taskData, setTaskData] = useState<TaskData>();
    const [subtasks, setSubtasks] = useState<SubTaskData[] | undefined>([]);
    const [subtasksCompleted, setSubtasksCompleted] = useState(0);
    const [selectedOption, setSelectedOption] = useState('');
    const { currentColumns } = useBoardContext();
    const [popupVisible, setPopupVisible] = useState(false);

    const handlePopUpVisible = () => {
        setPopupVisible(prevState => !prevState);
    }

    const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedOption(event.target.value);
    };

    const handleSubtaskStatus = (id: string | undefined) => {
        if (subtasks) {
            const currentSubtask = subtasks?.find((st) => st.subtask_id === id);
            if (currentSubtask !== undefined) {
                const updatedValue = { ...currentSubtask, subtask_iscompleted: !currentSubtask.subtask_iscompleted };
                const updatedSubtasks = subtasks.map((st) => (st.subtask_id === id ? updatedValue : st));
                setSubtasks(updatedSubtasks);
            }

        }
    }

    useEffect(() => {
        if (taskId != undefined) {
            getTask(taskId).then((result) => {
                setTaskData(result[0]);
                const subtasks = result[0].subtasks_data;
                if (subtasks && subtasks.length > 0) {
                    setSubtasks(subtasks);
                    const completedSubtasks = subtasks.filter(subtask => subtask.subtask_iscompleted === true);
                    setSubtasksCompleted(completedSubtasks.length);
                }
            });
        }

    }, [taskId])

    return (
        <>
            <div className="title-modal">
                <h1 className="heading-l">{taskData?.task_title}</h1>
                <div className="actions">
                    <button onClick={handlePopUpVisible}>
                        <Image
                            src='/assets/icon-vertical-ellipsis.svg'
                            alt='icon edit'
                            width={5}
                            height={20}>

                        </Image>
                    </button>
                    <Popup visible={popupVisible}>
                        <Link href={`?modal=edit-task&task-id=${taskId}`}><Button buttonType='primary-s'>Edit Task</Button></Link>
                        <Link href={`?modal=delete&type=task&task-id=${taskId}`}><Button buttonType='destructive' onClick={handlePopUpVisible}>Delete Task</Button></Link>
                    </Popup>
                </div>
            </div>

            {taskData?.task_description &&
                <div className="description">
                    <p className="body-l">{taskData?.task_description}</p>
                </div>
            }
            <div className="inputs-container">
                <div className="input-group">
                    <label className="body-m">Subtasks {subtasks ? `(${subtasksCompleted} of ${subtasks?.length})` : ''}</label>
                    <ul className="subtasks-container">
                        {subtasks && subtasks.length > 0 &&
                            (
                                subtasks.map((st) => (
                                    <li key={st.subtask_id}
                                        className={st.subtask_iscompleted ? 'checked' : ''}
                                        onClick={() => handleSubtaskStatus(st.subtask_id)}>
                                        <span ></span>
                                        <p>{st.subtask_title}</p>
                                    </li>
                                ))
                            )
                        }
                    </ul>
                </div>
                <div className="input-group">
                    <label className="body-m">Current Status</label>
                    <select id="dropdown" value={selectedOption} onChange={handleSelectChange} className="dropdown-select">
                        {currentColumns && currentColumns.map((option, index) => (
                            <option key={index} value={option.name} className="dropdown-option">
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    )
}


