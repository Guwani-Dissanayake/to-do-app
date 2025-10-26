import { Router } from 'express';
import { createTodo, getTodos, markTodoAsDone } from '../controllers/todo.controller.js';

const router = Router();

// Get 
router.get('/', getTodos);

// Create 
router.post('/create', createTodo);

// update
router.put('/:id', markTodoAsDone);

export const todoRoutes = router;