'use client';


import { useBoardContext } from "@/app/contexts/BoardContext";
import { Formik } from "formik";
import { updateBoard } from "@/app/lib/actions";
import { useModal } from "@/app/contexts/ModalContext";
import { createValidationSchema } from "@/app/lib/validations";
import Card from "../card";
import { useEffect } from "react";
import { FieldArrayContainer } from "./draggable-helpers/FieldArrayContainer";


export default function EditBoard() {
    const { refreshData } = useBoardContext();
    const { router } = useModal();
    const { currentBoard, currentColumns, boards, updateBoards } = useBoardContext();
    let boardNames = [''];

    useEffect(() => {
        boardNames = boards.map((b) => {
            if (currentBoard && b.name !== currentBoard.name) {
                return b.name;
            }
            return '';
        });
    }, [currentBoard, boards, currentColumns])


    return (
        currentBoard &&
        <Card className="modal">
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
                        refreshData();
                        router.push(`/dashboard/${currentBoard.slug}`);
                    })
                }}>
                <FieldArrayContainer type="edit" />
            </Formik>
        </Card >
    )
}


