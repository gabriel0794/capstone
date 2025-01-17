import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, TextInput, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Login from './screen/loginpage.js'; // Import the Login component
import ScanRFID from './screen/ScanRFID.js'; // Import the ScanRFID component
import SignUp from './screen/signup.js';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen
                    name="ScanRFID"
                    component={ScanRFID}
                    options={({ navigation }) => ({
                        headerLeft: () => (
                            <TouchableOpacity onPress={() => {
                                // Handle logout action
                                AsyncStorage.removeItem('token');
                                navigation.navigate('Login');
                            }}>
                                <Text style={{ marginLeft: 20, fontSize: 14, color: 'black' }}>Logout</Text>
                            </TouchableOpacity>
                        ),
                        headerTitle: '',
                    })}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
