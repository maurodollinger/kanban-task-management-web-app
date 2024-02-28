import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Board, Column, ColumnNamesByBoard, ColumnType, SubTaskData, TaskData, columnNames } from "./definitions";

/* BOARDS */
export async function fetchBoards(userId: string) {
    noStore();
    try {
        console.log('Fetching boards data');

        const data = await sql<Board>`SELECT name, slug, id FROM BOARDS WHERE user_id = ${userId}`;

        console.log('Data fetched completed');

        return data.rows;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to fecth Boards data');
    }
}

export async function addBoard(userId: string, name: string, slug: string) {
    try {
        console.log('Inserting data to boards');

        const result = await sql`INSERT INTO 
                                        boards(id,user_id,name,slug)
                                        VALUES(uuid_generate_v4(),${userId},${name},${slug})
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
                const associatedTasks = await sql`SELECT id FROM tasks WHERE column_id = ${column.id}`;

                if (associatedTasks.rows.length > 0) {
                    for (const task of associatedTasks.rows) {
                        await deleteTaskByID(task.id);
                    }
                }
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

export async function fetchColumnsNames(userId: string) {
    noStore();
    try {

        console.log('Fetching columns names');


        const data = await sql<ColumnNamesByBoard>`SELECT b.slug as board_slug, 
                                json_agg(json_build_object('name',c.name,'id',c.id,'position',c.position)) AS board_columns
                                FROM BOARDS b 
                                JOIN columns c ON c.board_id = b.id
                                WHERE b.user_id = ${userId}
                                GROUP BY b.slug;
                                `;

        console.log('Column names fetched complete');

        return data.rows;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to fetch columns data')
    }
}

export async function fetchColumnsData(userId: string, boardSlug: string) {
    noStore();
    try {
        console.log('Fetching columns data');

        const data = await sql<TaskData>`SELECT
                                c.id AS column_id,
                                c.name AS column_name,
                                c.position AS column_position,
                                t.title AS task_title,
                                t.id AS task_id,
                                t.position AS task_position,
                                (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id) AS subtasks_count,
                                (SELECT COUNT(*) FROM subtasks st WHERE st.task_id = t.id AND st.iscompleted = true) AS subtasks_completed
                            FROM
                                boards b
                            JOIN
                                columns c ON b.id = c.board_id
                            LEFT JOIN
                                tasks t ON c.id = t.column_id
                            WHERE
                                b.user_id = ${userId}
                            AND b.slug = ${boardSlug}
                            ORDER BY 
                                c.position, t.position;
                            `

        console.log('Columns data fetched complete');

        return data.rows;
    }
    catch (error) {
        console.error('Database error:', error);
        throw new Error('Failed to fecth Columns data');
    }
}

export async function addColumns(userId: string, board_id: string, columnNames: columnNames[]) {
    try {
        console.log('Inserting data to columns');

        for (const [index, column] of columnNames.entries()) {
            if (column.name !== '') {
                await sql`INSERT INTO columns(id, user_id, board_id, name, position)
                          VALUES(uuid_generate_v4(), ${userId}, ${board_id}, ${column.name}, ${index})`;
            }
        }

        console.log('Inserted complete');

        //return result.rows[0].board_id;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add columns');
    }
}

export async function updateTasksAcrossColumns(column: ColumnType) {
    noStore();
    try {
        console.log('Updating tasks across column');

        const existingTasks = await sql`
            SELECT id
            FROM tasks
            WHERE column_id = ${column.id}
        `;

        const updatedTasks = column.tasks;

        if (updatedTasks) {
            if (existingTasks.rows) {

            }
            else {

            }
            for (const task of updatedTasks) {
                const updatedTask = existingTasks.rows.find((t) => t.id === task.task_id)
                console.log(updatedTask);
                if (!updatedTask) {
                    //deleteTaskByID(task.task_id)
                }
            }
        }

    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update tasks on column');
    }
};

export async function updateTasksPositionsByColumn(column: ColumnType) {
    noStore();
    try {
        console.log('Updating tasks on column');

        const updatedTasks = column.tasks;

        if (updatedTasks) {
            for (const [index, task] of updatedTasks.entries()) {
                await sql`UPDATE tasks 
                            set position = ${index}
                            WHERE id = ${task.task_id};`
            }
        }

    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update tasks on column');
    }
};

export async function updateColumns(board_id: string, updatedColumns: Column[]) {
    noStore();
    try {
        console.log('Updating data in columns');

        // Obtener todas las columnas existentes para el board_id
        const existingColumns = await sql`
            SELECT id, name, position
            FROM columns
            WHERE board_id = ${board_id}
        `;

        // Comparar y actualizar las columnas
        for (const existingColumn of existingColumns.rows) {
            const updatedColumn = updatedColumns.find((c) => c.id === existingColumn.id);
            if (updatedColumn) {
                // Si la columna existe en ambas listas, actualizar
                await sql`
                    UPDATE columns
                    SET name = ${updatedColumn.name}, position = ${updatedColumn.position}
                    WHERE id = ${updatedColumn.id} AND board_id = ${board_id}
                `;
            } else {
                // Si la columna no existe en la lista actualizada, eliminar
                const existingTasks = await sql`SELECT id FROM tasks WHERE column_id = ${existingColumn.id}`;

                for (const existingTask of existingTasks.rows) {
                    await sql`DELETE FROM tasks WHERE id = ${existingTask.id}`;
                }

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
                    VALUES(uuid_generate_v4(), ${board_id}, ${updatedColumn.name}, ${updatedColumn.position})
                `;
            }
        }

        console.log('Update complete');
    } catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to update columns');
    }
}

/* TASKS */

export async function getColumnTasksByID(id: string) {
    noStore();
    try {
        console.log('Getting tasks by column_id');

        const tasks = await sql`SELECT position FROM tasks WHERE column_id = ${id}`;

        return tasks.rows;

    } catch (error) {
        console.log('Database error', error);
        throw new Error('Failed getting tasks by id');
    }
}

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

export async function addTask(userId: string, title: string, description: string, column_id: string, status: string, position: number) {
    noStore();
    try {
        console.log('Inserting data to tasks');


        const result = await sql`INSERT INTO 
                                        tasks(id,user_id,column_id,title,description,status,position)
                                        VALUES(uuid_generate_v4(),${userId},${column_id},${title},${description},${status},${position})
                                        RETURNING id AS task_id`;

        console.log('Inserted complete');

        return result.rows[0].task_id;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add tasks');
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

export async function getSubTasksByID(userId: string, task_id: string) {
    noStore();
    try {
        console.log('Fetching subtasks');


        const subtasks = await sql`SELECT * FROM 
            subtasks WHERE task_id = ${task_id} AND user_id = ${userId}`;

        console.log('Fetching complete', subtasks);
        return subtasks.rows;
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to Fetch taks');
    }
}

export async function addSubTasks(userId: string, task_id: string, subtasks: SubTaskData[]) {
    noStore();
    try {
        console.log('Inserting data to subtask', userId, task_id, subtasks);

        for (const subtask of subtasks) {
            await sql`INSERT INTO 
                   subtasks(id,user_id,task_id,title,iscompleted)
                   VALUES(uuid_generate_v4(),${userId},${task_id},${subtask.subtask_title},${subtask.subtask_iscompleted})`;
        }


        console.log('Inserted complete');
    }
    catch (error) {
        console.error('Database error: ', error);
        throw new Error('Failed to add tasks');
    }
}

export async function updateSubTasksByID(user_id: string, task_id: string, subtasks: SubTaskData[]) {
    noStore();
    try {
        console.log('Updating data of subtask');

        const existingSubtasks = await sql`
            SELECT id, title
            FROM subtasks
            WHERE task_id = ${task_id}
            AND user_id = ${user_id}
        `;

        for (const existingSubtask of existingSubtasks.rows) {
            const updatedSubtask = subtasks.find((c) => c.subtask_id === existingSubtask.id);

            if (updatedSubtask) {
                // Si la columna existe en ambas listas, actualizar
                await sql`
                    UPDATE subtasks
                    SET title = ${updatedSubtask.subtask_title}
                    WHERE id = ${updatedSubtask.subtask_id} AND task_id = ${task_id} AND user_id = ${user_id}
                `;
            } else {
                // Si la columna no existe en la lista actualizada, eliminar
                await sql`
                    DELETE FROM subtasks
                    WHERE id = ${existingSubtask.id} AND task_id = ${task_id} AND user_id = ${user_id}
                `;
            }
        }

        // Insertar nuevas columnas
        for (const updatedSubtask of subtasks) {
            if (!updatedSubtask.subtask_id) {
                await sql`INSERT INTO 
                subtasks(id,user_id,task_id,title,iscompleted)
                VALUES(uuid_generate_v4(),${user_id},${task_id},${updatedSubtask.subtask_title},false)`;
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