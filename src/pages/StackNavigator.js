import React, { useEffect, useState } from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import StartScreen from './StartScreen';


const Stack = createNativeStackNavigator();

const StackNavigator = () => {




    return (
        <Stack.Navigator>
            <Stack.Screen name="Start Screen" component={StartScreen}/>
        </Stack.Navigator>
    );
}


export default StackNavigator;