'use client';

import { createContext, useContext, useEffect, useState } from "react"
import { createSubTasks, createTask, deleteTask, getColumns, getSubTasks, updateTasksPositionsAcrossColumns, updateTasksPositionsSingleColumn } from "../lib/actions";
import { useAuth } from "./AuthContext";
import { useBoardContext } from "./BoardContext";
import { ColumnType, SubTaskData, TaskData } from "../lib/definitions";


interface ColumnsContextProps {
    columns: ColumnType[]
    isLoading: boolean;
    saveColumn: (column: ColumnType, across: boolean) => void;
    updateColumn: (column: ColumnType) => void;
    saveTask: (task: TaskData, column: ColumnType) => Promise<string>;
}

interface ColumnsProviderProps {
    children: React.ReactNode;
    boardSlug: string;
}

export const ColumnsContext = createContext<ColumnsContextProps | undefined>(undefined);

export const ColumnsProvider = ({ children, boardSlug }: ColumnsProviderProps) => {
    const { refresh } = useBoardContext();
    const { user } = useAuth();
    const [columns, setColumns] = useState<ColumnType[]>([])
    const [isLoading, setIsLoading] = useState(false);



    const saveTask = async (task: TaskData, column: ColumnType) => {
        const subtasks = await getSubTasks(user.id, task.task_id);
        const taskValues = {
            user_id: user.id,
            title: task.task_title,
            description: task.task_description || '',
            column_id: column.id,
            status: column.name,
            position: task.task_position,
        }
        const taskID = await createTask(taskValues)

        const copiedSubtasks: SubTaskData[] = [];
        subtasks.forEach((st) => {
            copiedSubtasks.push({
                subtask_task_id: taskID,
                subtask_title: st.title,
                subtask_iscompleted: st.iscompleted
            })
        })
        // console.log(copiedSubtasks);
        if (copiedSubtasks) await createSubTasks(user.id, taskID, copiedSubtasks);
        await deleteTask(task.task_id);
        return taskID;
    }

    const updateColumn = (column: ColumnType) => {
        const existingColumnIndex = columns.findIndex((col) => col.id === column.id);
        const newColumns = [...columns];
        newColumns[existingColumnIndex] = column;
        setColumns(newColumns);
    }

    const saveColumn = (column: ColumnType, across: boolean) => {
        if (across) updateTasksPositionsAcrossColumns(column);
        else updateTasksPositionsSingleColumn(column);
    }

    useEffect(() => {
        if (user.id && !isLoading) {
            setIsLoading(true);
            getColumns(user.id, boardSlug).then((results: ColumnType[]) => {
                console.log(results);
                if (results.length) {
                    setColumns([...results]);
                }
            }).finally(() => {
                setIsLoading(false);
            });
        }
    }, [user.id, boardSlug, refresh])


    return (
        <ColumnsContext.Provider value={{ columns, isLoading, updateColumn, saveColumn, saveTask }}>
            {children}
        </ColumnsContext.Provider>
    )
}

export const useColumns = () => {
    const context = useContext(ColumnsContext);
    if (!context) {
        throw new Error('useColumns must be used with ColumnsProvider');
    }
    return context;
}