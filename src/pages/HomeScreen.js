import React from 'react';
import {Text, StyleSheet, TouchableOpacity, ImageBackground, View} from 'react-native';
import BottomNavigator from './BottomNavigator';
import { useRoute } from '@react-navigation/native';


const HomeScreen = () => {

    const route = useRoute();
    const { username } = route.params;

    return(
        <View style = {styles.container}>
            
            <View style = {styles.titleContainer}>
                <Text style = {styles.headerText}>My Workout</Text>
            </View>

            <Text style = {styles.msg}>Looking strong, {username}!</Text>
            
        </View>   
        
    );
};



const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#171c17',
    },
    headerText:{
        fontSize: 35,
        fontFamily: 'American TypeWriter',
        marginTop:10,
        marginLeft:10,
        color:'white',
    },
    msg:{
        fontSize:20,
        marginLeft:10,
        marginTop:15,
        color:'white',
    },
    titleContainer:{
        backgroundColor:'black',
        paddingVertical:10,
    },
})






export default HomeScreen;






