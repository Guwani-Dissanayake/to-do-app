import React, { useState } from 'react';
import { 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    Typography,
    Box,
    Button,
    Divider,
    Fade,
    CircularProgress,
    Snackbar,
    Alert,
    Chip,
    Tooltip
} from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { Todo } from '../types/todo.types';
import { todoApi } from '../services/todo.service';

interface TodoListProps {
    todos: Todo[];
    onTodoUpdated: () => void;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, onTodoUpdated }) => {
    const [loading, setLoading] = useState<number | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleMarkDone = async (id: number) => {
        setLoading(id);
        try {
            await todoApi.markTodoAsDone(id);
            onTodoUpdated();
            setSnackbar({
                open: true,
                message: 'Todo marked as done!',
                severity: 'success'
            });
        } catch (error) {
            console.error('Error marking todo as done:', error);
            setSnackbar({
                open: true,
                message: 'Failed to mark todo as done. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(null);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <Paper 
            elevation={3} 
            sx={{ 
                backgroundColor: '#fff', 
                overflow: 'hidden',
                borderRadius: 2,
                border: '1px solid #e1bee7'
            }}
        >
            <Box sx={{ 
                p: 2, 
                background: 'linear-gradient(135deg, #5e35b1 0%, #7c4dff 50%, #9d6eff 100%)',
                borderBottom: '1px solid #4527a0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    Recent Todos
                </Typography>
                <Tooltip title="Total tasks">
                    <Chip 
                        label={`Total: ${todos.length}`}
                        sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.2)', 
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' },
                            backdropFilter: 'blur(4px)'
                        }}
                    />
                </Tooltip>
            </Box>
            <List sx={{ p: 0 }}>
                {todos.length === 0 ? (
                    <ListItem>
                        <ListItemText 
                            primary={
                                <Typography 
                                    variant="body1" 
                                    sx={{ textAlign: 'center', color: '#666', py: 3 }}
                                >
                                    No todos yet. Create one above!
                                </Typography>
                            }
                        />
                    </ListItem>
                ) : (
                    todos.map((todo, index) => (
                        <Fade in={true} key={todo.id} timeout={300} style={{ transitionDelay: `${index * 100}ms` }}>
                            <Box>
                                <ListItem
                                    sx={{
                                        backgroundColor: 'white',
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        '&:hover': {
                                            backgroundColor: '#f8f9fa',
                                            transform: 'translateX(5px)',
                                            boxShadow: '0 2px 8px rgba(94, 53, 177, 0.1)'
                                        },
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'stretch',
                                        padding: '16px 24px',
                                        gap: 2,
                                        borderRadius: 1
                                    }}
                                >
                                    <Box sx={{ width: '100%' }}>
                                        <Typography 
                                            variant="h6" 
                                            sx={{ 
                                                color: '#2c3e50', 
                                                mb: 1.5,
                                                fontSize: '1.1rem',
                                                fontWeight: 600,
                                                letterSpacing: '0.3px'
                                            }}
                                        >
                                            {todo.title}
                                        </Typography>
                                        {todo.description && (
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: '#666', 
                                                    mb: 2,
                                                    whiteSpace: 'pre-wrap',
                                                    backgroundColor: 'rgba(0,0,0,0.02)',
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    lineHeight: 1.6
                                                }}
                                            >
                                                {todo.description}
                                            </Typography>
                                        )}
                                        <Box sx={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'space-between',
                                            mt: 1,
                                            flexWrap: 'wrap',
                                            gap: 2
                                        }}>
                                            <Tooltip title="Creation time">
                                                <Chip
                                                    icon={<AccessTimeIcon sx={{ fontSize: '16px !important' }} />}
                                                    label={formatDate(todo.created_at || '')}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ 
                                                        borderColor: 'rgba(94, 53, 177, 0.2)',
                                                        '& .MuiChip-label': { 
                                                            fontSize: '0.75rem',
                                                            color: '#666'
                                                        },
                                                        '& .MuiChip-icon': {
                                                            color: '#5e35b1'
                                                        }
                                                    }}
                                                />
                                            </Tooltip>
                                            <Button
                                                variant="contained"
                                                onClick={() => todo.id && handleMarkDone(todo.id)}
                                                disabled={loading === todo.id}
                                                size="small"
                                                startIcon={loading === todo.id ? 
                                                    <CircularProgress size={16} color="inherit" /> : 
                                                    <DoneIcon />
                                                }
                                                sx={{
                                                    background: 'linear-gradient(45deg, #5e35b1 30%, #7c4dff 90%)',
                                                    color: 'white',
                                                    '&:hover': {
                                                        background: 'linear-gradient(45deg, #4527a0 30%, #5e35b1 90%)',
                                                        transform: 'translateY(-1px)'
                                                    },
                                                    minWidth: '100px',
                                                    borderRadius: '20px',
                                                    textTransform: 'none',
                                                    boxShadow: '0 3px 5px 2px rgba(124, 77, 255, .3)',
                                                    transition: 'all 0.3s ease-in-out',
                                                    height: '32px'
                                                }}
                                            >
                                                {loading === todo.id ? 'Marking...' : 'Done'}
                                            </Button>
                                        </Box>
                                    </Box>
                                </ListItem>
                                {index < todos.length - 1 && <Divider />}
                            </Box>
                        </Fade>
                    ))
                )}
            </List>
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