'use server'

import { getTaskByID, deleteBoardByID, addBoard, fetchBoards, fetchColumnsNames, addColumns, updateBoardNameByID, updateColumns, addTask, updateSubtaskStatusByID, updateTaskStatusByID, addSubTasks, updateTaskById, updateSubTasksByID, deleteTaskByID, fetchColumnsData, updateTasksPositionsByColumn, updateTasksAcrossColumns, getColumnTasksByID, getSubTasksByID } from "./data";
import { Column, ColumnType, SubTaskData, columnNames } from "./definitions";

/* BOARDS */

export async function getBoards(userId: string) {
    const boards = await fetchBoards(userId);
    const columns = await fetchColumnsNames(userId);
    return { boards: boards, columns: columns };
}

export async function createBoard(userId: string, boardName: string, columnNames: columnNames[]) {
    const slug = boardName.replace(/ /g, '-').toLowerCase();
    const board_id = await addBoard(userId, boardName, slug);
    if (columnNames.length > 0) await createColumns(userId, board_id, columnNames);
    return { slug };
}

export async function deleteBoard(id: string) {
    const results = await deleteBoardByID(id);
    return results;
}

export async function updateBoard(boardId: string, boardName: string, columnNames: Column[]) {
    //if (columnNames.length > 0) 
    await updateColumns(boardId, columnNames);
    if (boardName) await updateBoardName(boardId, boardName);
}

export async function updateBoardName(boardId: string, boardName: string) {
    await updateBoardNameByID(boardId, boardName)
}

/* COLUMNS */


export async function getColumns(userId: string, boardSlug: string) {
    try {
        const columnsData = await getColumnsData(userId, boardSlug);
        const uniqueTypes = Array.from(new Set(columnsData.map(item => JSON.stringify({ item: item.column_name, id: item.column_id })))).map(jsonString => JSON.parse(jsonString));
        const columns: ColumnType[] = [];

        uniqueTypes.forEach(type => {
            const filteredTasks = columnsData.filter((col) => col.column_name === type.item)

            if (filteredTasks[0].task_title !== null) {
                columns.push({ id: type.id, name: type.item, position: filteredTasks[0].column_position, tasks: [...filteredTasks] });
            } else {
                columns.push({ id: type.id, name: type.item, position: filteredTasks[0].column_position, tasks: null });
            }
        });

        columns.sort((a, b) => a.position - b.position);

        return columns;
    }
    catch (error) {
        console.error('Error fetching columns:', error);
        return [];
    }
}


export async function getColumnsData(userId: string, boardSlug: string) {
    const columnsData = await fetchColumnsData(userId, boardSlug);
    return columnsData;
}

export async function createColumns(userId: string, board_id: string, columnNames: columnNames[]) {
    const results = await addColumns(userId, board_id, columnNames);
    return results;
}

/* TASKS */

export async function getTasksByColumn(id: string) {
    const tasks = await getColumnTasksByID(id);
    return tasks;
}

export async function getTask(taskId: string) {
    const results = await getTaskByID(taskId);
    return results;
}

export async function createTask(taskValues: { user_id: string, title: string, description: string, column_id: string, status: string, position: number }) {
    const task_id = await addTask(taskValues.user_id, taskValues.title, taskValues.description, taskValues.column_id, taskValues.status, taskValues.position);
    return task_id;
}

export async function updateTask(taskValues: { user_id: string, id: string, title: string, description: string, column_id: string, status: string }) {
    await updateTaskById(taskValues.id, taskValues.title, taskValues.description, taskValues.column_id, taskValues.status);
}

export async function updateTaskStatus(id: string, column_id: string, status: string) {
    await updateTaskStatusByID(id, column_id, status);
}

export async function deleteTask(id: string) {
    await deleteTaskByID(id);
}

export async function updateTasksPositionsAcrossColumns(column: ColumnType) {
    await updateTasksAcrossColumns(column)
}

export async function updateTasksPositionsSingleColumn(column: ColumnType) {
    await updateTasksPositionsByColumn(column)
}

/* SUBTASKS */

export async function getSubTasks(userId: string, task_id: string) {
    const subtasks = await getSubTasksByID(userId, task_id);
    return subtasks;
}

export async function createSubTasks(userId: string, task_id: string, subTaskValues: { subtask_title: string }[]) {
    await addSubTasks(userId, task_id, subTaskValues);
}

export async function updateSubtasks(user_id: string, task_id: string, subtasks: SubTaskData[]) {
    await updateSubTasksByID(user_id, task_id, subtasks);
}

export async function updateSubtaskStatus(id: string, task_id: string, iscompleted: boolean) {
    await updateSubtaskStatusByID(id, task_id, iscompleted);
}