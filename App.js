import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Map from './components/Map';
import Results from './components/Results';
import { Ionicons} from '@expo/vector-icons';  

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Kartta') {
      iconName = 'md-map-outline';
    } else if (route.name === 'Tulokset') {
      iconName = 'md-list';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  }
});

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="Kartta" component={Map} />
        <Tab.Screen name="Tulokset" component={Results} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}