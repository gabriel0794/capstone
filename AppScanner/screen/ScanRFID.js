import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const ScanRFID = () => {
    const [rfidNumber, setRfidNumber] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [token, setToken] = useState(null);
    const [loadingToken, setLoadingToken] = useState(true);

    const navigation = useNavigation(); // For navigation

    // Load token from AsyncStorage when the component mounts
    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                } else {
                    console.warn('No token found. Using fallback token for testing.');
                    setToken('your_test_token_here');
                }
                console.log('Retrieved Token:', storedToken);
            } catch (err) {
                console.error('Error retrieving token:', err);
            } finally {
                setLoadingToken(false);
            }
        };
    
        loadToken();

        const checkStoredKeys = async () => {
            const keys = await AsyncStorage.getAllKeys();
            console.log('Keys in AsyncStorage:', keys);
        };
        checkStoredKeys();

        // Update current time every second
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    // Fetch pet data when rfidNumber or token changes
    useEffect(() => {
        if (!rfidNumber) {
            setData(null); // Reset data when RFID number is empty
            return;
        }

        const fetchPetData = async () => {
            if (rfidNumber.length !== 5 || isNaN(rfidNumber)) {
                setError('RFID is incorrect (should be 5 digits)');
                return;
            }

            if (!token) {
                setError('Token is missing');
                return;
            }

            setLoading(true);
            setError(null);

            console.log('Token sent:', token);

            try {
                const response = await fetch(`http://192.168.1.3:5000/api/pets/rfid/${rfidNumber}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                console.log('Request Headers:', {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                });
                console.log('Request URL:', `http://192.168.1.3:5000/api/pets/rfid/${rfidNumber}`);
                console.log('Response Status:', response.status);

                const result = await response.json();

                console.log('Response:', response);
                console.log('Response Data:', result);

                if (!response.ok) {
                    setError(`Failed to fetch data. Status: ${response.status}`);
                    return;
                }

                if (!result || !result.petName) {
                    setError('RFID number is not registered');
                    return;
                }

                setData(result);
            } catch (err) {
                console.log('Error fetching data:', err);
                setError('Error fetching data');
            } finally {
                setLoading(false);
            }
        };

        if (!loadingToken && rfidNumber) { 
            fetchPetData();
        }
    }, [rfidNumber, token, loadingToken]);

    const refreshScan = () => {
        setRfidNumber('');
        setData(null);
        setError(null);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('token'); // Remove token from AsyncStorage
        navigation.navigate('Login'); // Navigate to the login screen (replace 'Login' with your actual login screen name)
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Pet Information</Text>

            <Text style={styles.time}>
                {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Scan RFID tag"
                value={rfidNumber}
                onChangeText={setRfidNumber}
            />

            {loading && <Text>Loading...</Text>}
            {loadingToken && <Text>Loading token...</Text>}

            {error && <Text style={styles.error}>{error}</Text>}

            {data && (
                <View style={styles.dataContainer}>
                    <Text style={{ fontSize: 20 }}>Pet Name: {data.petName}</Text>
                    <Text style={{ fontSize: 20 }}>Owner: {data.ownerName}</Text>
                    <Text style={{ fontSize: 20 }}>Contact: {data.contact}</Text>
                    <Text style={{ fontSize: 20 }}>Address: {data.address}</Text>
                    <Text style={{ fontSize: 20 }}>Pet Type: {data.petType}</Text>
                    <Text style={{ fontSize: 20 }}>Breed: {data.breed1} / {data.breed2}</Text>
                    <Text style={{ fontSize: 20 }}>Scanned By: {data.personnelName || 'N/A'}</Text>

                    {data.vaccinationHistory && Array.isArray(data.vaccinationHistory) && data.vaccinationHistory.length > 0 ? (
                        <View style={styles.vaccinationHistory}>
                            <Text style={styles.historyHeader}>Vaccination History:</Text>
                            {data.vaccinationHistory
                                .sort((a, b) => new Date(b.date) - new Date(a.date))
                                .map((vaccination, index) => (
                                    <View key={index} style={styles.historyItem}>
                                        <Text style={{ fontSize: 18 }}>{`Date: ${new Date(vaccination.date).toLocaleDateString()} - Type: ${vaccination.vaccinationType}`}</Text>
                                    </View>
                                ))}
                        </View>
                    ) : (
                        <Text>No vaccination history available.</Text>
                    )}
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={refreshScan}>
                <Text style={styles.buttonText}>Scan Another</Text>
            </TouchableOpacity>
            
        </View>
    );
};

// Set the header options using the `options` prop in functional component
ScanRFID.navigationOptions = ({ navigation }) => ({
    headerLeft: () => (
        <TouchableOpacity onPress={() => logout()}>
            <Text style={{ marginLeft: 20, fontSize: 20, color: 'red', top: 2 }}>Logout</Text>
        </TouchableOpacity>
    ),
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginTop: -140
    },
    time: {
        fontSize: 20,
        marginBottom: 20,
        fontWeight: 'bold',
        color: 'black',
    },
    header: {
        fontSize: 40,
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
    dataContainer: {
        marginTop: 20,
        fontSize: 30,
    },
    error: {
        color: 'red',
    },
    vaccinationHistory: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        width: '100%',
    },
    historyHeader: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    historyItem: {
        marginBottom: 5,
    },
    button: {
        borderRadius: 15,
        marginTop: 10,
        backgroundColor: 'green',
        padding: 15,
    },
    buttonText: {
        color: 'white',
    },
});

export default ScanRFID;
