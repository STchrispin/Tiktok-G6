import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SoundListScreen from '../screens/audio/SoundListScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Sons" component={SoundListScreen} />
      <Tab.Screen name="Admin" component={AdminDashboard} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
