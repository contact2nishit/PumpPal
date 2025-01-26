import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Loading = ({navigation}) => {

    const [data, setData] = useState(null);

    useEffect(() => {
        callAnalyzeAPI();


        const timer = setTimeout(() => {
            navigation.navigate('AI', {data: data}); // Replace 'NextScreen' with the name of the screen you want to navigate to
        }, 15000); // Duration in milliseconds (5000ms = 5 seconds)
        


        return () => clearTimeout(timer); // Cleanup the timer if the component unmounts
    }, [navigation]);


    const callAnalyzeAPI = async () => {
        try {
            const awaitedUrl = await AsyncStorage.getItem('backendUrl');
            const token = await AsyncStorage.getItem('token');
            console.log('Retrieved backend URL:', awaitedUrl); // Log URL to verify
            const response = await fetch(`${awaitedUrl}/analyze`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            });
            console.log(`resp ${response}`);
            if (response.ok) {
                const data = await response.json();
                console.log(`data ${data}`);
                setData(data);
                console.log('Response data:', data);
                console.log(`resp: ${data["AI_response"]}`);
                AsyncStorage.setItem('analyzeItem', data["AI_response"]);
            // Handle the response data as needed
            } 
            else 
            {
                console.log('Failed to fetch:', response.status);
            }
        } catch (error) {
            console.error('Error calling API:', error);
        }

    };


    return (
        <View style = {styles.container}>
            
            <View style = {styles.loader}>
                <ActivityIndicator/>
                
            </View>
            

            <Text style = {styles.act}>
                Analyzing your workout
            </Text>


        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#171c17",
    },
    loader:{
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        marginTop:300,
    },
    act:{
        fontSize:18,
        color:'white',
        justifyContent:'center',
        alignItems:'center',
        alignSelf:'center',
        marginTop:30,
    }
})

export default Loading;