import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { supabase } from '../../services/supabase/config';

const Statistics = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalComments: 0,
    totalLikes: 0,
    totalMessages: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const { count: usersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact' });

    const { count: videosCount } = await supabase
      .from('videos')
      .select('*', { count: 'exact' });

    const { count: commentsCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact' });

    const { count: likesCount } = await supabase
      .from('likes')
      .select('*', { count: 'exact' });

    const { count: messagesCount } = await supabase
      .from('messages')
      .select('*', { count: 'exact' });

    setStats({
      totalUsers: usersCount || 0,
      totalVideos: videosCount || 0,
      totalComments: commentsCount || 0,
      totalLikes: likesCount || 0,
      totalMessages: messagesCount || 0,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Statistiques TikTok G6</Text>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>👥 Utilisateurs totaux</Text>
        <Text style={styles.statNumber}>{stats.totalUsers}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>🎥 Vidéos publiées</Text>
        <Text style={styles.statNumber}>{stats.totalVideos}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>💬 Commentaires</Text>
        <Text style={styles.statNumber}>{stats.totalComments}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>❤️ Likes totaux</Text>
        <Text style={styles.statNumber}>{stats.totalLikes}</Text>
      </View>

      <View style={styles.statCard}>
        <Text style={styles.statLabel}>✉️ Messages envoyés</Text>
        <Text style={styles.statNumber}>{stats.totalMessages}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    color: '#fff',
    fontSize: 16,
  },
  statNumber: {
    color: '#fe2c55',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default Statistics;
