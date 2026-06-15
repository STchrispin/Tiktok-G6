// src/components/tiktok/TestTabs.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { TikTokFeed } from './TikTokFeed';
import { UploadScreen } from './UploadScreen';
import Icon from 'react-native-vector-icons/Ionicons';

export const TestTabs: React.FC = () => {
  // 'home' affichera le flux, 'create' affichera l'écran d'upload
  const [currentTab, setCurrentTab] = useState<'home' | 'create'>('home');

  return (
    <View style={styles.container}>
      {/* Zone d'affichage de l'écran actif */}
      <View style={styles.screenContainer}>
        {currentTab === 'home' ? <TikTokFeed /> : <UploadScreen />}
      </View>

      {/* Barre de navigation fictive (Simule le bas de TikTok) */}
      <View style={styles.tabBar}>
        {/* Onglet Accueil */}
        <TouchableOpacity 
          style={styles.tabButton} 
          onPress={() => setCurrentTab('home')}
        >
          <Icon 
            name={currentTab === 'home' ? 'home' : 'home-outline'} 
            size={24} 
            color={currentTab === 'home' ? '#fff' : '#888'} 
          />
          <Text style={[styles.tabText, currentTab === 'home' && styles.activeTabText]}>
            Accueil
          </Text>
        </TouchableOpacity>

        {/* Onglet Créer (+) au milieu */}
        <TouchableOpacity 
          style={styles.createButtonContainer} 
          onPress={() => setCurrentTab('create')}
        >
          <View style={styles.createButton}>
            <Icon name="add" size={24} color="#000" />
          </View>
        </TouchableOpacity>

        {/* Onglet Profil (Fictif juste pour le visuel de l'exercice) */}
        <TouchableOpacity style={styles.tabButton} disabled>
          <Icon name="person-outline" size={24} color="#444" />
          <Text style={[styles.tabText, { color: '#444' }]}>Profil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#000',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: '#222',
    paddingBottom: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  tabText: {
    color: '#888',
    fontSize: 10,
    marginTop: 2,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  createButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 30,
  },
  createButton: {
    backgroundColor: '#fff',
    width: 45,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    // Petit effet de bordure colorée style TikTok
    borderLeftWidth: 3,
    borderLeftColor: '#00f2fe',
    borderRightWidth: 3,
    borderRightColor: '#ff0050',
  },
});