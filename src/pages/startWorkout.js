import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartWorkout = ({ navigation }) => {
    const [templates, setTemplates] = useState({});
    const [errors, setErrors] = useState([]);

    useEffect(() => {
        const fetchTemplateList = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const awaitedUrl = await AsyncStorage.getItem('backendUrl');
                const response = await fetch(`${awaitedUrl}/templates/fetch`, {
                    method: 'GET',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                });
                const res = await response.json();
                if (response.ok) {
                    setTemplates(res);
                } else {
                    setErrors([res["error"]]);
                }
            } catch (err) {
                console.log(err);
                setErrors(["An error occurred while fetching templates."]);
            }
        };
        fetchTemplateList();
    }, []);

    const handleStartSession = async (templateName) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const awaitedUrl = await AsyncStorage.getItem('backendUrl');
            const response = await fetch(`${awaitedUrl}/sessions/start`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ templateID: templates[templateName]["templateID"] })
            });
            const res = await response.json();
            if (response.ok) {
                navigation.navigate('LogSets', { "sessionID": res["sessionID"], "exerciseIDs": templates[templateName]["exerciseIDs"], "exerciseNames": templates[templateName]["exercises"], "sets": templates[templateName]["sets"] });
            } else {
                setErrors([res["error"]]);
            }
        } catch (err) {
            console.log(templates);
            console.log(`name: ${templates[templateName]}`);
            console.log(templates[templateName]);
            console.log(err);
            setErrors(["An error occurred while starting the session."]);
        }
    };

    return (
        <View style={styles.container}>
            <Text>Choose a workout to start</Text>
            {Object.keys(templates).map((templateName) => (
                <Button
                    key={templateName}
                    title={templateName}
                    onPress={() => handleStartSession(templateName)}
                />
            ))}
            {errors.length > 0 && (
                <View>
                    {errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>{error}</Text>
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    errorText: {
        color: 'red',
    },
});

export default StartWorkout;