import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={() => null} />
      <Tab.Screen name="Search" component={() => null} />
      <Tab.Screen name="Upload" component={() => null} />
      <Tab.Screen name="Messages" component={() => null} />
      <Tab.Screen name="Profile" component={() => null} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
