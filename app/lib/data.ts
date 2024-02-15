import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Board, Column, ColumnNamesByBoard, SubTaskData, TaskData, columnNames } from "./definitions";

/* BOARDS */
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

/* COLUMNS */

export async function fetchColumnsNames() {
    noStore();
    try {

        console.log('Fetching columns names');


        const data = await sql<ColumnNamesByBoard>`SELECT b.slug as board_slug, 
                                json_agg(json_build_object('name',c.name,'id',c.id,'position',c.position)) AS board_columns
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

export async function fetchColumnsData(boardSlug: string) {
    noStore();
    try {
        console.log('Fetching columns data');

        const data = await sql<TaskData>`SELECT
                                c.name AS column_name,
                                c.position AS column_position,
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

export async function addColumns(board_id: string, columnNames: columnNames[]) {
    try {
        console.log('Inserting data to columns');

        for (const [index, column] of columnNames.entries()) {
            await sql`INSERT INTO columns(id, board_id, name, position)
                      VALUES(uuid_generate_v4(), ${board_id}, ${column.name}, ${index})`;
        }

        console.log('Inserted complete');

        //return result.rows[0].board_id;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add columns');
    }
}

export async function updateColumns(board_id: string, updatedColumns: Column[]) {
    noStore();
    try {
        console.log('Updating data in columns');

        // Obtener todas las columnas existentes para el board_id
        const existingColumns = await sql`
            SELECT id, name
            FROM columns
            WHERE board_id = ${board_id}
        `;

        let position = 1;
        // Comparar y actualizar las columnas
        for (const existingColumn of existingColumns.rows) {
            const updatedColumn = updatedColumns.find((c) => c.id === existingColumn.id);
            if (updatedColumn) {
                // Si la columna existe en ambas listas, actualizar
                await sql`
                    UPDATE columns
                    SET name = ${updatedColumn.name}, position = ${position}
                    WHERE id = ${updatedColumn.id} AND board_id = ${board_id}
                `;
                position++;
            } else {
                // Si la columna no existe en la lista actualizada, eliminar
                await sql`
                    DELETE FROM columns
                    WHERE id = ${existingColumn.id} AND board_id = ${board_id}
                `;
            }
        }

        // Insertar nuevas columnas
        for (const updatedColumn of updatedColumns) {
            if (!updatedColumn.id) {
                await sql`
                    INSERT INTO columns(id, board_id, name, position)
                    VALUES(uuid_generate_v4(), ${board_id}, ${updatedColumn.name}, ${position})
                `;
                position++;
            }
        }

        console.log('Update complete');
    } catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update columns');
    }
}

/* TASKS */

export async function getTaskByID(id: string) {

    noStore();
    try {
        console.log('Fetching task by id');

        const data = await sql<TaskData>`
            SELECT 
                t.id as task_id,
                t.column_id as task_column_id,
                t.title as task_title,
                t.description as task_description,
                t.status as task_status,
            CASE
                WHEN COUNT(st.id) > 0 THEN
                    json_agg(
                        json_build_object(
                            'subtask_id', st.id,
                            'subtask_title', st.title,
                            'subtask_iscompleted', st.iscompleted,
                            'subtask_task_id', st.task_id
                        )
                    )
                ELSE
                    NULL
            END as subtasks_data
            FROM tasks t
            LEFT JOIN subtasks st ON st.task_id = t.id
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

export async function addTask(title: string, description: string, column_id: string, status: string) {
    try {
        console.log('Inserting data to tasks');

        const result = await sql`INSERT INTO 
                                        tasks(id,column_id,title,description,status)
                                        VALUES(uuid_generate_v4(),${column_id},${title},${description},${status})
                                        RETURNING id AS task_id`;

        console.log('Inserted complete');

        return result.rows[0].task_id;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add taks');
    }
}

export async function updateTaskById(id: string, title: string, description: string, column_id: string, status: string) {
    noStore();
    try {
        console.log('Updating tasks data');

        await sql`UPDATE tasks
                        SET title = ${title}, description = ${description}, column_id = ${column_id} , status = ${status}
                        WHERE id = ${id}`;

        console.log('Update completed');

    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add taks');
    }
}

export async function updateTaskStatusByID(id: string, column_id: string, status: string) {
    noStore();
    try {
        console.log('Updating task status', id, column_id, status);

        await sql`UPDATE tasks
            SET status = ${status}, column_id = ${column_id}
            WHERE id = ${id}
            `;

        console.log('Update completed');
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update task');
    }
}

export async function deleteTaskByID(id: string) {
    try {
        console.log('Deleting task by id');

        const associatedTasks = await sql`
            SELECT id
            FROM subtasks
            WHERE task_id = ${id}
        `;

        if (associatedTasks.rows.length > 0) {
            for (const subtask of associatedTasks.rows) {
                await sql`DELETE FROM subtasks WHERE id = ${subtask.id}`;
            }
        }

        await sql`DELETE FROM tasks WHERE id = ${id}`;

        console.log('Deletion complete');

        // return result;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to delete task');
    }
}

/* SUBTASKS */

export async function addSubTasks(task_id: string, subtasks: SubTaskData[]) {
    try {
        console.log('Inserting data to subtask');

        for (const subtask of subtasks) {
            await sql`INSERT INTO 
                subtasks(id,task_id,title,iscompleted)
                VALUES(uuid_generate_v4(),${task_id},${subtask.subtask_title},false)`;
        }


        console.log('Inserted complete');
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add taks');
    }
}

export async function updateSubTasksByID(task_id: string, subtasks: SubTaskData[]) {
    noStore();
    try {
        console.log('Updating data of subtask', subtasks);

        const existingSubtasks = await sql`
            SELECT id, title
            FROM subtasks
            WHERE task_id = ${task_id}
        `;

        for (const existingSubtask of existingSubtasks.rows) {
            const updatedSubtask = subtasks.find((c) => c.subtask_id === existingSubtask.id);

            if (updatedSubtask) {
                // Si la columna existe en ambas listas, actualizar
                await sql`
                    UPDATE subtasks
                    SET title = ${updatedSubtask.subtask_title}
                    WHERE id = ${updatedSubtask.subtask_id} AND task_id = ${task_id}
                `;
            } else {
                // Si la columna no existe en la lista actualizada, eliminar
                await sql`
                    DELETE FROM subtasks
                    WHERE id = ${existingSubtask.id} AND task_id = ${task_id}
                `;
            }
        }

        // Insertar nuevas columnas
        for (const updatedSubtask of subtasks) {
            if (!updatedSubtask.subtask_id) {
                await sql`INSERT INTO 
                subtasks(id,task_id,title,iscompleted)
                VALUES(uuid_generate_v4(),${task_id},${updatedSubtask.subtask_title},false)`;
            }
        }

        console.log('Update complete');
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update tasks');
    }
}


export async function updateSubtaskStatusByID(id: string, task_id: string, iscompleted: boolean) {
    noStore();
    try {
        console.log('Updating subtask status');

        await sql`UPDATE subtasks
            SET iscompleted = ${iscompleted}
            WHERE id = ${id} AND task_id = ${task_id}
            `;

        console.log('Update completed');
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update subtask');
    }
}