import React, { useEffect, useState } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import StartScreen from './StartScreen';
import Login from './login';
import Register from './Register';
import Welcome from './Welcome';
import HomeScreen from './HomeScreen';
import Question1 from './Question1';
import CreateWorkoutTemplate from './createWorkoutTemplate';
import StartWorkout from './startWorkout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Question2 from './Question2';
import Question3 from './Question3';
import Question4 from './Question4';
import LogSets from './logSets';
import ViewPastWorkouts from './viewPastWorkouts';
import BottomNavigator from './BottomNavigator';
import TemplateDetail from './TemplateDetail';
import Finished from './Finished';
import GymTime from './GymTime';
import Loading from './Loading';
import AI from './AI';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {


    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const checkAuth  = async () => {
            const token = await AsyncStorage.getItem("token");
            const user = await AsyncStorage.getItem("username");
            setIsAuthenticated(token ? true: false);
            setUsername(user);
        };
        checkAuth();
    }, []);
    

    return (
        <Stack.Navigator initialRouteName={isAuthenticated ? 'HomeScreen': 'Start Screen'}>
            <Stack.Screen name="Start Screen" component={StartScreen}/>
            <Stack.Screen name="Question1" component={Question1}/>
            <Stack.Screen name="Register" component={Register}/>
            <Stack.Screen name="Login" component={Login}/>
            <Stack.Screen name="Welcome" component = {Welcome}/>
            <Stack.Screen name="BottomNavigator" component={BottomNavigator}/>
            <Stack.Screen name="Finished" component={Finished}/>
            <Stack.Screen name="HomeScreen" component={HomeScreen}/>
            <Stack.Screen name="Templates" component = {CreateWorkoutTemplate}/>
            <Stack.Screen name="Question2" component={Question2}/>
            <Stack.Screen name="Question3" component={Question3}/>
            <Stack.Screen name="Question4" component={Question4}/>
            <Stack.Screen name="startWorkout"  component={StartWorkout} />
            <Stack.Screen name="LogSets" component={LogSets} />
            <Stack.Screen name="ViewPastWorkouts" component={ViewPastWorkouts} />
            <Stack.Screen name="TemplateDetail" component={TemplateDetail}/>
            <Stack.Screen name="GymTime" component={GymTime}/>
            <Stack.Screen name="Loading" component={Loading}/>
            <Stack.Screen name="AI" component={AI}/>
        </Stack.Navigator>
    );
}


export default StackNavigator;