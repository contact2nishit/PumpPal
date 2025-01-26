import React, {useEffect} from 'react';
import {ImageBackground, View, StyleSheet} from 'react-native';




const GymTime = ({navigation}) =>
{

    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('startWorkout'); // Replace 'NextScreen' with the name of the screen you want to navigate to
        }, 1500); // Duration in milliseconds (5000ms = 5 seconds)
        
        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, [navigation]);


    return (
        <View style = {styles.container}>

            <ImageBackground
                source={require('../../assets/gym-time.gif')}
                style={styles.image}
            >
            
            </ImageBackground>

        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    image:{
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',
    }
})
export default GymTime;