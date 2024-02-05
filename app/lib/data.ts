import { sql, db } from "@vercel/postgres";
//import { unstable_noStore as noStore } from "next/cache";
import { Board, ColumnNamesByBoard, TaskData } from "./definitions";

export async function fetchBoards() {
    //noStore();
    try {
        console.log('Fetching boards data');

        const data = await sql<Board>`SELECT name, slug FROM BOARDS`;

        console.log('Data fetched completed');

        return data.rows;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to fecth Boards data');
    }
}

export async function fetchColumnsNames() {
    // noStore();
    try {

        console.log('Fetching columns names');


        const data = await sql<ColumnNamesByBoard>`SELECT b.slug as board_slug, ARRAY_AGG(c.name) AS column_names
                                FROM BOARDS b 
                                JOIN columns c ON c.board_id = b.id
                                GROUP BY b.slug;
                                `;

        console.log('Column names fetched complete');

        return data.rows;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to fetch Tasks data')
    }
}

export async function fetchColumns(boardSlug: string) {
    //  noStore();
    try {
        console.log('Fetching columns data');

        const data = await sql<TaskData>`SELECT
                                c.name AS column_name,
                                t.title AS task_title,
                                t.id as task_id,
                                (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id) AS subtasks_count,
                                (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id AND st.iscompleted = true) AS subtasks_completed
                            FROM
                                boards b
                            JOIN
                                columns c ON b.id = c.board_id
                            LEFT JOIN
                                tasks t ON c.id = t.column_id
                            WHERE
                                b.slug = ${boardSlug};`

        console.log('Columns data fetched complete');

        return data.rows;
    }
    catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fecth Columns data');
    }
}

export async function addBoard() {
    try {

    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add board');
    }
}


export async function getTaskByID(id: string) {
    try {
        console.log('Fetching task by id');

        const data = await sql<TaskData>`SELECT t.id as task_id, t.title as task_title, t.description as task_description, t.status as task_status,
                                    json_agg(json_build_object('subtask_id', st.id, 'subtask_title', st.title, 'subtask_iscompleted', st.iscompleted, 'subtask_task_id', st.task_id)) as subtasks_data
                                FROM tasks t 
                                JOIN subtasks st ON st.task_id = t.id
                                WHERE t.id = ${id}
                                GROUP BY 
                                t.id, t.title, t.description, t.status;`

        console.log('Task fetched complete');
        return data.rows;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to get task');
    }
}
