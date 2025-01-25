import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Animated, Image } from 'react-native';
// import MySvg from '../../assets/app-logo.svg';
// import image from '../assets/chickybreast.jpg';  // Your image file
// import * as Font from 'expo-font';

const StartScreen = ({ navigation }) => {
    // const [lineWidth] = useState(new Animated.Value(0));

    // const [fontLoaded, setFontLoaded] = useState(false);


    // useEffect(() => {

    //     // async function loadFonts(){
    //     //     await Font.loadAsync({
    //     //         'jersey-10': require('./assets/fonts/Jersey10-Regular.ttf'),
    //     //     });
    //     //     setFontLoaded(true);
    //     // }

    //     // loadFonts();


    //     Animated.timing(lineWidth, {
    //         toValue: 1,
    //         duration: 1000, // Duration in ms for the animation
    //         useNativeDriver: false, // Temporarily set to false for debugging
    //     }).start();
    // }, []);
    const [fadeAnim] = useState(new Animated.Value(1));  // Initial opacity is 1 (fully visible)

  // UseEffect to trigger fade-out and scale-down after 2 seconds
  useEffect(() => {
    // Set a timeout to start the fade out and scale down effect after 2 seconds
    const timer = setTimeout(() => {
      // Fade out and scale down animation
      Animated.timing(fadeAnim, {
        toValue: 0, // Final opacity value (0 means fully transparent)
        duration: 1000, // Duration of the fade-out effect (1 second)
        useNativeDriver: true, // Use native driver for better performance
      }).start(() => {
        // After the animation completes, navigate to Login screen
        navigation.navigate('Login');
      });
    }, 1000); // Wait for 2 seconds before starting the fade-out and scale-down

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [fadeAnim, navigation]);
    


    return (
        <View style={styles.container}>
            <ImageBackground
                // source={image}
                resizeMode="cover"
                style={[styles.background, {backgroundColor: 'black'}]}
            >

                    <View style={styles.overlay}>
                        {/* Title */}
                        <Text style={styles.title}>Pump Pal</Text>
                        
                        <Image 
                            source={require('../../assets/app-logo.png')}  // Add your image path here
                            style={styles.logoImage}
                        />
                    </View>

                    <View>
                        {/* <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.buttonText}>Get Swole</Text>
                        </TouchableOpacity> */}
                    </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    line: {
        height: 2,
        backgroundColor: 'white',
        marginTop: 10, // Adjust this to space the line below the title
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop:-400,
    },
    title: {
        color: 'white',
        fontSize: 45,
        fontWeight: '800',
        textAlign: 'center',
        letterSpacing: 5,
        marginTop: 300, // Reduce margin to prevent pushing the line too far down
        fontFamily:'Jersey10-Regular',
        position:'absolute',
        marginBottom:100,
    },
    button: {
        backgroundColor: 'red',  // Use a vibrant background color
        width: 220,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        marginBottom:150,  // Add some space between the line and the button
        boxShadow:"0px 5px 10px white",
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    logoImage:{
        resizeMode:'contain',
        width:250,
        height:250,
        marginTop:450,
    },

});

export default StartScreen;