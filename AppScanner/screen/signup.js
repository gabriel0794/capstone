import React, { useState } from 'react';
import axios from 'axios';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const SignUp = ({ navigation }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = async () => {
        // Trim any extra spaces from input fields
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedContactNumber = contactNumber.trim();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();

        // Validate inputs
        if (!trimmedName || !trimmedEmail || !trimmedContactNumber || !trimmedPassword || !trimmedConfirmPassword) {
            setError('All fields are required');
            return;
        }

        // Password validation (e.g., check if password length is at least 6 characters)
        if (trimmedPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        // Check if the password and confirm password match
        if (trimmedPassword !== trimmedConfirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://192.168.1.3:5000/api/personnel/signup', {
                name: trimmedName,
                email: trimmedEmail,
                contactNumber: trimmedContactNumber,
                password: trimmedPassword,
            });

            // Check if the response is successful
            if (response.status === 201) {
                navigation.navigate('Login'); // Navigate to login after successful sign-up
            } else {
                setError('Error registering personnel. Please try again.');
            }
        } catch (err) {
            console.error(err);
            setError('Error registering personnel. Please try again.');
            Alert.alert('Sign Up Failed', 'Unable to connect to the server.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Personnel Sign Up</Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
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
    error: {
        color: 'red',
    },
    button: {
        borderRadius: 15,
        backgroundColor: 'green',
        padding: 15,
        width: '30%',
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
});

export default SignUp;
