import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.137.1:5001/api';

export default function DashboardScreen({ navigation }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    };

    const sendPanicAlert = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            
            if (!token) {
                Alert.alert('Error', 'Please login again');
                navigation.replace('Login');
                return;
            }

            const response = await fetch(`${API_URL}/alerts/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    type: 'panic',
                    notes: 'User pressed panic button on mobile'
                })
            });

            if (response.ok) {
                Alert.alert('🚨 EMERGENCY!', 'Alert sent! Help is on the way!');
            } else {
                if (response.status === 401) {
                    Alert.alert('Session Expired', 'Please login again');
                    navigation.replace('Login');
                } else {
                    Alert.alert('Error', 'Failed to send alert');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
        navigation.replace('Login');
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcome}>Welcome, {user?.name || 'Patient'}!</Text>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logout}>Logout</Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity
                style={styles.panicButton}
                onPress={sendPanicAlert}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" size="large" />
                ) : (
                    <>
                        <Text style={styles.panicButtonText}>🚨 PANIC BUTTON</Text>
                        <Text style={styles.panicSubtext}>Press in emergency</Text>
                    </>
                )}
            </TouchableOpacity>
            
            <View style={styles.statusCard}>
                <Text style={styles.statusTitle}>Safety Status</Text>
                <Text style={styles.statusActive}>✅ Monitoring Active</Text>
                <Text style={styles.statusText}>Your location is being tracked</Text>
                <Text style={styles.statusText}>Emergency contacts will be notified</Text>
            </View>
            
            <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>📋 Your Information</Text>
                <Text style={styles.infoText}>Email: {user?.email || 'Not set'}</Text>
                <Text style={styles.infoText}>Phone: {user?.phone || 'Not set'}</Text>
                <Text style={styles.infoText}>Role: {user?.role || 'Patient'}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1
    },
    welcome: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333'
    },
    logout: {
        color: '#ff3b30',
        fontSize: 16,
        fontWeight: '500'
    },
    panicButton: {
        backgroundColor: '#ff3b30',
        margin: 20,
        padding: 30,
        borderRadius: 20,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3
    },
    panicButtonText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold'
    },
    panicSubtext: {
        color: 'white',
        fontSize: 14,
        marginTop: 10
    },
    statusCard: {
        backgroundColor: 'white',
        margin: 20,
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1
    },
    statusTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333'
    },
    statusActive: {
        fontSize: 16,
        color: '#34c759',
        marginBottom: 5
    },
    statusText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    },
    infoCard: {
        backgroundColor: 'white',
        margin: 20,
        marginTop: 0,
        padding: 20,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333'
    },
    infoText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5
    }
});