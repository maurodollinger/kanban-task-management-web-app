
import { v4 as uuidv4 } from 'uuid';

const randomColumnNames = [
    { placeholder: 'To Do' },
    { placeholder: 'Doing' },
    { placeholder: 'In Progress' },
    { placeholder: 'Complete' },
    { placeholder: 'Pending' },
    { placeholder: 'Backlog' },
    { placeholder: 'On Hold' },
    { placeholder: 'Done' }];

export function getRandomColumnName() {
    const randomIndex = Math.floor(Math.random() * randomColumnNames.length);
    return randomColumnNames[randomIndex];
}

export function getRandomUUID() {
    return uuidv4();
}