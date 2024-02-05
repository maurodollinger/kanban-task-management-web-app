'use client';

import { useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';

const randomColumnNames = ['To Do', 'Doing', 'In Progress', 'Complete', 'Pending', 'Backlog', 'On Hold', 'Done'];


export default function CreateBoard() {
    const [columnInputs, setColumnInputs] = useState([{ name: getRandomColumnName() }]);

    const handleAddColumn = () => {
        setColumnInputs([...columnInputs, { name: getRandomColumnName() }]);
    };

    const handleRemoveColumn = (index: number) => {
        const updatedColumns = [...columnInputs];
        updatedColumns.splice(index, 1);
        setColumnInputs(updatedColumns);
    };

    function getRandomColumnName() {
        const randomIndex = Math.floor(Math.random() * randomColumnNames.length);
        return randomColumnNames[randomIndex];
    }

    return (
        <>
            <h1 className="heading-l">Add New Board</h1>
            <div className="inputs-container">
                <div className="input-group">
                    <label className="body-m">Board Name</label>
                    <input type="text" placeholder="e.g. Web Design"></input>
                </div>
                <div className="input-group">
                    {columnInputs.length > 0 && <label className="body-m">Board Columns</label>}
                    <div className="inputs-new-container">
                        {columnInputs.map((input, index) => (
                            <div className="input-new" key={index}>
                                <input type="text" placeholder={`e.g. ${input.name}`} />
                                <button onClick={() => handleRemoveColumn(index)}>
                                    <CrossIcon />
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
            <div className="buttons-container">
                <Button buttonType="secondary" onClick={handleAddColumn}>+ Add New Column</Button>
                <Button buttonType="primary-s" onClick={() => {/**/ }}>Create New Board</Button>
            </div>
        </>
    )
}


