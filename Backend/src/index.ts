import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { todoRoutes } from './routes/todo.routes.js';
import { dbConnection } from './config/database.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/todos', todoRoutes);

// Database connection
dbConnection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});