interface RootObject {
    boards: Board[];
}
interface Board {
    name: string;
    slug: string;
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

interface TaskData{
    column_name: string;
    task_title: string;
    task_id: string;
    subtasks_count: string;
    subtasks_completed: string;
}

export type PageProps = {
    children:React.ReactNode;
    boards: Board[]
  };

export type { RootObject, Board, Column, Task, Subtask, TaskData};