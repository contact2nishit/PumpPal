import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';

const StartWorkout = ({ navigation }) => {
    const [templates, setTemplates] = useState({});
    const [errors, setErrors] = useState([]);

    const route = useRoute();
    const {username} = route.params || {};

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


    const handleBa = async () => {
        const username = await AsyncStorage.getItem('username');
        console.log(username);
        navigation.navigate("BottomNavigator", { username });
    }


    return (
        <View style={styles.container}>
            <View style = {styles.headerCont}>
                <Text style = {styles.work}>Choose a workout to start</Text>
            </View>

            {errors.length > 0 && (
                <View>
                    {errors.map((error, index) => (
                        <Text key={index} style={styles.errorText}>{error}</Text>
                    ))}
                </View>
            )}
            
            <View style = {styles.objects}>

                {Object.keys(templates).map((templateName) => (
                    <TouchableOpacity
                        key={templateName}
                        title={templateName}
                        style={styles.templateButton}
                        onPress={() => handleStartSession(templateName)}
                    >
                        <Text style={styles.templateButtonText}>{templateName}</Text>    
                    </TouchableOpacity>
                ))}
            </View>

            <View style = {styles.ba}>
                <TouchableOpacity
                    style = {styles.bac}
                    onPress={handleBa}
                >
                    <Text style = {styles.tex}>Back</Text>
                </TouchableOpacity>
            </View>

            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#171c17',
    },
    headerCont: {
        backgroundColor: 'black',
        paddingVertical: 10,
        width:'120%',
        height:70,
        position:'absolute',
        top:0,
        justifyContent:'center',
        alignItems:'center',
    },
    errorText: {
        color: 'red',
    },
    objects:{
        marginTop:90,
    },
    work:
    {
        color:'white',
        fontSize:25,
        fontFamily:'American Typewriter',
        marginRight:75,
    },
    templateButton: {
        width: '90%',
        marginBottom: 15,
        paddingVertical: 15,
        backgroundColor: 'red',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        opacity: 0.9,
        alignSelf:'center',
      },
      templateButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily:'American Typewriter',
      },
      ba:{
        marginTop:20,
        width:190,
        height:50,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
        position:'relative',
        alignSelf:'center',
      },
      tex:{
        fontSize:28,
        fontFamily:'American Typewriter',
      }
});

export default StartWorkout;