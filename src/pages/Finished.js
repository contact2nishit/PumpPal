import React, { useEffect, useState } from 'react';
import {Text, StyleSheet, TouchableOpacity, ImageBackground, View} from 'react-native';
import BottomNavigator from './BottomNavigator';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Progress from 'react-native-progress';


const Finished = ({route, navigation}) => {
    const [title, setTitle] = useState('Gymgoer');
    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(0);
    const [badge, setBadge] = useState('');
    const [progress, setProgress] = useState(0);
    const [startValue, setStartValue] = useState(0);
    const [endValue, setEndValue] = useState(0);
    

    useEffect(() => {
        const fetchData = async () => {
            const _title = await AsyncStorage.getItem('title') || "Gymgoer";
            const _xp = parseInt(await AsyncStorage.getItem('xp')) || 0;
            const _level = parseInt(await AsyncStorage.getItem('level')) || 0;
            const _badge = await AsyncStorage.getItem('badge') || "Beginner";
            const _startValue =  parseInt(await AsyncStorage.getItem('initXP'));
            const _endValue = parseInt(await AsyncStorage.getItem('nextCutoff'));
            
            setTitle(_title);
            setXp(_xp);
            setLevel(_level);
            setBadge(_badge);
            setStartValue(_startValue);
            setEndValue(_endValue);

            if (_endValue > _startValue) 
            {
                setProgress((_xp - _startValue) / (_endValue - _startValue));
            }
            if(_startValue === 0)
            {
                setProgress((_xp / _endValue));
            
            }
        };
        fetchData();
    }, [xp, level]);


    return (
        <View style = {styles.container}>

            <View style={styles.progressContainer}>
                <Progress.Bar
                progress={progress}  // Pass the calculated progress
                width={300}           // You can adjust the width
                height={10}           // Set the height of the progress bar
                borderRadius={5}      // Optional: rounding the corners
                color="red"       // You can change the color
                unfilledColor="white" // Optional: the color of the unfilled part
                style = {styles.bar}
                />
            </View>

            <View style = {styles.head}>
                <Text style = {styles.txt}>Nice workout, {title}!</Text>
            </View>

            <View style = {styles.description}>

            
                <Text style = {styles.points}>You are at {xp} XP, level {level}</Text>
                {badge == "Beginner" ? <Text style = {styles.badge}>You are a beginner</Text> : <Text>You earned the {badge} badge</Text>}
                <TouchableOpacity
                    onPress={() => navigation.navigate("BottomNavigator")}
                    style = {styles.button}
                >
                    <Text style = {styles.txty}>Back</Text>
                </TouchableOpacity>
            </View>


        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#171c17',
    },
    head:{
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'black',
        height:60,
    },
    txt:{
        fontSize:30,
        color:'white',
        fontFamily:'American Typewriter',
    },
    description:{
        justifyContent:'center',
        alignItems:'center',
        marginTop:70,
    },
    points:{
        color:'white',
        fontSize:25,
        fontFamily:'American Typewriter',
    },
    badge:{
        marginTop:20,
        fontSize:25,
        color:'white',
        fontFamily:'American Typewriter',
    },
    button:{
        marginTop:30,
        position:'relative',
        backgroundColor:'red',
        width:200,
        height:50,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
    },
    txty:{
        color:'white',
        fontSize:30,
        fontFamily:'American Typewriter',
        alignSelf:'center',
    },
    bar:{
        top:90,
        position:'absolute',
        left:40,
    }

})


export default Finished;