'use server'

import { getTaskByID, deleteBoardByID, addBoard, fetchBoards, fetchColumnsNames, addColumns, updateBoardNameByID, updateColumns } from "./data";
import { Column, columnNames } from "./definitions";


export async function getBoards() {
    const boards = await fetchBoards();
    const columns = await fetchColumnsNames();
    return { boards: boards, columns: columns };
}

export async function getTask(taskId: string) {
    const results = await getTaskByID(taskId);
    return results;
}

export async function createBoard(boardName: string, columnNames: columnNames[]) {
    const slug = boardName.replace(/ /g, '-').toLowerCase();
    const board_id = await addBoard(boardName, slug);
    if (columnNames.length > 0) await createColumns(board_id, columnNames);
    return { slug };
}

export async function createColumns(board_id: string, columnNames: columnNames[]) {
    const results = await addColumns(board_id, columnNames);
    return results;
}

export async function deleteBoard(id: string) {
    const results = await deleteBoardByID(id);
    return results;
}

export async function updateBoard(boardId: string, boardName: string, columnNames: Column[]) {
    if (columnNames.length > 0) await updateColumns(boardId, columnNames);
    if (boardName) await updateBoardName(boardId, boardName);

}
export async function updateBoardName(boardId: string, boardName: string) {
    await updateBoardNameByID(boardId, boardName)
}