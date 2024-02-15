'use server'

import { getTaskByID, deleteBoardByID, addBoard, fetchBoards, fetchColumnsNames, addColumns, updateBoardNameByID, updateColumns, addTask, updateSubtaskStatusByID, updateTaskStatusByID, addSubTasks, updateTaskById, updateSubTasksByID, deleteTaskByID } from "./data";
import { Column, SubTaskData, columnNames } from "./definitions";

/* BOARDS */

export async function getBoards() {
    const boards = await fetchBoards();
    const columns = await fetchColumnsNames();
    return { boards: boards, columns: columns };
}

export async function createBoard(boardName: string, columnNames: columnNames[]) {
    const slug = boardName.replace(/ /g, '-').toLowerCase();
    const board_id = await addBoard(boardName, slug);
    if (columnNames.length > 0) await createColumns(board_id, columnNames);
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

export async function createColumns(board_id: string, columnNames: columnNames[]) {
    const results = await addColumns(board_id, columnNames);
    return results;
}

/* TASKS */

export async function getTask(taskId: string) {
    const results = await getTaskByID(taskId);
    return results;
}

export async function createTask(taskValues: { title: string, description: string, column_id: string, status: string }) {
    const task_id = await addTask(taskValues.title, taskValues.description, taskValues.column_id, taskValues.status);
    return task_id;
}

export async function updateTask(taskValues: { id: string, title: string, description: string, column_id: string, status: string }) {
    await updateTaskById(taskValues.id, taskValues.title, taskValues.description, taskValues.column_id, taskValues.status);
}

export async function updateTaskStatus(id: string, column_id: string, status: string) {
    await updateTaskStatusByID(id, column_id, status);
}

export async function deleteTask(id: string) {
    await deleteTaskByID(id);
}

/* SUBTASKS */

export async function createSubTasks(task_id: string, subTaskValues: { subtask_title: string }[]) {
    await addSubTasks(task_id, subTaskValues);
}

export async function updateSubtasks(task_id: string, subtasks: SubTaskData[]) {
    await updateSubTasksByID(task_id, subtasks);
}

export async function updateSubtaskStatus(id: string, task_id: string, iscompleted: boolean) {
    await updateSubtaskStatusByID(id, task_id, iscompleted);
}