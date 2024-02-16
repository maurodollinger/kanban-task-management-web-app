/* eslint-disable @typescript-eslint/no-var-requires */
const { db } = require('@vercel/postgres');

const cleanOldData = async () => {
    const client = await db.connect();
    try {
        await client.query('DROP TABLE IF EXISTS subtasks');
        await client.query('DROP TABLE IF EXISTS tasks');
        await client.query('DROP TABLE IF EXISTS columns');
        await client.query('DROP TABLE IF EXISTS boards');
        await client.query('DROP TABLE IF EXISTS users');
    } catch (error) {
        console.error('Error cleaning old data:', error);
        throw error;
    }
};

// Llamada a la función antes de borrar los datos
cleanOldData()
    .then(() => console.log('Delete successful'))
    .catch((error) => console.error('Delete error:', error))
    .finally(() => db.end());
