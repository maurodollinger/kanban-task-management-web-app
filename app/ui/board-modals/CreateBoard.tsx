'use client';


import { createValidationSchema } from "@/app/lib/validations";
import { createBoard } from "@/app/lib/actions";
import { useBoardContext } from "@/app/contexts/BoardContext";
import { useModal } from "@/app/contexts/ModalContext";
import Card from "../card";
import { useAuth } from "@/app/contexts/AuthContext";
import { Formik } from "formik";
import { FieldArrayContainer, generateNewColumn } from "./draggable-helpers/FieldArrayContainer";


export default function CreateBoard() {
    const { router } = useModal();
    const { user } = useAuth();
    const { updateBoards, refreshData, boards } = useBoardContext();

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
                {() => (
                    <FieldArrayContainer type='create' />
                )}
            </Formik>
        </Card>
    )
}


