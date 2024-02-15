'use server'
/* eslint-disable @typescript-eslint/no-var-requires */

import { VercelClient } from "@vercel/postgres";

// seed.js
const { db } = require('@vercel/postgres');
const { boards } = require('./placeholder-data');


// Insertar datos
const insertData = async (client: VercelClient) => {
    //console.log(boards);
    try {
        for (const board of boards) {
            const boardResult = await client.query('INSERT INTO boards (name, slug) VALUES ($1, $2) RETURNING id', [board.name, board.slug]);
            const boardId = boardResult.rows[0].id;

            let position = 1;
            for (const column of board.columns) {
                const columnResult = await client.query('INSERT INTO columns (board_id, name, position) VALUES ($1, $2, $3 ) RETURNING id', [boardId, column.name, position]);
                const columnId = columnResult.rows[0].id;

                for (const task of column.tasks) {
                    const taskResult = await client.query('INSERT INTO tasks (column_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING id', [columnId, task.title, task.description, task.status]);
                    const taskId = taskResult.rows[0].id;

                    for (const subtask of task.subtasks) {
                        await client.query('INSERT INTO subtasks (task_id, title, isCompleted) VALUES ($1, $2, $3)', [taskId, subtask.title, subtask.isCompleted]);
                    }
                }
                position++;
            }
        }
    }
    catch (error) {
        console.log('Error seeding data', error);
    }

};

export const Login = async () => {
    const client = await db.connect();

    await client.query('DELETE FROM subtasks');
    await client.query('DELETE FROM tasks');
    await client.query('DELETE FROM columns');
    await client.query('DELETE FROM boards');

    await insertData(client);

    await client.end();
};

