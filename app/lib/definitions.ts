interface RootObject {
    boards: Board[];
}
interface Board {
    name: string;
    columns: Column[];
}
interface Column {
    name: string;
    tasks: (Task | Task)[];
}
interface Task {
    title: string;
    description: string;
    status: string;
    subtasks: Subtask[];
}
interface Subtask {
    title: string;
    isCompleted: boolean;
}

export type { RootObject, Board, Column, Task, Subtask};