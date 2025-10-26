import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Grid } from '@mui/material';
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
    <div className="App" style={{ backgroundColor: '#f3e5f5', minHeight: '100vh', padding: '40px 20px' }}>
      <Container maxWidth="xl">
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              color: '#5e35b1',
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
              mb: 1
            }}
          >
            Todo App
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: '#4527a0',
              maxWidth: '600px',
              margin: '0 auto'
            }}
          >
            Manage your tasks efficiently and stay organized
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          <Box sx={{ width: { xs: '100%', md: '33.333%' } }}>
            <TodoForm onTodoCreated={fetchTodos} />
          </Box>
          <Box sx={{ width: { xs: '100%', md: '66.666%' } }}>
            <TodoList todos={todos} onTodoUpdated={fetchTodos} />
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default App;
