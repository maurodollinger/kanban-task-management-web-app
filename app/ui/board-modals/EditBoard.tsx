'use client';

import { useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { useBoardContext } from "@/app/contexts/BoardContext";
import { Column } from "@/app/lib/definitions";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { MyInput } from "../myInput";
import { getRandomColumnName, getRandomUUID } from "@/app/lib/utils";
import { updateBoard } from "@/app/lib/actions";
import { useModal } from "@/app/contexts/ModalContext";


export default function EditBoard() {
    const { router } = useModal();
    const { currentBoard, currentColumns, updateBoards } = useBoardContext();
    const [columnInputs, setColumnInputs] = useState<Column[]>(currentColumns);

    const handleAddColumn = () => {
        if (columnInputs && columnInputs.length > 0) setColumnInputs([...columnInputs, { id: getRandomUUID(), name: '', placeholder: getRandomColumnName().placeholder }]);
        else setColumnInputs([{ id: getRandomUUID(), name: '', placeholder: getRandomColumnName().placeholder }]);
    };

    const handleRemoveColumn = (id: string) => {
        const updatedColumns = [...columnInputs];
        const filteredColumns = updatedColumns.filter(column => column.id !== id);
        setColumnInputs(filteredColumns);
    };


    /*  useEffect(() => {
          setColumnInputs(currentBoard.columns);
      }, [currentBoard]);*/

    return (
        currentBoard &&
        <>
            <h1 className="heading-l">Edit Board</h1>
            <Formik initialValues={{
                boardName: currentBoard.name,
                columnNames: columnInputs.map((column) => ({ name: column.name, id: column.id }))
            }}
                enableReinitialize={true}
                onSubmit={(values, { setSubmitting }) => {
                    const id = currentBoard.id;
                    const boardName = values.boardName;
                    const columns = values.columnNames;
                    updateBoard(id, boardName, columns).then(() => {
                        setSubmitting(false);
                        updateBoards();
                        router.push(`/dashboard/${currentBoard.slug}`);
                    })
                }}>
                {({ isSubmitting }) => (
                    <Form>
                        <div className="inputs-container">
                            <div className="input-group">
                                <label className="body-m">Board Name</label>
                                <Field name="boardName" placeholder="e.g. Web Design" component={MyInput} />
                                <ErrorMessage component="span" name="boardName" />
                            </div>
                            <div className="input-group">
                                {columnInputs && columnInputs.length > 0 && <label className="body-m">Board Columns</label>}
                                <div className="inputs-new-container">
                                    {columnInputs && columnInputs.map((input, index) => (
                                        <div className="input-new" key={input.id}>
                                            <Field name={`columnNames[${index}].name`} placeholder={`e.g. ${input.placeholder}`} component={MyInput} />
                                            <button onClick={() => handleRemoveColumn(input.id)}>
                                                <CrossIcon />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="buttons-container">
                            <Button buttonType="secondary" onClick={handleAddColumn}>+ Add New Column</Button>
                            <Button buttonType="primary-s" type="submit" disabled={isSubmitting}>Save Changes</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}


