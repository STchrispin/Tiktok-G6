import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TikTokFeed } from '../components/tiktok/TikTokFeed';
import { UploadScreen } from '../components/tiktok/UploadScreen';
import FriendsScreen from '../screens/FriendsScreen';
import NotificationScreen from '../screens/NotificationScreen';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Placeholder for Profile screen
const ProfileScreen = () => (
  <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: '#fff' }}>Profil</Text>
  </View>
);

const MainNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Feed" component={TikTokFeed} />
      <Tab.Screen name="Friends" component={FriendsScreen} />
      <Tab.Screen name="Upload" component={UploadScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
