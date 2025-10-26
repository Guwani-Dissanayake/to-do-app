import React, { useState } from 'react';
import { 
    Paper, 
    TextField, 
    Button, 
    Box, 
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { todoApi } from '../services/todo.service';

interface TodoFormProps {
    onTodoCreated: () => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onTodoCreated }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await todoApi.createTodo({ title, description });
            setTitle('');
            setDescription('');
            onTodoCreated();
            setSnackbar({
                open: true,
                message: 'Todo created successfully!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error creating todo:', error);
            setSnackbar({
                open: true,
                message: 'Failed to create todo. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                p: 3, 
                mb: 3, 
                backgroundColor: '#fff',
                borderRadius: 2,
                border: '1px solid #e1bee7',
                '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                        borderColor: '#7c4dff',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: '#5e35b1',
                    },
                },
            }}
        >
            <Typography 
                variant="h6" 
                gutterBottom 
                sx={{ 
                    color: '#4527a0', 
                    fontWeight: 'bold',
                    borderBottom: '2px solid #7c4dff',
                    pb: 1,
                    mb: 3
                }}
            >
                Create New Todo
            </Typography>
            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                        label="Todo Title"
                        variant="outlined"
                        fullWidth
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        disabled={loading}
                        sx={{ backgroundColor: 'white' }}
                    />
                    <TextField
                        label="Description (optional)"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        disabled={loading}
                        sx={{ backgroundColor: 'white' }}
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading}
                        startIcon={loading ? <CircularProgress size={20} /> : <AddTaskIcon />}
                        sx={{
                            mt: 1,
                            py: 1.5,
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#1565c0'
                            }
                        }}
                    >
                        {loading ? 'Creating...' : 'Add Todo'}
                    </Button>
                </Box>
            </form>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Paper>
    );
};