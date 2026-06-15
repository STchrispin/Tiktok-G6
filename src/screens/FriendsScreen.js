import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';

const initialFriends = [
  { id: '1', username: 'charli_d', name: 'Charli D.', avatar: 'https://picsum.photos/100' },
  { id: '2', username: 'khaby_lame', name: 'Khaby Lame', avatar: 'https://picsum.photos/101' },
  { id: '3', username: 'mr_beast', name: 'Mr Beast', avatar: 'https://picsum.photos/102' },
];

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [friends, setFriends] = useState(initialFriends);

  // Filtrer la liste des utilisateurs/amis selon la recherche
  const handleSearch = (text) => {
    setSearch(text);
    if (text === '') {
      setFriends(initialFriends);
    } else {
      const filtered = initialFriends.filter(friend => 
        friend.username.toLowerCase().includes(text.toLowerCase()) || 
        friend.name.toLowerCase().includes(text.toLowerCase())
      );
      setFriends(filtered);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes Amis & Recherche</Text>
      
      {/* Barre de Recherche Utilisateur */}
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher un utilisateur (ex: khaby)..."
        placeholderTextColor="#888"
        value={search}
        onChangeText={handleSearch}
      />

      {/* Liste de résultats */}
      <FlatList
        data={friends}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Aucun utilisateur trouvé</Text>}
        renderItem={({ item }) => (
          <View style={styles.friendRow}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.username}>@{item.username}</Text>
              <Text style={styles.name}>{item.name}</Text>
            </View>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionText}>Suivre</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 15 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 15, marginTop: 20 },
  searchBar: { backgroundColor: '#262626', color: '#fff', borderRadius: 10, padding: 12, marginBottom: 20, fontSize: 16 },
  friendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15, backgroundColor: '#121212', padding: 10, borderRadius: 10 },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  info: { flex: 1, marginLeft: 15 },
  username: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  name: { color: '#888', fontSize: 14 },
  actionButton: { backgroundColor: '#ff4365', paddingVertical: 6, paddingHorizontal: 15, borderRadius: 5 },
  actionText: { color: '#fff', fontWeight: 'bold' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: 20 }
});