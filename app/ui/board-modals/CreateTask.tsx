'use client';

import { useEffect, useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { jakarta } from "../fonts";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { MyInput } from "../myInput";
import { getRandomSubtaskName } from "@/app/lib/utils";
import { useModal } from "@/app/contexts/ModalContext";
import Card from "../card";
import { useAuth } from "@/app/contexts/AuthContext";
import { createSubTasks, createTask, getTasksByColumn } from "@/app/lib/actions";

export default function CreateTask() {
    const { user } = useAuth();
    const { router, pathname } = useModal();
    const { currentColumns: statusColumns, refreshData } = useBoardContext();
    const [selectedOption, setSelectedOption] = useState<{ name: string, id: string }>(statusColumns[0]);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedId = e.target.options[e.target.selectedIndex].dataset.id;
        if (selectedId) {
            const selectedOption = { name: selectedValue, id: selectedId };
            setSelectedOption(selectedOption);
        }
    };


    const generateNewSubtask = () => {
        return { name: '', placeholder: getRandomSubtaskName().placeholder };
    }

    useEffect(() => {
        setSelectedOption(statusColumns[0])
    }, [])

    return (
        <Card className="modal">
            <h1 className="heading-l">Add New Task</h1>
            <Formik
                initialValues={{
                    title: '',
                    description: '',
                    subtasksValues: [generateNewSubtask()]
                }}
                onSubmit={(values) => {
                    const user_id = user.id;
                    const title = values.title;
                    const description = values.description;
                    const column_id = selectedOption.id;
                    const status = selectedOption.name;


                    const taskPromise = getTasksByColumn(column_id);

                    taskPromise
                        .then((tasks) => {
                            if (tasks.length > 0) return tasks[tasks.length - 1].position;
                            else return null;
                        })
                        .then((lastPosition) => {
                            const position = lastPosition === null ? 0 : +lastPosition + 1;
                            const taskValues = { user_id, title, description, column_id, status, position }

                            const taskId = createTask(taskValues);
                            return taskId;
                        })
                        .then((taskId) => {
                            if (taskId && values.subtasksValues.length > 0) {
                                const subtasksValues = values.subtasksValues
                                    .filter(st => st.name !== '')
                                    .map(st => ({ subtask_title: st.name, subtask_iscompleted: false }));

                                if (subtasksValues.length > 0) {
                                    return createSubTasks(user.id, taskId, subtasksValues);
                                }
                            }
                        })
                        .then(() => {
                            refreshData()
                            router.push(pathname);
                        })
                        .catch((error) => {
                            console.error('Error:', error);
                        });

                }}>
                {({ isSubmitting, values }) => (
                    <FieldArray name="subtasksValues">
                        {({ push, remove }) => (
                            <Form>
                                <div className="inputs-container">
                                    <div className="input-group">
                                        <label className="body-m">Title</label>
                                        <Field name="title" placeholder="e.g. Take coffee break" component={MyInput} />
                                        <ErrorMessage component="span" name="title" />
                                    </div>
                                    <div className="input-group">
                                        <label className="body-m">Description</label>
                                        <Field as="textarea" name='description' className={jakarta.className} placeholder="e.g. It’s always good to take a break. This 15 minute break will 
        recharge the batteries a little."></Field>
                                    </div>
                                    <div className="input-group">
                                        {values.subtasksValues.length > 0 && <label className="body-m">Subtasks</label>}
                                        <div className="inputs-new-container">
                                            {values.subtasksValues.map((input, index) => (
                                                <div className="input-new" key={index}>
                                                    <Field name={`subtasksValues[${index}].name`} placeholder={`e.g. ${input.placeholder}`} component={MyInput} />
                                                    <button type="button" onClick={() => remove(index)}>
                                                        <CrossIcon />
                                                    </button>
                                                </div>
                                            ))}
                                            <Button buttonType="secondary" onClick={() => push(generateNewSubtask())}>+ Add New Subtask</Button>
                                        </div>
                                    </div>
                                    <div className="input-group">
                                        <label className="body-m">Status</label>

                                        <Field as="select" name="status" id="dropdown" value={selectedOption.name} onChange={handleSelectChange} className="dropdown-select">
                                            {statusColumns && statusColumns.map((option, index) => (
                                                <option key={index} value={option.name} data-id={option.id} className="dropdown-option">
                                                    {option.name}
                                                </option>
                                            ))}
                                        </Field>
                                    </div>
                                </div>
                                <div className="buttons-container">
                                    <Button buttonType="primary-s" type="submit" disabled={isSubmitting}>Create Task</Button>
                                </div>
                            </Form>
                        )}
                    </FieldArray>
                )}
            </Formik>
        </Card>
    )
}


