import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { supabase } from '../../services/supabase/config';

const AdminDashboard = ({ navigation }: any) => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVideos: 0,
    totalReports: 0,
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

    const { count: reportsCount } = await supabase
      .from('reports')
      .select('*', { count: 'exact' });

    setStats({
      totalUsers: usersCount || 0,
      totalVideos: videosCount || 0,
      totalReports: reportsCount || 0,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Administrateur</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalUsers}</Text>
          <Text style={styles.statLabel}>Utilisateurs</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalVideos}</Text>
          <Text style={styles.statLabel}>Vidéos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.totalReports}</Text>
          <Text style={styles.statLabel}>Signalements</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('UsersManagement')}
      >
        <Text style={styles.menuText}>👥 Gestion des utilisateurs</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Statistics')}
      >
        <Text style={styles.menuText}>📊 Statistiques</Text>
      </TouchableOpacity>
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
  },
  statNumber: {
    color: '#fe2c55',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  menuItem: {
    backgroundColor: '#1a1a1a',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default AdminDashboard;
