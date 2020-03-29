import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Main from './pages/Main'
import Profile from './pages/Profile'
import Register from './pages/Register'

const Stack = createStackNavigator();

function Routes() {
    return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
            <Stack.Screen
             name="Main"
             component={Main} 
             options={{ 
                 title: 'DevRadar',
                 headerTintColor: "#FFF", 
                 headerStyle: {
                  backgroundColor: "#7D40E7"
                 } 
             }}
            />
            <Stack.Screen 
             name="Profile" 
             component={Profile}
             options={{
                headerTintColor: "#FFF",
                headerBackTitleVisible: false,
                headerStyle: {
                    backgroundColor: "#7D40E7"
                } 
             }}
            />

            <Stack.Screen 
            name="Register"
            component={Register}
            options={{
                title: 'DevRegister',
                headerTintColor: "#fff",
                headerStyle: {
                    backgroundColor: '#7D40E7'
                    
                }
            }}
            />
        </Stack.Navigator>
        </NavigationContainer>
    );
}


export default Routes