import React, {useRef, useEffect} from 'react';
import {Animated, View, Text, StyleSheet, TouchableOpacity} from'react-native';
import Loading from './Loading';

const Analyze = ({navigation}) => {


    const handleBut = () => {
        navigation.navigate("Loading");
    }

    const wiggleAnim = useRef(new Animated.Value(0)).current;
    
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


    return (
        <View style = {styles.container}>
        
            <View style = {styles.header}>
                <Text style = {styles.ana}>Analyze with Jack</Text>
            </View>


            <TouchableOpacity onPress={handleBut}>
                <Animated.View 
                    style = {[styles.butty, {transform: [{rotate: wiggle}] }]}>

                    <Text style = {styles.txt}>Next</Text>
                
                </Animated.View>
            </TouchableOpacity>
            
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'#171c17',
    },
    butty:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
        width:300,
        height:60,
        alignSelf:'center',
        borderRadius:10,
    },
    txt:{
        fontSize:30,
        fontFamily:'American Typewriter',
    },
    header:{
        position:'absolute',
        top:20,
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
    },
    ana:{
        fontSize:38,
        color:'white',
        fontFamily:'American Typewriter',
    }

})

export default Analyze;