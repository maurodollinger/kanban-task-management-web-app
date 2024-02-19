'use client';


import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { Field, Form, Formik, ErrorMessage, FieldArray } from 'formik';
import { createValidationSchema } from "@/app/lib/validations";
import { createBoard } from "@/app/lib/actions";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { useModal } from "@/app/contexts/ModalContext";
import { MyInput } from "../myInput";
import { getRandomColumnName } from "@/app/lib/utils";
import Card from "../card";
import { useAuth } from "@/app/contexts/AuthContext";


export default function CreateBoard() {
    const { router } = useModal();
    const { user } = useAuth();
    const { updateBoards, refreshData, boards } = useBoardContext();

    const generateNewColumn = () => {
        return { name: '', placeholder: getRandomColumnName().placeholder };
    }

    const boardNames = boards.map((b) => b.name);

    return (
        <Card className="modal">
            <h1 className="heading-l">Add New Board</h1>
            <Formik
                initialValues={{
                    boardName: '',
                    columnNames: [generateNewColumn()]
                }}
                validationSchema={createValidationSchema(boardNames)}
                onSubmit={(values, { setSubmitting }) => {
                    const boardName = values.boardName;
                    const columns = values.columnNames;
                    createBoard(user.id, boardName, columns).then((response) => {
                        setSubmitting(false);
                        updateBoards();
                        refreshData();
                        router.push(`/dashboard/${response.slug}`);
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
                                        {values.columnNames.length > 0 && <label className="body-m">Board Columns</label>}
                                        <div className="inputs-new-container">
                                            {values.columnNames.map((input, index) => (
                                                <div className="input-new" key={index}>
                                                    <Field name={`columnNames[${index}].name`}
                                                        placeholder={`e.g. ${input.placeholder}`}
                                                        component={MyInput} />
                                                    <button type="button" onClick={() => remove(index)}>
                                                        <CrossIcon />
                                                    </button>
                                                    <ErrorMessage component="span" name={`columnNames[${index}].name`} />
                                                </div>
                                            ))}
                                        </div>

                                    </div>
                                </div>
                                <div className="buttons-container">
                                    <Button buttonType="secondary" onClick={() => push(generateNewColumn())}>+ Add New Column</Button>
                                    <Button buttonType="primary-s" type="submit" disabled={isSubmitting}>Create New Board</Button>
                                </div>
                            </Form>
                        )}
                    </FieldArray>
                )}
            </Formik>
        </Card>
    )
}


