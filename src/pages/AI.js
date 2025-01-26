import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video, Audio } from 'expo-av';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AI = ({ route }) => {
    route = useRoute();
    // const { data } = route.params;
    // console.log('Data:', data);
    const [resp, setResp] = useState("");
    // const [sound, setSound] = useState();
    // const [isAudioLoaded, setIsAudioLoaded] = useState(false);
    
    // useEffect(() => {
    //     const playAudio = async () => {
    //         try {
    //             // Load audio
    //             const { sound } = await Audio.Sound.createAsync(
    //                 require('../../assets/Analysis.mp3') // Replace with your actual audio file path
    //             );

    //             setSound(sound);

    //             // Play the audio
    //             await sound.playAsync();
    //             setIsAudioLoaded(true); // Mark the audio as loaded

    //             console.log("Audio loaded and playing");

    //         } catch (error) {
    //             console.error("Error loading or playing audio:", error);
    //         }
    //     };

    //     playAudio();

    //     // Cleanup when component unmounts
    //     return () => {
    //         if (sound) {
    //             sound.unloadAsync(); // Unload the audio when the component unmounts
    //             console.log("Audio unloaded");
    //         }
    //     };
    // }, []);
    useEffect(() => {
        const fetchResp = async () => {
            try {
                const _resp = await AsyncStorage.getItem('analyzeItem');
                if (_resp !== null) {
                    setResp(_resp);
                } else {
                    console.log('Item not found in AsyncStorage');
                }
            } catch (error) {
                console.error('Error retrieving data from AsyncStorage:', error);
            }
        };
        fetchResp();
    }, []);
    console.log(resp);
    return (
        <View style={styles.container}>
            <View style={styles.vid}>
                <Video
                    source={require('../../assets/AI_trainer.mp4')} // Local video file
                    style={styles.backgroundVideo}
                    controls={true} // Show video controls (play, pause, etc.)
                    resizeMode="cover" // Adjust the video size to cover the area
                    shouldPlay
                    isLooping
                />
            </View>

            <View style={styles.statusText}>
                <Text>{resp}</Text>
            </View>
            <Text>{resp}</Text>
            {/* {isAudioLoaded ? (
                <Text style={styles.statusText}>Audio is playing</Text>
            ) : (
                <Text style={styles.statusText}>Loading audio...</Text>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Makes the container take up the full screen
        backgroundColor: '#171c17',
        justifyContent: 'flex-start', // Align children (the video) to the top
        alignItems: 'center', // Center the video horizontally
    },
    backgroundVideo: {
        width: '60%', // Full width of the video container
        height: '100%', // Full height of the video container
    },
    vid: {
        width: '100%', // Adjust to your preferred width
        height: '50%', // Takes up the top half of the screen
        marginTop: 0, // No additional margin from the top
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    statusText: {
        color: 'white',
        fontSize: 16,
        marginTop: 20,
    },
});

export default AI;