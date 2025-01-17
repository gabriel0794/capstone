import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage'; // for storing JWT token

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        // Validate inputs
        if (!email || !password) {
            setError('Both fields are required');
            return;
        }

        // Make API request to backend for login
        try {
            const response = await axios.post('http://192.168.1.3:5000/api/personnel/login', {
                email,
                password,
            });

            // Log the entire response object
            console.log('Login Response:', response.data);  // Should show { token: 'your-jwt-token' }

            // If login is successful, store the JWT token and navigate to ScanRFID page
            if (response.status === 200) {
                const token = response.data.token; // Assuming the backend returns a token
                console.log('Received Token:', token);  // Log token
                await AsyncStorage.setItem('token', token); // Store token in AsyncStorage
                navigation.navigate('ScanRFID'); // Navigate to ScanRFID on success
            } else {
                setError('Invalid credentials');
                Alert.alert('Login Failed', 'Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            setError('Error logging in. Please try again.');
            Alert.alert('Login Failed', 'Unable to connect to server');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Welcome to PetVet</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('SignUp')}>
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        fontSize: 30,
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        width: '80%',
        paddingHorizontal: 10,
    },
    button: {
        borderRadius: 15,
        marginTop: 10,
        backgroundColor: 'green',
        padding: 15,
        width: '30%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
    error: {
        color: 'red',
    },
});

export default Login;
