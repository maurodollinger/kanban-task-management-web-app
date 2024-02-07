'use client';

import { useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { Field, Form, Formik, ErrorMessage } from 'formik';
import validationSchema from "@/app/lib/validations";
import { createBoard } from "@/app/lib/actions";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { useModal } from "@/app/contexts/ModalContext";
import { MyInput } from "../myInput";
import { getRandomColumnName, getRandomUUID } from "@/app/lib/utils";
import { Column } from "@/app/lib/definitions";


export default function CreateBoard() {
    const { router } = useModal();
    const { updateBoards } = useBoardContext();
    const [columnInputs, setColumnInputs] = useState<Column[]>([{ id: getRandomUUID(), name: '', placeholder: getRandomColumnName().placeholder }]);

    const handleAddColumn = () => {
        setColumnInputs([...columnInputs, { id: getRandomUUID(), name: '', placeholder: getRandomColumnName().placeholder }]);
    };

    const handleRemoveColumn = (id: string) => {
        const updatedColumns = [...columnInputs];
        const filteredColumns = updatedColumns.filter(column => column.id !== id);
        setColumnInputs(filteredColumns);
    };


    return (
        <>
            <h1 className="heading-l">Add New Board</h1>
            <Formik
                initialValues={{
                    boardName: '',
                    columnNames: columnInputs.map((column) => ({ name: column.name }))
                }}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                    const boardName = values.boardName;
                    const columns = values.columnNames;
                    createBoard(boardName, columns).then((response) => {
                        //console.log(response);
                        setSubmitting(false);
                        updateBoards();
                        router.push(`/dashboard/${response.slug}`);
                    })
                    //console.log(values);
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
                                {columnInputs.length > 0 && <label className="body-m">Board Columns</label>}
                                <div className="inputs-new-container">
                                    {columnInputs.map((input, index) => (
                                        <div className="input-new" key={input.id}>
                                            <Field name={`columnNames[${index}].name`} placeholder={`e.g. ${input.placeholder}`} component={MyInput} />
                                            <button onClick={() => handleRemoveColumn(input.id)}>
                                                <CrossIcon />
                                            </button>
                                            <ErrorMessage component="span" name={`columnNames[${index}].name`} />
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                        <div className="buttons-container">
                            <Button buttonType="secondary" onClick={handleAddColumn}>+ Add New Column</Button>
                            <Button buttonType="primary-s" type="submit" disabled={isSubmitting}>Create New Board</Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    )
}


