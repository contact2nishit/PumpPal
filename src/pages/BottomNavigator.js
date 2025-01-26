import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './HomeScreen';
import StartWorkout from './startWorkout';
import viewPastWorkouts from './viewPastWorkouts';
import { useRoute } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // Import the icon library
import Analyze from './Analyze';
import GymTime from './GymTime';

const Tab = createBottomTabNavigator();

const BottomNavigator = () => {
    
    const route = useRoute();
    const [username, setUsername] = useState("");
    useEffect(() => {
      const getUsername = async () => {
        const _username = AsyncStorage.getItem('username');
        setUsername(_username);
      }
      getUsername();
    }, []);

    console.log(username);

    return(
        <Tab.Navigator 
            screenOptions={({ route }) => ({
                tabBarStyle:{
                    backgroundColor: 'black',
                    borderTopWidth:0,
                },
                tabBarActiveTintColor:'white',
                tabBarInactiveTintColor:'gray',
                tabBarIcon: ({color, size}) => {
                    let iconName;

                    if(route.name === 'Workouts') {
                        iconName = 'home-outline';
                    }
                    else if(route.name === 'Start workout') {
                        iconName = 'fitness-outline';
                    }
                    else if(route.name === 'Progress'){
                        iconName = 'stats-chart-outline';
                    }
                    else if(route.name === 'Analyze'){
                        iconName = 'analytics-outline';
                    }

                    return <Icon name = {iconName} size = {size} color = {color} />;
                },
            })}
        >
            <Tab.Screen name = "Workouts" 
                        component={HomeScreen}
                        options={{headerShown: false}}
                        initialParams={{username}}
            />

            <Tab.Screen name = "Start workout" 
                        component={GymTime}
                        options = {{headerShown: false}}
                        
            />

            <Tab.Screen name = "Progress" 
                        component = {viewPastWorkouts}
                        options = {{headerShown: false}}
            />

            <Tab.Screen name = "Analyze"
                        component = {Analyze}
                        options = {{headerShown: false}}
            />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    nav:{
        backgroundColor:'black',
    }
})


export default BottomNavigator;