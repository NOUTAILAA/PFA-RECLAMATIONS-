import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/login';
import HomeScreen from './screens/homescreen';
import RequestListScreen from './screens/requestlistscreen';
import UserRequestListScreen from './screens/UserRequestListScreen';
import AddDemandScreen from './screens/AddDemandScreen';
import DemandDetailScreen from './screens/DemandDetailScreen';
import UserListScreen from './screens/UserListScreen';
import EditUserScreen from './screens/EditUserScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="RequestListScreen" component={RequestListScreen} />
        <Stack.Screen name="UserRequestListScreen" component={UserRequestListScreen} />
        <Stack.Screen name="AddDemandScreen" component={AddDemandScreen} />
        <Stack.Screen name="DemandDetailScreen" component={DemandDetailScreen} options={{ title: 'Détails de la demande' }} />
        <Stack.Screen name="UserListScreen" component={UserListScreen} options={{ title: 'Détails de la demande' }} />
        <Stack.Screen name="EditUserScreen" component={EditUserScreen} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
