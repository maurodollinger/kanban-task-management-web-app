/* eslint-disable @typescript-eslint/no-var-requires */
// seed.js
const { db } = require('@vercel/postgres');
const { boards } = require('../app/lib/placeholder-data');

// Crear tablas
const createTables = async (client) => {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
        CREATE TABLE IF NOT EXISTS boards (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          slug TEXT NOT NULL
        )
      `;

    console.log(`Created "boards" table`);

  }
  catch (error) {
    console.error('Error creating table:', error);
    throw error;
  }
};

// crear columnas
const createColumns = async (client) => {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`CREATE SEQUENCE IF NOT EXISTS columns_position_seq START 1;`;

    await client.sql`
      CREATE TABLE IF NOT EXISTS columns (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        board_id UUID,
        name TEXT NOT NULL,
        position INT DEFAULT nextval('columns_position_seq'),
        FOREIGN KEY (board_id) REFERENCES boards (id)
      )
    `;


    console.log(`Created "columns" table`);

  }
  catch (error) {
    console.error('Error creating columns:', error);
    throw error;
  }

}

// crear tasks
const createTasks = async (client) => {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
        CREATE TABLE IF NOT EXISTS tasks (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        column_id UUID,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        FOREIGN KEY (column_id) REFERENCES columns (id)
        )
    `;

    console.log(`Created "tasks" table`);

  }
  catch (error) {
    console.error('Error creating tasks:', error);
    throw error;
  }
};

const createSubtasks = async (client) => {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
            CREATE TABLE IF NOT EXISTS subtasks (
            id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
            task_id UUID,
            title TEXT NOT NULL,
            isCompleted BOOLEAN NOT NULL,
            FOREIGN KEY (task_id) REFERENCES tasks (id)
            )
        `;

    console.log(`Created "subtasks" table`);

  }
  catch (error) {
    console.error('Error creating subtasks:', error);
    throw error;
  }
};


// Insertar datos
const insertData = async (client) => {
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

const seedDatabase = async () => {
  const client = await db.connect();

  /*await client.query('DELETE FROM subtasks');
  await client.query('DELETE FROM tasks');
  await client.query('DELETE FROM columns');
  await client.query('DELETE FROM boards');
*/
  await createTables(client);
  await createColumns(client);
  await createTasks(client);
  await createSubtasks(client);
  await insertData(client);

  await client.end();
};

seedDatabase()
  .then(() => console.log('Seed successful'))
  .catch((error) => console.error('Seed error:', error))
  .finally(() => db.end());
