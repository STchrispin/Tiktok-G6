import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';
import { audioService, Sound } from '../../services/firebase/audio';

const SoundListScreen = ({ navigation }: any) => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSounds();
  }, []);

  const loadSounds = async () => {
    setLoading(true);
    const data = await audioService.getAllSounds();
    setSounds(data);
    setLoading(false);
  };

  const handleSearch = async (text: string) => {
    setSearch(text);
    if (text.length > 2) {
      const results = await audioService.searchSounds(text);
      setSounds(results);
    } else if (text.length === 0) {
      loadSounds();
    }
  };

  const renderSound = ({ item }: { item: Sound }) => (
    <TouchableOpacity
      style={styles.soundItem}
      onPress={() => navigation.navigate('SoundPlayer', { sound: item })}
    >
      <View style={styles.soundInfo}>
        <Text style={styles.soundTitle}>{item.title}</Text>
        <Text style={styles.soundArtist}>{item.artist}</Text>
        <Text style={styles.soundUsage}>{item.usageCount} utilisations</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Rechercher un son..."
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={sounds}
        renderItem={renderSound}
        keyExtractor={item => item.id}
        refreshing={loading}
        onRefresh={loadSounds}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    margin: 10,
    borderRadius: 8,
  },
  soundItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  soundInfo: {
    flex: 1,
  },
  soundTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  soundArtist: {
    color: '#aaa',
    fontSize: 14,
  },
  soundUsage: {
    color: '#fe2c55',
    fontSize: 12,
  },
});

export default SoundListScreen;
