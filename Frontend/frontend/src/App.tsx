import React, { useEffect, useState } from 'react';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { Todo } from './types/todo.types';
import { todoApi } from './services/todo.service';
import './App.css';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const fetchTodos = async () => {
    try {
      const fetchedTodos = await todoApi.getTodos();
      setTodos(fetchedTodos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px' }}>
        <h1 style={{ marginBottom: '30px', color: '#333' }}>Todo App</h1>
        <TodoForm onTodoCreated={fetchTodos} />
        <TodoList todos={todos} onTodoUpdated={fetchTodos} />
      </div>
    </div>
  );
}

export default App;
