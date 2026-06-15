import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { audioService, Sound } from '../../services/firebase/audio';

const SoundPlayerScreen = ({ route, navigation }: any) => {
  const { sound } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioService.incrementUsage(sound.id);
  }, []);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleUseSound = () => {
    navigation.navigate('Upload', { sound });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{sound.title}</Text>
      <Text style={styles.artist}>{sound.artist}</Text>
      <Text style={styles.duration}>{sound.duration}s</Text>

      <TouchableOpacity style={styles.playButton} onPress={handlePlay}>
        <Text style={styles.playButtonText}>
          {isPlaying ? '⏸ Pause' : '▶ Jouer'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.useButton} onPress={handleUseSound}>
        <Text style={styles.useButtonText}>
          Utiliser ce son
        </Text>
      </TouchableOpacity>

      <Text style={styles.usage}>
        {sound.usageCount} vidéos utilisent ce son
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  artist: {
    color: '#aaa',
    fontSize: 18,
    marginBottom: 10,
  },
  duration: {
    color: '#aaa',
    fontSize: 14,
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: '#fe2c55',
    padding: 15,
    borderRadius: 50,
    width: 150,
    alignItems: 'center',
    marginBottom: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  useButton: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 8,
    width: 200,
    alignItems: 'center',
    marginBottom: 20,
  },
  useButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  usage: {
    color: '#aaa',
    fontSize: 14,
  },
});

export default SoundPlayerScreen;
