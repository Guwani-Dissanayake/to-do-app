import React from 'react';
import { Todo } from '../types/todo.types';
import { todoApi } from '../services/todo.service';

interface TodoListProps {
    todos: Todo[];
    onTodoUpdated: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onTodoUpdated }) => {
    const handleMarkDone = async (id: number) => {
        try {
            await todoApi.markTodoAsDone(id);
            onTodoUpdated();
        } catch (error) {
            console.error('Error marking todo as done:', error);
        }
    };

    return (
        <div>
            {todos.map((todo) => (
                <div 
                    key={todo.id}
                    style={{
                        border: '1px solid #ddd',
                        padding: '15px',
                        marginBottom: '10px',
                        borderRadius: '4px',
                        backgroundColor: 'white'
                    }}
                >
                    <h3 style={{ margin: '0 0 10px 0' }}>{todo.title}</h3>
                    {todo.description && (
                        <p style={{ margin: '0 0 10px 0' }}>{todo.description}</p>
                    )}
                    <button
                        onClick={() => todo.id && handleMarkDone(todo.id)}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#2196F3',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Done
                    </button>
                </div>
            ))}
        </div>
    );
};