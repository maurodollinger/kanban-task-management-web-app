'use client';

import { SetStateAction, useEffect, useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { jakarta } from "../fonts";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { SubTaskData, TaskData } from "@/app/lib/definitions";
import { getTask } from "@/app/lib/actions";
import { useModal } from "@/app/contexts/ModalContext";

const randomSubtasks = [
    { subtask_title: 'Make coffee' },
    { subtask_title: 'Drink coffee & smile' },
    { subtask_title: 'Define user model' },
    { subtask_title: 'Add auth endpoints' },
    { subtask_title: 'Implement responsive design' },
    { subtask_title: 'Write unit tests' },
    { subtask_title: 'Optimize database queries' },
    { subtask_title: 'Design user interface mockups' },
];

function getRandomColumnName() {
    const randomIndex = Math.floor(Math.random() * randomSubtasks.length);
    return randomSubtasks[randomIndex].subtask_title;
}

export default function EditTask() {
    const { taskId } = useModal();
    const [taskData, setTaskData] = useState<TaskData>();
    const [columnInputs, setColumnInputs] = useState<SubTaskData[] | undefined>([]);
    const [selectedOption, setSelectedOption] = useState('');
    const { currentColumns } = useBoardContext();


    const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedOption(event.target.value);
    };

    const handleAddColumn = () => {
        if (columnInputs && columnInputs?.length > 0) setColumnInputs([...columnInputs, { subtask_title: getRandomColumnName() }]);
    };

    const handleRemoveColumn = (index: number) => {
        if (columnInputs && columnInputs?.length > 0) {
            const updatedColumns = [...columnInputs];
            updatedColumns.splice(index, 1);
            setColumnInputs(updatedColumns);
        }
    };

    useEffect(() => {
        if (taskId != undefined) {
            getTask(taskId).then((result) => {
                setTaskData(result[0]);
                const subtasks = result[0].subtasks_data;
                if (subtasks && subtasks.length > 0) {
                    setColumnInputs(subtasks);
                }
            });
        }

    }, [taskId])

    return (
        <>
            <h1 className="heading-l">Edit Task</h1>
            <div className="inputs-container">
                <div className="input-group">
                    <label className="body-m">Title</label>
                    <input type="text" placeholder="e.g. Take coffee break" value={taskData?.task_title}></input>
                </div>
                <div className="input-group">
                    <label className="body-m">Description</label>
                    <textarea className={jakarta.className} placeholder="e.g. It’s always good to take a break. This 15 minute break will 
recharge the batteries a little." value={taskData?.task_description}></textarea>
                </div>
                <div className="input-group">
                    {columnInputs && columnInputs.length > 0 && <label className="body-m">Subtasks</label>}
                    <div className="inputs-new-container">
                        {columnInputs && columnInputs.map((input, index) => (
                            <div className="input-new" key={index}>
                                {input.subtask_id ? <input type="text" value={`e.g. ${input.subtask_title}`} />
                                    : <input type="text" placeholder={`e.g. ${input.subtask_title}`} />
                                }
                                <button onClick={() => handleRemoveColumn(index)}>
                                    <CrossIcon />
                                </button>
                            </div>
                        ))}
                        <Button buttonType="secondary" onClick={handleAddColumn}>+ Add New Subtask</Button>
                    </div>
                </div>
                <div className="input-group">
                    <label className="body-m">Status</label>
                    <select id="dropdown" value={selectedOption} onChange={handleSelectChange} className="dropdown-select">
                        {currentColumns && currentColumns.map((option, index) => (
                            <option key={index} value={option.name} className="dropdown-option">
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="buttons-container">
                <Button buttonType="primary-s" onClick={() => {/**/ }}>Save Changes</Button>
            </div>
        </>
    )
}


