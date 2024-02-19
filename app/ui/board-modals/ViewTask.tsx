'use client';

import { useEffect, useState } from "react";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { SubTaskData, TaskData } from "@/app/lib/definitions";
import { getTask, updateSubtaskStatus, updateTaskStatus } from "@/app/lib/actions";
import Popup from "../popup/popup";
import Link from "next/link";
import Button from "../custom-button/button";
import Image from "next/image";
import { useModal } from "@/app/contexts/ModalContext";
import Card from "../card";


export default function ViewTask() {
    const { taskId, router } = useModal();
    const [taskData, setTaskData] = useState<TaskData>();
    const [subtasks, setSubtasks] = useState<SubTaskData[] | undefined>([]);
    const [subtasksCompleted, setSubtasksCompleted] = useState(0);
    const [selectedOption, setSelectedOption] = useState<{ id: string, name: string }>({ id: '', name: '' });
    const { currentColumns, currentBoard, refreshData } = useBoardContext();
    const [popupVisible, setPopupVisible] = useState(false);
    const [columnChanged, setColumnChanged] = useState(false);

    const handlePopUpVisible = () => {
        setPopupVisible(prevState => !prevState);
    }


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedId = e.target.options[e.target.selectedIndex].dataset.id;
        if (selectedId) {
            const selectedOption = { name: selectedValue, id: selectedId };
            setSelectedOption(selectedOption);
            setColumnChanged(true);
        }
    };

    const handleSubtaskStatus = (id: string | undefined) => {
        if (subtasks) {
            const currentSubtask = subtasks?.find((st) => st.subtask_id === id);
            if (currentSubtask !== undefined) {
                const _id = currentSubtask.subtask_id;
                const task_id = currentSubtask.subtask_task_id;
                const iscompleted = !currentSubtask.subtask_iscompleted;
                if (_id && task_id) {
                    updateSubtaskStatus(_id, task_id, iscompleted).then(() => {
                        const updatedValue = { ...currentSubtask, subtask_iscompleted: !currentSubtask.subtask_iscompleted };
                        const updatedSubtasks = subtasks.map((st) => (st.subtask_id === id ? updatedValue : st));
                        setSubtasks(updatedSubtasks);
                        refreshData();
                    });
                }

            }

        }
    }

    useEffect(() => {
        if (taskId != undefined) {
            getTask(taskId).then((result) => {
                setTaskData(result[0]);
                const _taskdata = result[0];
                const subtasks = _taskdata.subtasks_data;
                const column_id = _taskdata.task_column_id;
                if (_taskdata.task_status) setSelectedOption({ id: column_id, name: _taskdata.task_status })
                if (subtasks && subtasks.length > 0) {
                    setSubtasks(subtasks);
                    const completedSubtasks = subtasks.filter(subtask => subtask.subtask_iscompleted === true);
                    setSubtasksCompleted(completedSubtasks.length);
                }
            });
        }

    }, [taskId])

    useEffect(() => {
        if (columnChanged) {
            const newValue = selectedOption.name;
            const column_id = selectedOption.id;
            if (newValue && taskId && column_id) {
                updateTaskStatus(taskId, column_id, newValue).then(() => {
                    refreshData();
                }).finally(() => {
                    setColumnChanged(false);
                    if (currentBoard) router.push(`/dashboard/${currentBoard.slug}`);
                })
            }
        }
    }, [selectedOption, columnChanged])

    return (
        taskData &&
        <Card className="modal">
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
                {subtasks && subtasks.length > 0 &&
                    (
                        <div className="input-group">
                            <label className="body-m">Subtasks {subtasks ? `(${subtasksCompleted} of ${subtasks?.length})` : ''}</label>
                            <ul className="subtasks-container">

                                {subtasks.map((st) => (
                                    <li key={st.subtask_id}
                                        className={st.subtask_iscompleted ? 'checked' : ''}
                                        onClick={() => handleSubtaskStatus(st.subtask_id)}>
                                        <span ></span>
                                        <p>{st.subtask_title}</p>
                                    </li>
                                ))
                                }
                            </ul>
                        </div>
                    )
                }
                <div className="input-group">
                    <label className="body-m">Current Status</label>
                    <select id="dropdown" value={selectedOption.name} onChange={handleSelectChange} className="dropdown-select">
                        {currentColumns && currentColumns.map((option, index) => (
                            <option key={index} value={option.name} data-id={option.id} className="dropdown-option">
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </Card>
    )
}


