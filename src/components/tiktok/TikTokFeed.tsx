import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  FlatList, View, StyleSheet, Text, Dimensions,
  TouchableOpacity, TouchableWithoutFeedback, Modal,
  TextInput, KeyboardAvoidingView, Platform, ScrollView, Alert, Share,
} from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../../services/supabase/config';

const { height, width } = Dimensions.get('window');

export const TikTokFeed: React.FC<{ isAuthenticated?: boolean }> = ({ isAuthenticated = false }) => {
  const navigation = useNavigation<any>();
  const [videos, setVideos] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pausedVideos, setPausedVideos] = useState<{ [key: string]: boolean }>({});
  const [likedVideos, setLikedVideos] = useState<{ [key: string]: boolean }>({});
  const [commentsModal, setCommentsModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState<{ [key: string]: number }>({});
  const [showHeart, setShowHeart] = useState<{ [key: string]: boolean }>({});
  const lastTap = useRef<{ [key: string]: number }>({});

  useEffect(() => { loadVideos(); }, []);

  const loadVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) { Alert.alert('Erreur', error.message); return; }
      if (data) {
        setVideos(data);
        const counts: { [key: string]: number } = {};
        data.forEach((v: any) => { counts[v.id] = v.comments || 0; });
        setCommentCount(counts);
      }
    } catch (e) {
      Alert.alert('Erreur réseau', 'Vérifiez votre connexion internet');
    }
  };

  const goToLogin = () => {
    setCommentsModal(false);
    setTimeout(() => {
      try {
        navigation.getParent()?.navigate('Connexion');
      } catch {
        navigation.navigate('Connexion' as never);
      }
    }, 300);
  };

  const goToProfil = (userId: string) => {
    try {
      navigation.getParent()?.navigate('Profil', { userId });
    } catch {
      navigation.navigate('Profil' as never, { userId } as never);
    }
  };

  const requireAuth = (action: () => void) => {
    if (!isAuthenticated) {
      Alert.alert('🔒 Connexion requise', 'Vous devez avoir un compte.', [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Se connecter', onPress: goToLogin },
      ]);
      return;
    }
    action();
  };

  const handleLike = async (videoId: string, currentLikes: number) => {
    requireAuth(async () => {
      const isLiked = likedVideos[videoId];
      const newLikes = isLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
      setLikedVideos(prev => ({ ...prev, [videoId]: !isLiked }));
      await supabase.from('videos').update({ likes: newLikes }).eq('id', videoId);
      loadVideos();
    });
  };

  const handleDoubleTap = (videoId: string, currentLikes: number) => {
    const now = Date.now();
    const lastTapTime = lastTap.current[videoId] || 0;
    if (now - lastTapTime < 300) {
      requireAuth(() => {
        if (!likedVideos[videoId]) handleLike(videoId, currentLikes);
        setShowHeart(prev => ({ ...prev, [videoId]: true }));
        setTimeout(() => setShowHeart(prev => ({ ...prev, [videoId]: false })), 800);
      });
    } else {
      setPausedVideos(prev => ({ ...prev, [videoId]: !prev[videoId] }));
    }
    lastTap.current[videoId] = now;
  };

  const handleShare = async (video: any) => {
    try {
      await Share.share({
        message: `Regarde cette vidéo sur TikTok G6 ! ${video.description || ''} ${video.url}`,
        url: video.url, title: 'TikTok G6',
      });
      await supabase.from('videos').update({ shares: (video.shares || 0) + 1 }).eq('id', video.id);
      loadVideos();
    } catch (e) { Alert.alert('Erreur', 'Impossible de partager'); }
  };

  const openComments = async (video: any) => {
    setSelectedVideo(video);
    const { data } = await supabase.from('comments').select('*')
      .eq('video_id', video.id).order('created_at', { ascending: true });
    setComments(data || []);
    setCommentsModal(true);
  };

  const addComment = async () => {
    if (!newComment.trim() || !selectedVideo) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('comments').insert({
      video_id: selectedVideo.id, user_id: user.id,
      username: user.email, text: newComment.trim(), likes: 0,
    });
    const newCount = (commentCount[selectedVideo.id] || 0) + 1;
    await supabase.from('videos').update({ comments: newCount }).eq('id', selectedVideo.id);
    setCommentCount(prev => ({ ...prev, [selectedVideo.id]: newCount }));
    setNewComment('');
    const { data } = await supabase.from('comments').select('*')
      .eq('video_id', selectedVideo.id).order('created_at', { ascending: true });
    setComments(data || []);
  };

  const onViewableItemsChanged = useCallback(({ viewableItems }: any) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index || 0);
  }, []);

  const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

  const renderVideo = ({ item, index }: any) => (
    <TouchableWithoutFeedback onPress={() => handleDoubleTap(item.id, item.likes)}>
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item.url }}
          style={styles.video}
          resizeMode="cover"
          repeat
          paused={pausedVideos[item.id] || index !== currentIndex}
        />
        {pausedVideos[item.id] && (
          <View style={styles.pauseOverlay}>
            <Text style={styles.pauseText}>⏸</Text>
          </View>
        )}
        {showHeart[item.id] && (
          <View style={styles.heartOverlay}>
            <Text style={styles.heartText}>❤️</Text>
          </View>
        )}
        <View style={styles.overlay}>
          <View style={styles.infoContainer}>
            <TouchableOpacity onPress={() => goToProfil(item.user_id)}>
              <Text style={styles.creator}>@{item.username || 'createur'}</Text>
            </TouchableOpacity>
            <Text style={styles.description}>{item.description}</Text>
            {item.sound ? <Text style={styles.sound}>🎵 {item.sound}</Text> : null}
          </View>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleLike(item.id, item.likes)}>
              <Text style={styles.actionIcon}>{likedVideos[item.id] ? '❤️' : '🤍'}</Text>
              <Text style={styles.actionText}>{Math.max(0, item.likes || 0)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => openComments(item)}>
              <Text style={styles.actionIcon}>💬</Text>
              <Text style={styles.actionText}>{commentCount[item.id] || 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => handleShare(item)}>
              <Text style={styles.actionIcon}>🚀</Text>
              <Text style={styles.actionText}>{item.shares || 0}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucune vidéo pour l'instant</Text>
          <TouchableOpacity onPress={loadVideos} style={styles.retryBtn}>
            <Text style={styles.retryText}>🔄 Réessayer</Text>
          </TouchableOpacity>
          <Text style={styles.emptySubText}>Publie ta première vidéo !</Text>
        </View>
      ) : (
        <FlatList
          data={videos}
          renderItem={renderVideo}
          keyExtractor={item => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
      )}
      <Modal visible={commentsModal} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={() => setCommentsModal(false)} />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>💬 {commentCount[selectedVideo?.id] || 0} Commentaires</Text>
              <TouchableOpacity onPress={() => setCommentsModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.commentsList}>
              {!isAuthenticated ? (
                <View style={styles.loginPrompt}>
                  <Text style={styles.loginPromptText}>
                    🔒 Connectez-vous pour voir et ajouter des commentaires
                  </Text>
                  <TouchableOpacity style={styles.loginPromptBtn} onPress={goToLogin}>
                    <Text style={styles.loginPromptLink}>Se connecter →</Text>
                  </TouchableOpacity>
                </View>
              ) : comments.length === 0 ? (
                <Text style={styles.noComments}>Aucun commentaire — soyez le premier !</Text>
              ) : (
                comments.map(comment => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentUsername}>{comment.username}</Text>
                    <Text style={styles.commentText}>{comment.text}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            {isAuthenticated && (
              <View style={styles.commentInput}>
                <TextInput
                  style={styles.input}
                  placeholder="Ajouter un commentaire..."
                  placeholderTextColor="#aaa"
                  value={newComment}
                  onChangeText={setNewComment}
                  onSubmitEditing={addComment}
                />
                <TouchableOpacity onPress={addComment}>
                  <Text style={styles.sendButton}>➤</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  videoContainer: { height: height - 55, width, backgroundColor: '#000' },
  video: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  pauseOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)',
  },
  pauseText: { fontSize: 60 },
  heartOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center',
  },
  heartText: { fontSize: 100 },
  overlay: {
    position: 'absolute', bottom: 20, left: 0, right: 0,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', padding: 15,
  },
  infoContainer: { flex: 1, marginRight: 10 },
  creator: { color: '#fff', fontSize: 15, fontWeight: 'bold', marginBottom: 4 },
  description: { color: '#fff', fontSize: 13, marginBottom: 4 },
  sound: { color: '#fff', fontSize: 11 },
  actionsContainer: { alignItems: 'center', gap: 15 },
  actionButton: { alignItems: 'center' },
  actionIcon: { fontSize: 30 },
  actionText: { color: '#fff', fontSize: 12, marginTop: 2 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#aaa', fontSize: 18, marginBottom: 10 },
  emptySubText: { color: '#fe2c55', fontSize: 14, marginTop: 10 },
  retryBtn: { backgroundColor: '#fe2c55', padding: 12, borderRadius: 25, marginTop: 15 },
  retryText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  modalContainer: { flex: 1 },
  modalBackdrop: { flex: 1 },
  modalContent: {
    backgroundColor: '#1a1a1a', borderTopLeftRadius: 20,
    borderTopRightRadius: 20, padding: 20, height: height * 0.85,
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15,
  },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  closeButton: { color: '#fff', fontSize: 20 },
  commentsList: { flex: 1 },
  loginPrompt: {
    alignItems: 'center', padding: 30, backgroundColor: '#222',
    borderRadius: 15, margin: 10, marginTop: 30,
  },
  loginPromptText: { color: '#fff', fontSize: 15, textAlign: 'center', marginBottom: 20 },
  loginPromptBtn: { backgroundColor: '#fe2c55', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  loginPromptLink: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  noComments: { color: '#aaa', textAlign: 'center', marginVertical: 20 },
  commentItem: { marginBottom: 15, paddingBottom: 10 },
  commentUsername: { color: '#fe2c55', fontSize: 13, fontWeight: 'bold' },
  commentText: { color: '#fff', fontSize: 14, marginTop: 3 },
  commentInput: { flexDirection: 'row', alignItems: 'center', marginTop: 15 },
  input: { flex: 1, backgroundColor: '#333', color: '#fff', padding: 10, borderRadius: 20, marginRight: 10 },
  sendButton: { color: '#fe2c55', fontSize: 24 },
});

export default TikTokFeed;
