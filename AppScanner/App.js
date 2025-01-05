import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ScanRFID = () => {
    const [rfidNumber, setRfidNumber] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchPetData = async () => {
        if (!rfidNumber) {
            setError('RFID number cannot be empty');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://192.168.1.9:5000/api/pets/rfid/${rfidNumber}`);  // ilisi lang og ip kailangan and I think kailangan giud ni haha
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }

            const result = await response.json();
            setData(result);
        } catch (err) {
            setError('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const refreshScan = () => {
        // Reset the input and the data state to allow another scan
        setRfidNumber('');
        setData(null);
        setError(null);
    };

    return (
        <View style={styles.container}>
          <Text style={styles.header}>Pet Information</Text>
            <TextInput
                style={styles.input}
                placeholder="Scan RFID tag"
                value={rfidNumber}
                onChangeText={setRfidNumber}
            />
            <TouchableOpacity style={styles.button} onPress={fetchPetData}>
                <Text style={styles.buttonText}>Fetch Pet Data</Text>
            </TouchableOpacity>
            
            {loading && <Text>Loading...</Text>}

            {error && <Text style={styles.error}>{error}</Text>}

            {data && (
                <View style={styles.dataContainer}>
                    <Text style={{ fontSize: 20 }}>Pet Name: {data.petName}</Text>
                    <Text style={{ fontSize: 20 }}>Owner: {data.ownerName}</Text>
                    <Text style={{ fontSize: 20 }}>Contact: {data.contact}</Text>
                    <Text style={{ fontSize: 20 }}>Address: {data.address}</Text>
                    <Text style={{ fontSize: 20 }}>Latest Vaccine: {data.vaccinationType}</Text>
                    <Text style={{ fontSize: 20 }}>Pet Type: {data.petType}</Text>
                    <Text style={{ fontSize: 20 }}>Breed: {data.breed1} / {data.breed2}</Text>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={refreshScan}>
                <Text style={styles.buttonText}>Scan Another</Text>
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
      fontSize: 40,
      marginBottom: 20
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
        fontSize: 30
    },
    error: {
        color: 'red',
    },
    buttonText: {
      color: 'white'
    },
    button: {
      borderRadius: 15,
      marginTop: 10,
      backgroundColor: 'green',
      padding: 15
    }
});

export default ScanRFID;
