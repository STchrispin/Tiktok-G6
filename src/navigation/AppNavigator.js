import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// 1. Les imports de React Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

// 2. Import d'une librairie d'icônes
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// 3. Les imports de tes écrans
import ChatScreen from '../screens/ChatScreen';
import FriendsScreen from '../screens/FriendsScreen';

// Écrans temporaires (Faux composants) pour combler les onglets manquants
// Tu pourras les remplacer par tes vrais fichiers plus tard !
const HomeScreen = () => <View style={styles.center}><Text style={styles.text}>Accueil (Fils d'actualité)</Text></View>;
const DiscoverScreen = () => <View style={styles.center}><Text style={styles.text}>Découvrir / Recherche</Text></View>;
const ProfileScreen = () => <View style={styles.center}><Text style={styles.text}>Mon Profil</Text></View>;

// --- STACK NAVIGATION (Pour pouvoir naviguer d'un écran à un autre) ---
const TiktokStack = createStackNavigator();

const TiktokStackNavigator = () => (
  <TiktokStack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: '#000' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <TiktokStack.Screen 
      name="Friends" 
      component={FriendsScreen} 
      options={{ title: 'Amis' }} 
    />
    <TiktokStack.Screen 
      name="Chat" 
      component={ChatScreen} 
      options={{ title: 'Discussion' }} 
    />
  </TiktokStack.Navigator>
);

// --- BOTTOM TAB NAVIGATION (La barre d'onglets du bas) ---
const Tab = createBottomTabNavigator();

const RootTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // On utilise les headers des stacks si besoin
        tabBarActiveTintColor: '#fff', 
        tabBarInactiveTintColor: '#888', 
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* Onglet 1 : Accueil */}
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />

      {/* Onglet 2 : Découvrir */}
      <Tab.Screen 
        name="DiscoverTab" 
        component={DiscoverScreen} 
        options={{
          tabBarLabel: 'Découvrir',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" color={color} size={size} />
          ),
        }}
      />

      {/* Onglet 3 : Messagerie / Amis (Contient ta Stack existante !) */}
      <Tab.Screen 
        name="TikTokTab" 
        component={TiktokStackNavigator} 
        options={{
          tabBarLabel: 'Amis',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="comment-text-multiple" color={color} size={size} />
          ),
        }}
      />

      {/* Onglet 4 : Profil */}
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// --- COMPOSANT PRINCIPAL ---
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootTabNavigator />
    </NavigationContainer>
  );
}

// --- STYLES ---
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#000', 
    borderTopWidth: 0,
    height: 60,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 5,
  },
  // Styles pour les écrans de test
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  text: {
    color: '#fff',
    fontSize: 18,
  }
});