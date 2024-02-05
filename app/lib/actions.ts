'use server'

import { getTaskByID } from "./data";

export async function getTask(taskId: string) {
    const results = await getTaskByID(taskId);
    return results;
}
