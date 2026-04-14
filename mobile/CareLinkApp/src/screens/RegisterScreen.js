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

const API_URL = 'http://192.168.137.1:5001/api';

export default function RegisterScreen({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }
        
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name, 
                    email, 
                    password,
                    phone: phone || 'Not provided'
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                Alert.alert(
                    'Success', 
                    'Account created successfully! Please login.',
                    [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
                );
            } else {
                Alert.alert('Registration Failed', data.error || 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Connection Error', 'Cannot connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            
            <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={name}
                onChangeText={setName}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Email *"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            
            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password * (min 6 characters)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Text style={styles.eyeIconText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
            </View>
            
            <TextInput
                style={styles.input}
                placeholder="Confirm Password *"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showPassword}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Phone Number (optional)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            
            <TouchableOpacity
                style={styles.button}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>Register</Text>
                )}
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.linkText}>
                    Already have an account? <Text style={styles.linkBold}>Login</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
        marginTop: 20,
        color: '#007aff'
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
        marginBottom: 15
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
    loginLink: {
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