
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

const randomSubtasks = [
    { placeholder: 'Make coffee' },
    { placeholder: 'Drink coffee & smile' },
    { placeholder: 'Define user model' },
    { placeholder: 'Add auth endpoints' },
    { placeholder: 'Implement responsive design' },
    { placeholder: 'Write unit tests' },
    { placeholder: 'Optimize database queries' },
    { placeholder: 'Design user interface mockups' },
];

export function getRandomColumnName() {
    const randomIndex = Math.floor(Math.random() * randomColumnNames.length);
    return randomColumnNames[randomIndex];
}

export function getRandomSubtaskName() {
    const randomIndex = Math.floor(Math.random() * randomSubtasks.length);
    return randomSubtasks[randomIndex];
}

export function getRandomUUID() {
    return uuidv4();
}