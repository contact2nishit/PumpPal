import React, {useEffect, useRef, useState} from 'react';
import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RadioButton } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';


const Question1 = ({navigation}) => {
    
    const [selectedOption, setSelectedOption] = useState('');
    const [error, setError] = useState('');

    const wiggleAnim = useRef(new Animated.Value(0)).current;

    const route = useRoute();
    const { username } = route.params;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(wiggleAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(wiggleAnim, {
                    toValue: -1,
                    duration: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(wiggleAnim, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [wiggleAnim]);

    const wiggle = wiggleAnim.interpolate({
        inputRange: [-1, 1],
        outputRange: ['-1deg', '1deg'],
    });



    const handlePress = (value) =>{
        setSelectedOption(value);
        console.log(value);
    };

    const handleNext = () =>{
        if(!selectedOption)
        {
            setError("Please select an option");
            return;
        }
        else
        {
            setError("");
            navigation.navigate("Question2", {username: username});
        }
    };
    
    return (
        <View style = {styles.safeAreaContainer}>
            <View
                // source={require('../../assets/unc.gif')}
                style={styles.container}
                resizeMode="cover">
                
                <Text style = {styles.title}>What type of training are you looking for?</Text>

                <View style = {styles.question}>

                    <View style={styles.err}>
                        {error ? <Text style={styles.error}>{error}</Text> : null}
                    </View>

                    <View style = {styles.group}>
                        {/* <RadioButton.Group 
                            onValueChange={(value) => setSelectedOption(value)} // Update selected option
                            value={selectedOption} // Bind to selected option
                        > */}

                            <TouchableOpacity 
                                style = {[
                                    styles.radioButton,
                                    selectedOption === 'strength' && styles.selectedRadioButton,
                                ]}
                                onPress={() => handlePress('strength')}
                            >
                                {/* <RadioButton
                                    value = "strength"
                                    status = {selectedOption === 'strength' ? 'checked' : 'unchecked'}
                                /> */}
                                <Text style={styles.option}>Strength Training</Text>
                            </TouchableOpacity>


                            <TouchableOpacity 
                                style = {[
                                    styles.radioButton,
                                    selectedOption === 'strength&cardio' && styles.selectedRadioButton,
                                ]}
                                onPress={() => handlePress('strength&cardio')}
                            >
                                {/* <RadioButton
                                    value = "strength&cardio"
                                    status = {selectedOption === 'strength&cardio' ? 'checked' : 'unchecked'}
                                /> */}
                                <Text style={styles.option}>Strength Training & Cardio</Text>
                            </TouchableOpacity>


                            <TouchableOpacity 
                                style = {[
                                    styles.radioButton,
                                    selectedOption === 'cardio' && styles.selectedRadioButton,
                                ]}
                                onPress={() => handlePress('cardio')}
                            >
                                {/* <RadioButton
                                    value = "cardio"
                                    status = {selectedOption === 'cardio' ? 'checked' : 'unchecked'}
                                /> */}
                                <Text style={styles.option}>Cardio</Text>
                            </TouchableOpacity>

                        {/* </RadioButton.Group> */}

                    </View>

                </View>
                
                <View style = {styles.nextView}>
                    <TouchableOpacity onPress={handleNext}>
                        <Animated.View 
                            style = {[styles.next, {transform: [{rotate: wiggle}] }]}>

                            <Text style = {styles.nextTxt}>Next</Text>
                        
                        </Animated.View>
                    </TouchableOpacity>
                </View>


            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1, // This ensures SafeAreaView takes the full available space
    },
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor:'#171c17',
    },
    err:{
        justifyContent:'center',
        alignItems:'center',
        marginBottom:20,
    },
    error:{
        color:'red',
        fontSize:15,
    },
    option:{
        fontSize:20,
        color:'white',
        fontFamily:'American Typewriter',
        paddingLeft:10,
    },
    question:{
        width:300,
        height:400,
        justifyContent:'center',
        alignSelf:'center',
        marginTop:10,
        borderRadius:20,
    },
    group:{
        marginBottom:20,
        marginLeft:2,
    },
    radioButton:{
        flexDirection:'row',
        alignItems:'center',
        marginBottom:30,
        backgroundColor:'#000',
        borderRadius:10,
        width:300,
        height:70,
    },
    selectedRadioButton:{
        borderColor:'red',
        borderWidth:0.5,
    },
    title:{
        justifyContent:'flex-start',
        textAlign:'center',
        flexWrap:'wrap',
        marginTop:90,
        fontSize:30,
        fontWeight:'500',
        color:'white',
        fontFamily:'American Typewriter',
    },
    nextView:{
        justifyContent:'center',
        alignItems:'center',
    },
    next:{
        marginTop:10,
        width: 190,
        height: 50,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
    },
    nextTxt:{
        textAlign:'center',
        fontSize:20,
        fontFamily:'American Typewriter',
    }

})

export default Question1;