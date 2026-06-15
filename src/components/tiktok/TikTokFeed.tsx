// src/components/tiktok/TikTokFeed.tsx
import React, { useEffect, useState, useRef } from 'react';
import { FlatList, View, StyleSheet, Dimensions, ViewToken } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { VideoPost } from './VideoPost';

export const TikTokFeed: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  
  // Récupération des vidéos depuis Firebase Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('videos')
      .orderBy('created_at', 'desc')
      .onSnapshot(querySnapshot => {
        const videoList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setVideos(videoList);
        if (videoList.length > 0 && !activeId) {
          setActiveId(videoList[0].id);
        }
      });

    return () => unsubscribe();
  }, []);

  // Détection de la vidéo visible à l'écran pour l'historique et la lecture
  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const currentId = viewableItems[0].item.id;
      setActiveId(currentId);

      // Logique de l'historique : Ajouter à la collection "history"
      firestore().collection('history').add({
        video_id: currentId,
        watched_at: firestore.FieldValue.serverTimestamp(),
        // user_id: 'ID_DE_L_UTILISATEUR_CONNECTE' (À lier avec le module Auth de ton collègue)
      });
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 80, // La vidéo doit être visible à 80% pour se lancer
  }).current;

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={({ item }) => (
          <VideoPost item={item} isPaused={item.id !== activeId} />
        )}
        keyExtractor={item => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        windowSize={3}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});