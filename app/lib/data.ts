import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Board, Column, ColumnNamesByBoard, TaskData, columnNames } from "./definitions";

export async function fetchBoards() {
    noStore();
    try {
        console.log('Fetching boards data');

        const data = await sql<Board>`SELECT name, slug, id FROM BOARDS`;

        console.log('Data fetched completed');

        return data.rows;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to fecth Boards data');
    }
}

export async function fetchColumnsNames() {
    noStore();
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
    noStore();
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

export async function addBoard(name: string, slug: string) {
    try {
        console.log('Inserting data to boards');

        const result = await sql`INSERT INTO 
                                        boards(id,name,slug)
                                        VALUES(uuid_generate_v4(),${name},${slug})
                                        RETURNING id AS board_id`;

        console.log('Inserted complete');

        return result.rows[0].board_id;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add board');
    }
}

export async function addColumns(board_id: string, columnNames: columnNames[]) {
    try {
        console.log('Inserting data to columns');

        for (const column of columnNames) {
            await sql`INSERT INTO columns(id, board_id, name)
                      VALUES(uuid_generate_v4(), ${board_id}, ${column.name})`;
        }

        console.log('Inserted complete');

        //return result.rows[0].board_id;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add columns');
    }
}

export async function deleteBoardByID(id: string) {
    try {
        console.log('Deleting board by id');

        const associatedColumns = await sql`
            SELECT id
            FROM columns
            WHERE board_id = ${id}
        `;

        if (associatedColumns.rows.length > 0) {
            for (const column of associatedColumns.rows) {
                await sql`DELETE FROM COLUMNS WHERE id = ${column.id}`;
            }
        }

        await sql`DELETE FROM BOARDS WHERE id = ${id}`;

        console.log('Deletion complete');

        // return result;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add board');
    }
}


export async function updateBoardNameByID(boardId: string, newName: string) {
    try {
        console.log('Updating board name');

        await sql`
            UPDATE BOARDS
            SET name = ${newName}
            WHERE id = ${boardId}
        `;

        console.log('Update complete');
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update board name');
    }
}

export async function updateColumns(board_id: string, updatedColumns: Column[]) {
    try {
        console.log('Updating data in columns', updatedColumns);

        for (const updatedColumn of updatedColumns) {
            await sql`
                UPDATE columns
                SET name = ${updatedColumn.name}
                WHERE id = ${updatedColumn.id} AND board_id = ${board_id}
            `;
        }

        console.log('Update complete');
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update columns');
    }
}