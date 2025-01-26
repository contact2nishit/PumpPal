import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CreateWorkoutTemplate = ({ navigation }) => {
    const [workoutName, setWorkoutName] = useState('');
    const [numExercise, setNumExercise] = useState(0);
    const [exerciseData, setExerciseData] = useState([]);
    const [errors, setErrors] = useState([]);
    const [exerciseList, setExerciseList] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedExerciseIndex, setSelectedExerciseIndex] = useState(null);

    useEffect(() => {
        const fetchExerciseList = async () => {
            try {
                const awaitedUrl = await AsyncStorage.getItem('backendUrl');
                const response = await fetch(`${awaitedUrl}/exerciseList/fetch`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                });
                const res = await response.json();
                if (response.ok) {
                    setExerciseList(res["exercises"]);
                } else {
                    setErrors(res["error"]);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchExerciseList();
    }, []);

    const handleNumExerciseChange = (value) => {
        const intValue = parseInt(value, 10);
        if (!isNaN(intValue) && intValue >= 0) {
            setNumExercise(intValue);
            setExerciseData(Array(intValue).fill({ "exercise": "", "numSets": 0 }));
        }
    };

    const handleExerciseSelect = (exerciseName) => {
        const updatedData = exerciseData.map((exercise, index) => {
            if (index === selectedExerciseIndex) {
                return { ...exercise, exercise: exerciseName }; // Only update the selected index
            }
            return exercise; // Leave other elements unchanged
        });
        setExerciseData(updatedData);
        setModalVisible(false);
    };

    const handleInputChange = (index, field, value) => {
        const updatedRows = [...exerciseData];
        updatedRows[index] = {
            ...updatedRows[index],
            [field]: field === "numSets" ? parseInt(value, 10) || 0 : value,
        };
        setExerciseData(updatedRows);
    };

    const handleSubmit = async () => {
        const validationErrors = [];
        if (!workoutName) {
            validationErrors.push("Workout name is required.");
        }
        exerciseData.forEach((row, index) => {
            if (!row.exercise) {
                validationErrors.push(`Exercise ${index + 1} is required.`);
            }
            if (row.numSets <= 0) {
                validationErrors.push(`Number of sets for exercise ${index + 1} must be greater than 0.`);
            }
        });
        setErrors(validationErrors);
        if (validationErrors.length === 0) {
            try {
                const awaitedUrl = await AsyncStorage.getItem('backendUrl');
                const token = await AsyncStorage.getItem('token');
                const exerciseIds = exerciseData.map(ex => {
                    const exercise = exerciseList.find(e => e.name === ex.exercise);
                    return exercise ? exercise.id : null;
                });
                const numSets = exerciseData.map(ex => ex.numSets);
                const response = await fetch(`${awaitedUrl}/templates/add`, {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        name: workoutName,
                        exerciseIDs: exerciseIds,
                        sets: numSets
                    }),
                });
                const res = await response.json();
                if (response.ok) {
                    console.log("Template added successfully");
                } else {
                    setErrors([res["error"]]);
                }
            } catch (err) {
                console.log(err);
                setErrors(["An error occurred while submitting the template."]);
            }
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text>Workout Name:</Text>
            <TextInput
                style={styles.input}
                value={workoutName}
                onChangeText={setWorkoutName}
            />
            <Text>Number of Exercises:</Text>
            <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={numExercise.toString()}
                onChangeText={handleNumExerciseChange}
            />
            {exerciseData.map((exercise, index) => (
                <View key={index} style={styles.exerciseRow}>
                    <Text>Exercise {index + 1}:</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setSelectedExerciseIndex(index);
                            setModalVisible(true);
                        }}
                    >
                        <Text>{exercise.exercise || "Select Exercise"}</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Number of Sets"
                        value={exercise.numSets.toString()}
                        onChangeText={(value) => handleInputChange(index, "numSets", value)}
                    />
                </View>
            ))}
            {errors.length > 0 && (
                <View>
                    {errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>{error}</Text>
                    ))}
                </View>
            )}
            <Button title="Submit" onPress={handleSubmit} />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {exerciseList.map((exercise, idx) => (
                                <TouchableOpacity
                                    key={idx}
                                    style={styles.modalItem}
                                    onPress={() => handleExerciseSelect(exercise.name)}
                                >
                                    <Text>{exercise.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
            <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            navigation.navigate("BottomNavigator");
                        }}
                    >
                        <Text>home</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginVertical: 5,
    },
    exerciseRow: {
        marginBottom: 20,
    },
    button: {
        padding: 10,
        backgroundColor: '#ddd',
        alignItems: 'center',
        marginVertical: 5,
    },
    errorText: {
        color: 'red',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
    },
    modalItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default CreateWorkoutTemplate;