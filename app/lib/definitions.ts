interface RootObject {
    boards: Board[];
}
interface Board {
    name: string;
    slug: string;
    id: string;
    columns: Column[];
}
interface Column {
    position: number;
    id: string;
    name: string;
    tasks?: (Task | Task)[];
    placeholder?: string;
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


// FOR API
interface TaskData {
    user_id: string;
    column_id: string;
    column_name: string;
    column_position: number;
    task_title: string;
    task_id: string;
    task_column_id: string;
    task_status?: string;
    task_description?: string;
    task_position: number;
    subtasks_count?: string;
    subtasks_completed?: string;
    subtasks_data?: SubTaskData[]
}

interface SubTaskData {
    subtask_task_id?: string;
    subtask_id?: string;
    subtask_title: string;
    subtask_iscompleted?: boolean;
}

interface ColumnNamesByBoard {
    board_slug: string;
    board_id: string;
    board_columns: { name: string, position: number, id: string };
}

type columnNames = {
    name: string
}

type ColumnType = {
    id: string;
    name: string;
    position: number;
    tasks: TaskData[] | null;
}


export type PageProps = {
    children: React.ReactNode;
    boards: Board[]
};

export type { RootObject, Board, Column, Task, Subtask, TaskData, SubTaskData, ColumnNamesByBoard, columnNames, ColumnType };