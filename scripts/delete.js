/* eslint-disable @typescript-eslint/no-var-requires */
const { db } = require('@vercel/postgres');

const cleanOldData = async () => {
    const client = await db.connect();
    try {
        await client.query('DELETE FROM subtasks');
        await client.query('DELETE FROM tasks');
        await client.query('DELETE FROM columns');
        await client.query('DELETE FROM boards');
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
