import axios from 'axios';
import { Todo, CreateTodoInput } from '../types/todo.types';

const API_BASE_URL = 'http://localhost:3001/api';

export const todoApi = {
    getTodos: async (): Promise<Todo[]> => {
        const response = await axios.get(`${API_BASE_URL}/todos`);
        return response.data;
    },

    createTodo: async (todo: CreateTodoInput): Promise<Todo> => {
        const response = await axios.post(`${API_BASE_URL}/todos`, todo);
        return response.data;
    },

    markTodoAsDone: async (id: number): Promise<void> => {
        await axios.put(`${API_BASE_URL}/todos/${id}/done`);
    }
};