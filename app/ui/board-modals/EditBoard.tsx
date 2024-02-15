'use client';

import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { useBoardContext } from "@/app/contexts/BoardContext";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { MyInput } from "../myInput";
import { getRandomColumnName } from "@/app/lib/utils";
import { updateBoard } from "@/app/lib/actions";
import { useModal } from "@/app/contexts/ModalContext";
import { createValidationSchema } from "@/app/lib/validations";


export default function EditBoard() {
    const { router } = useModal();
    const { currentBoard, currentColumns, updateBoards, boards } = useBoardContext();

    const boardNames = boards.map((b) => b.name);

    const generateNewColumn = () => {
        return { name: '', placeholder: getRandomColumnName().placeholder };
    }

    return (
        currentBoard &&
        <>
            <h1 className="heading-l">Edit Board</h1>
            <Formik initialValues={{
                boardName: currentBoard.name,
                columnNames: currentColumns
            }}
                validationSchema={createValidationSchema(boardNames)}
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
                {({ isSubmitting, values }) => (
                    <FieldArray name="columnNames">
                        {({ push, remove }) => (
                            <Form>
                                <div className="inputs-container">
                                    <div className="input-group">
                                        <label className="body-m">Board Name</label>
                                        <Field name="boardName" placeholder="e.g. Web Design" component={MyInput} />
                                        <ErrorMessage component="span" name="boardName" />
                                    </div>
                                    <div className="input-group">
                                        {values.columnNames && values.columnNames.length > 0 && <label className="body-m">Board Columns</label>}
                                        <div className="inputs-new-container">
                                            {values.columnNames && values.columnNames.map((input, index) => (
                                                <div className="input-new" key={index}>
                                                    <Field name={`columnNames[${index}].name`} placeholder={`e.g. ${input.placeholder}`} component={MyInput} />
                                                    <button type="button" onClick={() => remove(index)}>
                                                        <CrossIcon />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                                <div className="buttons-container">
                                    <Button buttonType="secondary" onClick={() => push(generateNewColumn())}>+ Add New Column</Button>
                                    <Button buttonType="primary-s" type="submit" disabled={isSubmitting}>Save Changes</Button>
                                </div>
                            </Form>
                        )}</FieldArray>
                )}
            </Formik>
        </>
    )
}


