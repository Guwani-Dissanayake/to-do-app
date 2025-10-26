export interface DatabaseConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

export interface Task {
    id?: number;
    title: string;
    description?: string;
    completed: boolean;
    created_at?: Date;
}