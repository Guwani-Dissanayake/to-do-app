import type { Request, Response } from 'express';
import type { OkPacket } from 'mysql2';
import { dbConnection } from '../config/database.js';

// Get recent 5 todos
export const getTodos = async (req: Request, res: Response) => {
  const query = 'SELECT * FROM tasks WHERE completed = 0 ORDER BY created_at DESC LIMIT 5';
  
  dbConnection.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error fetching todos' });
    }
    res.json(results);
  });
};

// Create a new todo
export const createTodo = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const query = 'INSERT INTO tasks (title, description) VALUES (?, ?)';
  
  dbConnection.query(query, [title, description], (err, result: OkPacket) => {
    if (err) {
      return res.status(500).json({ error: 'Error creating todo' });
    }
    res.status(201).json({ id: result.insertId, title, description });
  });
};

// Mark todo as done
export const markTodoAsDone = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  const query = 'UPDATE tasks SET completed = 1 WHERE id = ?';
  
  dbConnection.query(query, [id], (err, result: OkPacket) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating todo' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo marked as done' });
  });
};