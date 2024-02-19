'use server'
/* eslint-disable @typescript-eslint/no-var-requires */

import { VercelClient } from "@vercel/postgres";
import { fetchBoards } from "./data";

// seed.js
const { db } = require('@vercel/postgres');
const { boards } = require('./placeholder-data-min');


// Insertar datos
const insertData = async (client: VercelClient, userId: string) => {
    //console.log(boards);
    try {
        for (const board of boards) {
            const boardResult = await client.query('INSERT INTO boards (user_id, name, slug) VALUES ($1, $2, $3) RETURNING id', [userId, board.name, board.slug]);
            const boardId = boardResult.rows[0].id;

            let position = 1;
            for (const column of board.columns) {
                const columnResult = await client.query('INSERT INTO columns (user_id, board_id, name, position) VALUES ($1, $2, $3, $4 ) RETURNING id', [userId, boardId, column.name, position]);
                const columnId = columnResult.rows[0].id;

                for (const task of column.tasks) {
                    const taskResult = await client.query('INSERT INTO tasks (user_id, column_id, title, description, status) VALUES ($1, $2, $3, $4, $5) RETURNING id', [userId, columnId, task.title, task.description, task.status]);
                    const taskId = taskResult.rows[0].id;

                    for (const subtask of task.subtasks) {
                        await client.query('INSERT INTO subtasks (user_id, task_id, title, isCompleted) VALUES ($1, $2, $3, $4)', [userId, taskId, subtask.title, subtask.isCompleted]);
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

const createUser = async (client: VercelClient, username: string) => {
    try {
        const userResult = await client.query('INSERT INTO users (username) VALUES ($1) RETURNING id', [username]);
        console.log('user created');
        return userResult.rows[0].id;
    } catch (error) {
        console.log('Error creating user', error)
    }
};

export const Login = async (userUsername: string) => {
    const client = await db.connect();

    const userId = await createUser(client, userUsername);
    await insertData(client, userId);
    const boards = await fetchBoards(userId);

    await client.end();

    return { userId, boards };
};

