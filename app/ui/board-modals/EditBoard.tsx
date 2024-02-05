'use client';

import { useEffect, useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { useBoardContext } from "@/app/contexts/BoardContext";
import { Column } from "@/app/lib/definitions";

const randomColumnNames = [
    { name: 'To Do' },
    { name: 'Doing' },
    { name: 'In Progress' },
    { name: 'Complete' },
    { name: 'Pending' },
    { name: 'Backlog' },
    { name: 'On Hold' },
    { name: 'Done' }];

function getRandomColumnName() {
    const randomIndex = Math.floor(Math.random() * randomColumnNames.length);
    return randomColumnNames[randomIndex].name;
}

export default function EditBoard() {
    const { currentBoard, currentColumns } = useBoardContext();
    const [columnInputs, setColumnInputs] = useState<Column[]>(currentColumns);

    const handleAddColumn = () => {
        if (columnInputs && columnInputs.length > 0) setColumnInputs([...columnInputs, { name: getRandomColumnName(), placeholder: true }]);
    };

    const handleRemoveColumn = (index: number) => {
        const updatedColumns = [...columnInputs];
        updatedColumns.splice(index, 1);
        setColumnInputs(updatedColumns);
    };

    /*  useEffect(() => {
          setColumnInputs(currentBoard.columns);
      }, [currentBoard]);*/

    return (
        <>
            <h1 className="heading-l">Edit Board</h1>
            <div className="inputs-container">
                <div className="input-group">
                    <label className="body-m">Board Name</label>
                    <input type="text" placeholder="e.g. Web Design" value={currentBoard.name}></input>
                </div>
                <div className="input-group">
                    {columnInputs && columnInputs.length > 0 && <label className="body-m">Board Columns</label>}
                    <div className="inputs-new-container">
                        {columnInputs && columnInputs.map((input, index) => (
                            <div className="input-new" key={index}>
                                {input.placeholder ? <input type="text" placeholder={`e.g. ${input.name}`} />
                                    : <input type="text" value={input.name} />
                                }
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
                <Button buttonType="primary-s" onClick={() => {/**/ }}>Save Changes</Button>
            </div>
        </>
    )
}


