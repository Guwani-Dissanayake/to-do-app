import { Router } from 'express';
import { createTodo, getTodos, markTodoAsDone } from '../controllers/todo.controller.js';

const router = Router();

// Get recent 5 todos
router.get('/', getTodos);

// Create a new todo
router.post('/', createTodo);

// Mark todo as done
router.put('/:id/done', markTodoAsDone);

export const todoRoutes = router;