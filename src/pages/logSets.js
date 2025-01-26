import React, { useState } from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';
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
                console.log(`xp ${res["xpAfter"]}`)
                navigation.navigate('Finished');
                AsyncStorage.setItem('xp', res["xpAfter"].toString());
                if(res['newLevel'] != -1) {
                    AsyncStorage.setItem('level', res["newLevel"].toString());
                    AsyncStorage.setItem('nextCutoff', res["nextCutoff"].toString());
                    AsyncStorage.setItem('initXP', res["initXP"].toString());
                    AsyncStorage.setItem('title', res["newTitle"]);
                    console.log(`level ${res["newLevel"]} title ${res["newTitle"]}`)
                }
            } else {
                setErrors([res["error"]]);
            }
        } catch (err) {
            console.log(err);
            setErrors(["An error occurred while ending the session."]);
        }
    }

    const showAlert = () => {
        Alert.alert("Successfully submitted");
        handleEnd();
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
                    <Text style = {styles.name}>{exerciseName}</Text>
                    {setsData[exerciseIndex].map((set, setIndex) => (
                        <View key={setIndex} style={styles.setRow}>
                            <Text style = {styles.set}>Set {setIndex + 1}:</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Weight"
                                value={set.weight}
                                onChangeText={(value) => handleInputChange(exerciseIndex, setIndex, 'weight', value)}
                                placeholderTextColor='white'
                                
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Reps"
                                value={set.reps}
                                onChangeText={(value) => handleInputChange(exerciseIndex, setIndex, 'reps', value)}
                                placeholderTextColor='white'
                            />
                            <TouchableOpacity
                                onPress={() => handleSubmitSet(exerciseIDs[exerciseIndex], setIndex, set.weight, set.reps)}
                                style = {styles.submitButton}
                            >
                                <Text style = {styles.sub}>Submit Set</Text>
                            </TouchableOpacity>
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
        <TouchableOpacity 
            onPress={() => handleEnd()}
            style={styles.end}
        >
            <Text style = {styles.butText}>End workout</Text>
        </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20,
        backgroundColor:"#171c17",
    },
    set:{
        color:'white',
    },
    sub:{
        fontFamily:'American Typewriter',
        color:'white',
    },
    submitButton:{
        position:'relative',
        backgroundColor:'red',
        width:100,
        height:40,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
    },
    end:{
        marginTop:20,
        width:150,
        height:40,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        alignSelf:'center',
    },
    butText:{
        fontSize:18,
        fontWeight:'bold',
        fontFamily:'American Typewriter',
        color:'white',
    },
    name:{
        color:'white',
        marginBottom:20,
        fontSize:30,
        fontFamily:'American Typewriter',
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
        color:'white',
    },
    errorText: {
        color: 'red',
        marginTop:-10,
        position:'relative',
    },
});

export default LogSets;