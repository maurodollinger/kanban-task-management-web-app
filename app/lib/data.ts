import { sql } from "@vercel/postgres";
import { unstable_noStore as noStore } from "next/cache";
import { Board, TaskData } from "./definitions";

export async function fetchBoards(){
    noStore();
    try{
        console.log('Fetching boards data');

        const data = await sql<Board>`SELECT name, slug FROM BOARDS`;

        console.log('Data fetched completed');

        return data.rows;
    }
    catch (error){
        console.error('Database error: ',error);
        throw new Error('Failed to fecth Boards data');
    }
}

export async function fetchColumns(boardSlug:string){
    noStore();
    try{
        console.log('Fetching columns data',boardSlug);

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
                            JOIN
                                tasks t ON c.id = t.column_id
                            WHERE
                                b.slug = ${boardSlug};`
       // const findId = await sql<BoardId>`SELECT id FROM BOARDS WHERE slug = ${boardSlug}`;
      //  const boardId = findId.rows[0]?.id;
     //   const data = await sql<Column>`SELECT id, name FROM COLUMNS WHERE board_id = ${boardId}`;

        console.log('Data fetched complete');
        
        return data.rows;
    }
    catch(error){
        console.error('Database error:', error);
        throw new Error('Failed to fecth Columns data');
    }
}