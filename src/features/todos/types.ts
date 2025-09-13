export type TodoStatus = 'todo' | 'doing' | 'done';

export interface Todo {
    id: string;
    title: string;
    status: TodoStatus;
    createdAt?: string;
}
