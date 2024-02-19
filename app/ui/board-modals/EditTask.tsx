'use client';

import { useEffect, useState } from "react";
import Button from "../custom-button/button";
import CrossIcon from '@/public/assets/icon-cross.svg';
import { jakarta } from "../fonts";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { TaskData } from "@/app/lib/definitions";
import { getTask, updateSubtasks, updateTask } from "@/app/lib/actions";
import { useModal } from "@/app/contexts/ModalContext";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { MyInput } from "../myInput";
import { getRandomSubtaskName } from "@/app/lib/utils";
import Card from "../card";


export default function EditTask() {
    const { taskId, router } = useModal();
    const [taskData, setTaskData] = useState<TaskData>();
    const [subtasksInputs, setSubtasksInputs] = useState<{ name: string, id: string, placeholder: string }[]>([{ name: '', id: '', placeholder: getRandomSubtaskName().placeholder }]);
    const [selectedOption, setSelectedOption] = useState<{ id: string, name: string }>({ id: '', name: '' });
    const { currentBoard, currentColumns, refreshData } = useBoardContext();


    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = e.target.value;
        const selectedId = e.target.options[e.target.selectedIndex].dataset.id;
        if (selectedId) {
            const selectedOption = { name: selectedValue, id: selectedId };
            setSelectedOption(selectedOption);
        }
    };


    useEffect(() => {
        if (taskId != undefined) {
            getTask(taskId).then((result) => {
                const _taskdata = result[0];
                setTaskData(_taskdata);
                const subtasks = _taskdata.subtasks_data;
                const column_id = _taskdata.task_column_id;
                if (_taskdata.task_status) setSelectedOption({ id: column_id, name: _taskdata.task_status })
                if (subtasks && subtasks.length > 0) {
                    const updatedSubtasks = [];
                    for (const st of subtasks) {
                        if (st.subtask_id) updatedSubtasks.push({ name: st.subtask_title, id: st.subtask_id, placeholder: getRandomSubtaskName().placeholder })
                    }
                    setSubtasksInputs(updatedSubtasks);
                }
            });
        }

    }, [taskId])

    const generateNewSubtask = () => {
        return { name: '', placeholder: getRandomSubtaskName().placeholder };
    }

    return (
        taskData &&
        <Card className="modal">
            <h1 className="heading-l">Edit Task</h1>
            <Formik
                initialValues={{
                    title: taskData.task_title,
                    description: taskData.task_description,
                    subtasksValues: subtasksInputs
                }}
                onSubmit={async (values, { setSubmitting }) => {
                    const title = values.title;
                    const description = values.description || '';
                    const status = selectedOption.name;
                    const id = taskId;
                    const column_id = selectedOption.id;
                    if (id) {
                        const taskValues = {
                            id,
                            title,
                            description,
                            column_id,
                            status
                        }
                        try {
                            await updateTask(taskValues);

                            const subtasks = values.subtasksValues.map((st) => {
                                const title = st.name;
                                const id = st.id;
                                return {
                                    subtask_id: id || '',
                                    subtask_title: title,
                                };
                            });

                            if (subtasks.length > 0) {
                                await updateSubtasks(taskId, subtasks);
                            }

                            refreshData();
                            if (currentBoard) {
                                router.push(`/dashboard/${currentBoard.slug}`);
                            }
                        } catch (error) {
                            console.error('Error updating task:', error);
                            // Manejar el error aquí si es necesario
                        } finally {
                            setSubmitting(false);
                        }
                    }
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
                                        {values.subtasksValues && values.subtasksValues.length > 0 && <label className="body-m">Subtasks</label>}
                                        <div className="inputs-new-container">
                                            {values.subtasksValues && values.subtasksValues.map((input, index) => (
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
                                        <select id="dropdown" value={selectedOption.name} onChange={handleSelectChange} className="dropdown-select">
                                            {currentColumns && currentColumns.map((option, index) => (
                                                <option key={index} value={option.name} data-id={option.id} className="dropdown-option">
                                                    {option.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="buttons-container">
                                    <Button buttonType="primary-s" type="submit" disabled={isSubmitting}>Save Changes</Button>
                                </div>
                            </Form>
                        )}
                    </FieldArray>
                )}
            </Formik>
        </Card>
    )
}


