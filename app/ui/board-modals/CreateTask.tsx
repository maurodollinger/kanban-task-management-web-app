'use client';

import { SetStateAction, useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { jakarta } from "../fonts";
import { useBoardContext } from "@/app/contexts/BoardContext";

const randomSubtasks = [
    'Make coffee',
    'Drink coffee & smile',
    'Define user model',
    'Add auth endpoints',
    'Implement responsive design',
    'Write unit tests',
    'Optimize database queries',
    'Design user interface mockups',
];


export default function CreateTask() {
    const { currentColumns } = useBoardContext();

    const [columnInputs, setColumnInputs] = useState([{ name: getRandomColumnName() }]);
    const [selectedOption, setSelectedOption] = useState('');

    const handleSelectChange = (event: { target: { value: SetStateAction<string>; }; }) => {
        setSelectedOption(event.target.value);
    };

    const handleAddColumn = () => {
        setColumnInputs([...columnInputs, { name: getRandomColumnName() }]);
    };

    const handleRemoveColumn = (index: number) => {
        const updatedColumns = [...columnInputs];
        updatedColumns.splice(index, 1);
        setColumnInputs(updatedColumns);
    };

    function getRandomColumnName() {
        const randomIndex = Math.floor(Math.random() * randomSubtasks.length);
        return randomSubtasks[randomIndex];
    }

    return (
        <>
            <h1 className="heading-l">Add New Task</h1>
            <div className="inputs-container">
                <div className="input-group">
                    <label className="body-m">Title</label>
                    <input type="text" placeholder="e.g. Take coffee break"></input>
                </div>
                <div className="input-group">
                    <label className="body-m">Description</label>
                    <textarea className={jakarta.className} placeholder="e.g. It’s always good to take a break. This 15 minute break will 
recharge the batteries a little."></textarea>
                </div>
                <div className="input-group">
                    {columnInputs.length > 0 && <label className="body-m">Subtasks</label>}
                    <div className="inputs-new-container">
                        {columnInputs.map((input, index) => (
                            <div className="input-new" key={index}>
                                <input type="text" placeholder={`e.g. ${input.name}`} />
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
                <Button buttonType="primary-s" onClick={() => {/**/ }}>Create Task</Button>
            </div>
        </>
    )
}


