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
    column_name: string;
    task_title: string;
    task_id: string;
    task_status?: string;
    task_description?: string;
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
    column_names: string[];
}

type columnNames = {
    name: string
}

export type PageProps = {
    children: React.ReactNode;
    boards: Board[]
};

export type { RootObject, Board, Column, Task, Subtask, TaskData, SubTaskData, ColumnNamesByBoard, columnNames };