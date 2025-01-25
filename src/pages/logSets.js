import React, { useState } from 'react';
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LogSets = ({ route, navigation }) => {
    const { sessionID, exerciseIDs, exerciseNames, sets } = route.params;
    const [setsData, setSetsData] = useState(exerciseNames.map((_, index) => Array(sets[index]).fill({ weight: '', reps: '' })));
    const [errors, setErrors] = useState([]);

    const handleInputChange = (exerciseIndex, setIndex, field, value) => {
        const updatedSetsData = [...setsData];
        updatedSetsData[exerciseIndex][setIndex] = {
            ...updatedSetsData[exerciseIndex][setIndex],
            [field]: value,
        };
        setSetsData(updatedSetsData);
    };
    const handleEnd = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const awaitedUrl = await AsyncStorage.getItem('backendUrl');
            const response = await fetch(`${awaitedUrl}/sessions/end`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionID })
            });
            const res = await response.json();
            if (response.ok) {
                console.log("Session ended successfully");
                navigation.navigate('HomeScreen');
            } else {
                setErrors([res["error"]]);
            }
        } catch (err) {
            console.log(err);
            setErrors(["An error occurred while ending the session."]);
        }
    }
    const handleSubmitSet = async (exerciseID, setIndex, weight, reps) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const awaitedUrl = await AsyncStorage.getItem('backendUrl');
            const response = await fetch(`${awaitedUrl}/sets/add`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ sessionID, exerciseID, weight, reps })
            });
            const res = await response.json();
            if (response.ok) {
                console.log("Set logged successfully");
            } else {
                setErrors([res["error"]]);
            }
        } catch (err) {
            console.log(err);
            setErrors(["An error occurred while logging the set."]);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {exerciseNames.map((exerciseName, exerciseIndex) => (
                <View key={exerciseIndex} style={styles.exerciseSection}>
                    <Text>{exerciseName}</Text>
                    {setsData[exerciseIndex].map((set, setIndex) => (
                        <View key={setIndex} style={styles.setRow}>
                            <Text>Set {setIndex + 1}:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Weight"
                                value={set.weight}
                                onChangeText={(value) => handleInputChange(exerciseIndex, setIndex, 'weight', value)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Reps"
                                value={set.reps}
                                onChangeText={(value) => handleInputChange(exerciseIndex, setIndex, 'reps', value)}
                            />
                            <Button
                                title="Submit Set"
                                onPress={() => handleSubmitSet(exerciseIDs[exerciseIndex], setIndex, set.weight, set.reps)}
                            />
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
        <TouchableOpacity onPress={() => handleEnd()}>
            <Text>End workout</Text>
        </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    exerciseSection: {
        marginBottom: 20,
    },
    setRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginHorizontal: 5,
        flex: 1,
    },
    errorText: {
        color: 'red',
    },
});

export default LogSets;