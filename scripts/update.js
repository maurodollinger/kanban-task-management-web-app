/* eslint-disable @typescript-eslint/no-var-requires */
const { db, sql } = require('@vercel/postgres');
//const { boards } = require('../app/lib/placeholder-data');

/*
const addPositionColumnAndIndex = async (client) => {
    try {
        await client.sql`ALTER TABLE columns ADD COLUMN IF NOT EXISTS position INT`;

        await client.sql`CREATE INDEX IF NOT EXISTS idx_columns_position ON columns(position)`;

        console.log(`Added position column and index to "columns" table`);
    } catch (error) {
        console.error('Error adding position column and index:', error);
        throw error;
    }
}*/

// Insertar datos
const insertData = async (client) => {

    try {
        const boards = await client.query('SELECT * FROM BOARDS');
        for (const board of boards.rows) {
            //  console.log(board);
            //const boardIdResult = await client.query('INSERT INTO boards DEFAULT VALUES RETURNING id, columns');
            //const boardId = boardIdResult.rows[0].id;
            const columns = await sql`SELECT * FROM columns WHERE board_id = ${board.id}`
            //     console.log(columns.rows.entries());
            for (const [index, column] of columns.rows.entries()) {
                console.log(index, column);
                //    await client.query('INSERT INTO columns (board_id,name,position) VALUES ($1, $2, $3)', [column.board_id, column.name, index + 1]);
            }
            console.log('Update complete')
        }
    }
    catch (error) {
        console.log('Error seeding data', error);
    }
}



const updateDatabase = async () => {
    const client = await db.connect();

    //  await addPositionColumnAndIndex(client);
    await insertData(client);
    await client.end();
};

updateDatabase()
    .then(() => console.log('Update successful'))
    .catch((error) => console.error('Update error:', error))
    .finally(() => db.end());
