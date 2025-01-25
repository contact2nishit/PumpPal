import React, {useState, useEffect, useRef} from 'react';
import {Animated, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RadioButton } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ScrollView } from 'react-native-web';
import { Picker } from '@react-native-picker/picker';
import { useRoute } from '@react-navigation/native';


const Question2 = ({navigation}) => {

    const [number, onChangeNumber] = useState('');
    const [unit, setUnit] = useState('feet');
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


    const handleBack = () => {
        navigation.navigate("Question1", {username: username});
    }

    const handleFront = () => {
        if(!number)
        {
            setError("Please enter your height");
            return;
        }
        else
        {
            setError("");
            navigation.navigate("Question3", {username: username});
        }
    }


    
    return (
            <View style = {styles.safeAreaContainer}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid
                >
                    <View
                        // source={require('../../assets/unc.gif')}
                        style={styles.container}
                        resizeMode="cover">

                        <Text style = {styles.title}>What is your height?</Text>
                        
                        <View style={styles.err}>
                            {error ? <Text style={styles.error}>{error}</Text> : null}
                        </View>

                        <View style = {styles.question}>
                            
                            <View style = {styles.group}>
                                
                                <TextInput
                                    style = {styles.height}
                                    onChangeText={onChangeNumber}
                                    value={number}
                                    placeholder='  Enter height'
                                    keyboardType='numeric'
                                />
                                
                                <View style = {styles.pic}>
                                    <Picker
                                        selectedValue={unit}
                                        style = {styles.picker}
                                        onValueChange={(itemValue) => setUnit(itemValue)}
                                        itemStyle = {styles.pickerItem}
                                    >
                                        <Picker.Item label = "Feet" value = "feet"/>
                                        <Picker.Item label = "Inch" value = "inch"/>

                                    </Picker>
                                </View>
                                
                            </View>
                            

                            <View style = {styles.buttons}>
                                <View style = {styles.nextView}>
                                    <TouchableOpacity onPress={handleBack}>
                                        <Animated.View 
                                            style = {[styles.back, {transform: [{rotate: wiggle}] }]}>
                
                                            <Text style = {styles.backText}>Back</Text>
                                        
                                        </Animated.View>
                                    </TouchableOpacity>
                                </View>

                                <View style = {styles.nextView}>
                                    <TouchableOpacity onPress={handleFront}>
                                        <Animated.View 
                                            style = {[styles.front, {transform: [{rotate: wiggle}] }]}>
                
                                            <Text style = {styles.frontText}>Next</Text>
                                        
                                        </Animated.View>
                                    </TouchableOpacity>
                                </View>

                            </View>


                        </View>




                    </View>
                </KeyboardAwareScrollView>
            </View>
    
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1, // This ensures SafeAreaView takes the full available space
    },
    scrollContainer:{
        flex:1,
    },
    container: {
        flex:1,
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
        marginTop:120,
        borderRadius:20,
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
        flex:1,
        textAlign:'center',
        marginTop:80,
        fontSize:29,
        fontWeight:'500',
        color:'white',
        fontFamily:'American Typewriter',
    },
    height:{
        marginTop:-170,
        backgroundColor:'white',
        width:200,
        height:60,
        paddingLeft:5,
        fontSize:20,
        fontFamily:'American Typewriter'
    },
    group:{
        position:'absolute',
        flexDirection:'row',
        alignItems:'center',
        top:-200,
    },
    // pickerContainer:{
    //     backgroundColor:'white',
    //     overflow:'hidden',
    //     borderRadius:5,
    //     justifyContent:'center',
    // },
    pic:{
        marginTop:100,
    },
    picker:{
        height:30,
        width:100,
        color:'white',
        marginBottom:300,
    },
    pickerItem:{
        backgroundColor: 'black',
        color:'white',
        height:60,
        width:100,
    },
    buttons:{
        marginTop:-150,
        flexDirection:'row',
        justifyContent:'space-evenly',
        gap:50,
    },
    back:{
        width:120,
        height:50,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
    },
    front:{
        width:120,
        height:50,
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5,
    },
    backText:{
        fontSize:20,
        fontFamily:'American Typewriter',
    },
    frontText:{
        fontSize:20,
        fontFamily:'American Typewriter',
    }
    

})

export default Question2;