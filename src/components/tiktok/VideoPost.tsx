// src/components/tiktok/VideoPost.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Share } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { VideoPlayer } from './VideoPlayer';
import Icon from 'react-native-vector-icons/Ionicons';

interface VideoData {
  id: string;
  video_url: string;
  description: string;
  username: string;
  likes_count: number;
  comments_count: number;
}

interface VideoPostProps {
  item: VideoData;
  isPaused: boolean;
}

export const VideoPost: React.FC<VideoPostProps> = ({ item, isPaused }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(item.likes_count);

  // Gestion du Like avec Firebase
  const handleLike = async () => {
    const videoRef = firestore().collection('videos').doc(item.id);
    if (!liked) {
      setLiked(true);
      setLikesCount(prev => prev + 1);
      await videoRef.update({ likes_count: firestore.FieldValue.increment(1) });
    } else {
      setLiked(false);
      setLikesCount(prev => prev - 1);
      await videoRef.update({ likes_count: firestore.FieldValue.increment(-1) });
    }
  };

  // Gestion du Partage natif
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Regarde cette vidéo TikTok : ${item.video_url}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Lecteur Vidéo */}
      <VideoPlayer videoUrl={item.video_url} isPaused={isPaused} />

      {/* Interface Overlay (Boutons à droite) */}
      <View style={styles.rightButtons}>
        <TouchableOpacity style={styles.button} onPress={handleLike}>
          <Icon name="heart" size={40} color={liked ? '#ff0050' : '#fff'} />
          <Text style={styles.buttonText}>{likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Icon name="chatbubble-ellipses" size={40} color="#fff" />
          <Text style={styles.buttonText}>{item.comments_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleShare}>
          <Icon name="paper-plane" size={35} color="#fff" />
          <Text style={styles.buttonText}>Partager</Text>
        </TouchableOpacity>
      </View>

      {/* Informations textuelles (En bas à gauche) */}
      <View style={styles.bottomTextContainer}>
        <Text style={styles.username}>@{item.username}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
    backgroundColor: '#000',
  },
  rightButtons: {
    position: 'absolute',
    bottom: 100,
    right: 15,
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
  },
  bottomTextContainer: {
    position: 'absolute',
    bottom: 40,
    left: 15,
    right: 100,
  },
  username: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  description: {
    color: '#fff',
    fontSize: 14,
  },
});