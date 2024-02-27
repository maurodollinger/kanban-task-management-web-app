/* eslint-disable @typescript-eslint/no-var-requires */
// seed.js
const { db } = require('@vercel/postgres');
const { boards } = require('../app/lib/placeholder-data');


// Crear table de usuario
const createUsersTable = async (client) => {
  try {

    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`CREATE TABLE IF NOT EXISTS users (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      username TEXT NOT NULL UNIQUE
    );`

    console.log('Created "users" table')
  }
  catch (error) {
    console.error('Error creating user table:', error);
    throw error;
  }
};



// Crear tabla boards
const createBoards = async (client) => {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await client.sql`
        CREATE TABLE IF NOT EXISTS boards (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID,
          name TEXT NOT NULL,
          slug TEXT NOT NULL,
          FOREIGN KEY (user_id) REFERENCES users (id)
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

    await client.sql`CREATE SEQUENCE IF NOT EXISTS columns_position_seq START 0;`;

    await client.sql`
      CREATE TABLE IF NOT EXISTS columns (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id UUID,
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
        user_id UUID,
        column_id UUID,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        position INT NOT NULL,
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
            user_id UUID,
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

// Crear usuario
const createUser = async (client, username) => {
  try {
    const userResult = await client.query('INSERT INTO users (username) VALUES ($1) RETURNING id', [username]);
    console.log('user created');
    return userResult.rows[0].id;
  } catch (error) {
    console.log('Error creating user', error)
  }
};

// Insertar datos
const insertData = async (client, userId) => {
  //console.log(boards);
  try {
    for (const board of boards) {
      const boardResult = await client.query('INSERT INTO boards (user_id, name, slug) VALUES ($1, $2, $3) RETURNING id', [userId, board.name, board.slug]);
      const boardId = boardResult.rows[0].id;

      let position = 0;
      for (const column of board.columns) {
        const columnResult = await client.query('INSERT INTO columns (user_id, board_id, name, position) VALUES ($1, $2, $3, $4 ) RETURNING id', [userId, boardId, column.name, position]);
        const columnId = columnResult.rows[0].id;

        let task_position = 0;
        for (const task of column.tasks) {
          const taskResult = await client.query('INSERT INTO tasks (user_id, column_id, title, description, status, position) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id', [userId, columnId, task.title, task.description, task.status, task_position]);
          const taskId = taskResult.rows[0].id;

          for (const subtask of task.subtasks) {
            await client.query('INSERT INTO subtasks (user_id, task_id, title, isCompleted) VALUES ($1, $2, $3, $4)', [userId, taskId, subtask.title, subtask.isCompleted]);
          }
          task_position++;
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

  /*
  await client.query('DELETE FROM subtasks');
  await client.query('DELETE FROM tasks');
  await client.query('DELETE FROM columns');
  await client.query('DELETE FROM board');
  await client.query('DELETE FROM users');*/

  await createUsersTable(client);
  await createBoards(client);
  await createColumns(client);
  await createTasks(client);
  await createSubtasks(client);

  const userUsername = 'user@kanban.com';
  const userId = await createUser(client, userUsername);
  console.log(userId);
  await insertData(client, userId);

  await client.end();
};

seedDatabase()
  .then(() => console.log('Seed successful'))
  .catch((error) => console.error('Seed error:', error))
  .finally(() => db.end());
