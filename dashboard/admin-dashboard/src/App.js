import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import {
    Container,
    AppBar,
    Toolbar,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    Box,
    Button,
    Alert
} from '@mui/material';

// Change this to your backend URL
const API_URL = 'http://127.0.0.1:5001';

function App() {
    const [alerts, setAlerts] = useState([]);
    const [connected, setConnected] = useState(false);
    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        console.log('🔌 Attempting to connect to:', API_URL);
        
        const newSocket = io(API_URL, {
            transports: ['websocket', 'polling'],
            timeout: 10000
        });
        
        newSocket.on('connect', () => {
            console.log('✅ Connected to server');
            setConnected(true);
            setConnectionError(null);
        });
        
        newSocket.on('connect_error', (error) => {
            console.log('❌ Connection error:', error.message);
            setConnected(false);
            setConnectionError(`Cannot connect to ${API_URL}. Make sure backend is running.`);
        });
        
        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from server');
            setConnected(false);
        });
        
        newSocket.on('new_alert', (alert) => {
            console.log('🚨 New alert received:', alert);
            setAlerts(prev => [alert, ...prev]);
        });
        
        return () => newSocket.disconnect();
    }, []);

    return (
        <>
            <AppBar position="static" color={connected ? "success" : "error"}>
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        CareLink Admin Dashboard
                    </Typography>
                    <Chip 
                        label={connected ? "● Connected" : "○ Disconnected"} 
                        color={connected ? "success" : "error"}
                    />
                </Toolbar>
            </AppBar>
            
            <Container style={{ marginTop: 20 }}>
                {connectionError && (
                    <Alert severity="error" style={{ marginBottom: 20 }}>
                        {connectionError}
                        <Button 
                            size="small" 
                            color="inherit" 
                            onClick={() => window.location.reload()}
                            style={{ marginLeft: 10 }}
                        >
                            Retry
                        </Button>
                    </Alert>
                )}
                
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Active Alerts
                                </Typography>
                                <Typography variant="h3">
                                    {alerts.filter(a => a.status === 'active').length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Typography color="textSecondary" gutterBottom>
                                    Total Alerts Today
                                </Typography>
                                <Typography variant="h3">
                                    {alerts.length}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    
                    <Grid item xs={12}>
                        <Paper style={{ padding: 20 }}>
                            <Typography variant="h5" gutterBottom>
                                Live Emergency Alerts
                            </Typography>
                            {alerts.length === 0 ? (
                                <Typography color="textSecondary" style={{ padding: 20, textAlign: 'center' }}>
                                    No active alerts. System is monitoring.
                                </Typography>
                            ) : (
                                <List>
                                    {alerts.map((alert, index) => (
                                        <ListItem 
                                            key={alert._id || index}
                                            style={{ 
                                                backgroundColor: '#ffebee',
                                                marginBottom: 10,
                                                borderRadius: 5,
                                                borderLeft: '4px solid red'
                                            }}
                                        >
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="subtitle1">
                                                        🚨 {alert.type || 'Emergency Alert'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="body2">
                                                        Patient: {alert.patientId?.name || 'Unknown'}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Typography variant="body2">
                                                        Time: {new Date(alert.timestamp || Date.now()).toLocaleTimeString()}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12} md={3}>
                                                    <Button 
                                                        variant="contained" 
                                                        color="primary"
                                                        size="small"
                                                    >
                                                        Acknowledge
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    ))}
                                </List>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
}

export default App;