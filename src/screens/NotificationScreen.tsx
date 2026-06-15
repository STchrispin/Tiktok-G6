import React from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';

interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow';
  username: string;
  avatar: string;
  details: string;
  time: string;
  mediaPreview?: string; // Miniature de la vidéo si applicable
}

const NOTIF_DATA: NotificationItem[] = [
  { id: '1', type: 'like', username: 'clara_rock', avatar: 'https://via.placeholder.com/50', details: 'a aimé ta vidéo avec le son Spotify.', time: '2h', mediaPreview: 'https://via.placeholder.com/40x60' },
  { id: '2', type: 'follow', username: 'thomas_mix', avatar: 'https://via.placeholder.com/50', details: 'a commencé à te suivre.', time: '5h' },
  { id: '3', type: 'comment', username: 'justine_d', avatar: 'https://via.placeholder.com/50', details: 'a commenté : "Incroyable ce mashup ! 🔥"', time: '1j', mediaPreview: 'https://via.placeholder.com/40x60' },
];

export default function NotificationScreen() {
  const renderItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity style={styles.notifItem}>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <div style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
        <Text style={styles.notifText}>
          <Text style={styles.boldUsername}>{item.username} </Text>
          {item.details}
          <Text style={styles.time}> {item.time}</Text>
        </Text>
      </div>
      {item.mediaPreview ? (
        <Image source={{ uri: item.mediaPreview }} style={styles.mediaPreview} />
      ) : item.type === 'follow' ? (
        <TouchableOpacity style={styles.followBackBtn}>
          <Text style={styles.followBackText}>Suivre</Text>
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Toutes les activités</Text>
      </View>
      <FlatList
        data={NOTIF_DATA}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { height: 60, justifyContent: 'center', alignItems: 'center', borderBottomWidth: 0.5, borderColor: '#222' },
  headerTitle: { color: '#FFF', fontSize: 17, fontWeight: '600' },
  list: { paddingHorizontal: 16 },
  notifItem: { flexDirection: 'row', paddingVertical: 12, alignItems: 'center' },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  notifText: { color: '#FFF', fontSize: 14, lineHeight: 18 },
  boldUsername: { fontWeight: '700' },
  time: { color: '#666', fontSize: 13 },
  mediaPreview: { width: 40, height: 56, borderRadius: 4, backgroundColor: '#333' },
  followBackBtn: { backgroundColor: '#FE2C55', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 4 },
  followBackText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
});