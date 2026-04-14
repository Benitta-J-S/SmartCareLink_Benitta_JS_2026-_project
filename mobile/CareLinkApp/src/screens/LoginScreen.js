import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this to your computer's IP address
const API_URL = 'http://192.168.137.1:5001/api';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                await AsyncStorage.setItem('token', data.token);
                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                Alert.alert('Success', 'Login successful!');
                navigation.replace('Dashboard');
            } else {
                if (response.status === 401) {
                    Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
                } else {
                    Alert.alert('Error', data.error || 'Login failed');
                }
            }
        } catch (error) {
            Alert.alert('Connection Error', 'Cannot connect to server. Make sure backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        Alert.alert(
            'Forgot Password?',
            'Contact your administrator to reset your password.\n\nOr register as a new user.',
            [
                { text: 'OK', style: 'cancel' },
                { text: 'Register', onPress: () => navigation.navigate('Register') }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>CareLink</Text>
            <Text style={styles.subtitle}>Patient Safety System</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    placeholderTextColor="#999"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.eyeIconText}>
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
                style={styles.forgotPasswordLink}
                onPress={handleForgotPassword}
            >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
                style={styles.button}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Login</Text>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.registerLink}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.linkText}>
                    Don't have an account? <Text style={styles.linkBold}>Register</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
        color: '#007aff'
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 40,
        color: '#666'
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 10
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16
    },
    eyeIcon: {
        padding: 15
    },
    eyeIconText: {
        fontSize: 20,
        color: '#666'
    },
    forgotPasswordLink: {
        alignSelf: 'flex-end',
        marginBottom: 20
    },
    forgotPasswordText: {
        color: '#007aff',
        fontSize: 14
    },
    button: {
        backgroundColor: '#007aff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600'
    },
    registerLink: {
        marginTop: 20,
        alignItems: 'center'
    },
    linkText: {
        color: '#666',
        fontSize: 14
    },
    linkBold: {
        color: '#007aff',
        fontWeight: '600'
    }
});