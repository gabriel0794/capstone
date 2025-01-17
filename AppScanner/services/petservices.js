import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getPetData = async (rfid) => {
    try {
        const token = await AsyncStorage.getItem('authToken');  // Get the stored auth token

        // Ensure token is available
        if (!token) {
            throw new Error("No token provided");
        }

        const response = await axios.get(`http://192.168.1.3:5000/api/pet/rfid/${rfid}`, {
            headers: {
                Authorization: `Bearer ${token}`  // Send the token in the Authorization header
            }
        });

        console.log(response.data);  // Handle the response
    } catch (err) {
        console.error("Error:", err.message);
    }
};
