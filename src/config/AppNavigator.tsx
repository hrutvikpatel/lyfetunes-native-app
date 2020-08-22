import React, { useEffect, useState } from 'react';
import { NavigationContainer, } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Signup from '../screens/Signup/Signup';
import Home from '../screens/Home/Home';
import Wrapper from '../hoc/Wrapper/Wrapper';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Wrapper>
            <NavigationContainer>
                <Stack.Navigator
                    headerMode='none'
                >
                    <Stack.Screen
                        name='Signup'
                        component={Signup}
                    />
                    <Stack.Screen
                        name="Home"
                        component={Home}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </Wrapper>
    )
};

export default AppNavigator;