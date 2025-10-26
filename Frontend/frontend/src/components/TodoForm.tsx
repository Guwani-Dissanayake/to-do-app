import React, { useState } from 'react';
import { todoApi } from '../services/todo.service';

interface TodoFormProps {
    onTodoCreated: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onTodoCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await todoApi.createTodo({ title, description });
            setTitle('');
            setDescription('');
            onTodoCreated();
        } catch (error) {
            console.error('Error creating todo:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
                <input
                    type="text"
                    placeholder="Todo title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    style={{ padding: '8px', marginRight: '10px', width: '200px' }}
                />
            </div>
            <div style={{ marginBottom: '10px' }}>
                <textarea
                    placeholder="Todo description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ padding: '8px', marginRight: '10px', width: '200px', height: '80px' }}
                />
            </div>
            <button 
                type="submit"
                style={{
                    padding: '8px 16px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                Add Todo
            </button>
        </form>
    );
};