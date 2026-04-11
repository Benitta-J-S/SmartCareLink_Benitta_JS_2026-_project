import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';

// ⚠️ IMPORTANT: Change this to YOUR computer's IP address
const API_URL = 'http://192.168.137.1:5001/api';  // ← CHANGE THIS IP!

export default function App() {
  const [screen, setScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // Login function
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
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
        setUser(data.user);
        Alert.alert('Success', 'Login successful!');
        setScreen('dashboard');
      } else {
        Alert.alert('Error', data.error || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: email.split('@')[0],
          email, 
          password,
          phone: '1234567890'
        })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Account created! Please login.');
        setScreen('login');
        setEmail('');
        setPassword('');
      } else {
        Alert.alert('Error', data.error || 'Registration failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Panic button function
  const sendPanicAlert = async () => {
    setLoading(true);
    try {
      // First, try to get token (in real app, you'd save it after login)
      const loginResponse = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const loginData = await loginResponse.json();
      
      if (!loginResponse.ok) {
        Alert.alert('Error', 'Please login again');
        setScreen('login');
        return;
      }

      // Send panic alert
      const alertResponse = await fetch(`${API_URL}/alerts/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          type: 'panic',
          notes: 'User pressed panic button on mobile'
        })
      });

      if (alertResponse.ok) {
        Alert.alert('🚨 EMERGENCY!', 'Alert sent! Help is on the way!');
      } else {
        Alert.alert('Error', 'Failed to send alert');
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot connect to server');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN SCREEN
  if (screen === 'login') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>CareLink</Text>
        <Text style={styles.subtitle}>Patient Safety System</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        
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
        
        <TouchableOpacity onPress={() => setScreen('register')}>
          <Text style={styles.link}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // REGISTER SCREEN
  if (screen === 'register') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
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
        
        <TouchableOpacity onPress={() => {
          setScreen('login');
          setEmail('');
          setPassword('');
        }}>
          <Text style={styles.link}>Back to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // DASHBOARD SCREEN with PANIC BUTTON
  if (screen === 'dashboard') {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Safety Dashboard</Text>
        <Text style={styles.subtitle}>Welcome, {user?.name || email.split('@')[0]}!</Text>
        
        <TouchableOpacity 
          style={styles.panicButton}
          onPress={sendPanicAlert}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" size="large" />
          ) : (
            <>
              <Text style={styles.panicText}>🚨 PANIC BUTTON</Text>
              <Text style={styles.panicSubtext}>Press in emergency</Text>
            </>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => {
            setScreen('login');
            setEmail('');
            setPassword('');
            setUser(null);
          }}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// Need to add TextInput to imports at top
import { TextInput } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#007aff'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center'
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  button: {
    backgroundColor: '#007aff',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  },
  link: {
    color: '#007aff',
    marginTop: 20,
    fontSize: 14
  },
  panicButton: {
    backgroundColor: '#ff3b30',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3
  },
  panicText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold'
  },
  panicSubtext: {
    color: 'white',
    fontSize: 14,
    marginTop: 10
  },
  logoutButton: {
    backgroundColor: '#666',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center'
  },
  logoutText: {
    color: 'white',
    fontSize: 14
  }
});