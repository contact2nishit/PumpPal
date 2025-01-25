import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ViewPastWorkouts = ({ route, navigation }) => {
    const [workouts, setWorkouts] = useState({});
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchPastWorkouts = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const awaitedUrl = await AsyncStorage.getItem('backendUrl');
                const response = await fetch(`${awaitedUrl}/sets/fetch`, {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const res = await response.json();
                if (response.ok) {
                    setWorkouts(res);
                } else {
                    setErrors([res["error"]]);
                }
            } catch (err) {
                console.log(err);
                setErrors(["An error occurred while fetching past workouts."]);
            }
        };
        fetchPastWorkouts();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {Object.keys(workouts).map((timestamp) => (
                <View key={timestamp} style={styles.workoutSection}>
                    <Text style={styles.timestamp}>{timestamp}</Text>
                    {workouts[timestamp].exercises.map((exercise, index) => (
                        <View key={index} style={styles.exerciseSection}>
                            <Text style={styles.exerciseName}>{exercise}</Text>
                            {workouts[timestamp].reps[index].map((reps, setIndex) => (
                                <View key={setIndex} style={styles.setRow}>
                                    <Text>Set {setIndex + 1}:</Text>
                                    <Text>Reps: {reps}</Text>
                                    <Text>Weight: {workouts[timestamp].weights[index][setIndex]} lbs</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            ))}
            {errors.length > 0 && (
                <View>
                    {errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>{error}</Text>
                    ))}
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    workoutSection: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    timestamp: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    exerciseSection: {
        marginBottom: 10,
    },
    exerciseName: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    setRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    errorText: {
        color: 'red',
    },
});

export default ViewPastWorkouts;