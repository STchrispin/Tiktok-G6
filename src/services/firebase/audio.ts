import firestore from '@react-native-firebase/firestore';
import { Collections } from './config';

export interface Sound {
  id: string;
  title: string;
  artist: string;
  url: string;
  coverUrl: string;
  duration: number;
  usageCount: number;
  createdAt: string;
}

export const audioService = {
  // Récupérer tous les sons
  getAllSounds: async (): Promise<Sound[]> => {
    const snapshot = await firestore()
      .collection(Collections.SOUNDS)
      .orderBy('usageCount', 'desc')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Sound[];
  },

  // Rechercher un son
  searchSounds: async (query: string): Promise<Sound[]> => {
    const snapshot = await firestore()
      .collection(Collections.SOUNDS)
      .where('title', '>=', query)
      .where('title', '<=', query + '\uf8ff')
      .get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Sound[];
  },

  // Récupérer un son par ID
  getSoundById: async (soundId: string): Promise<Sound | null> => {
    const doc = await firestore()
      .collection(Collections.SOUNDS)
      .doc(soundId)
      .get();
    if (!doc.exists) return null;
    return { id: doc.id, ...doc.data() } as Sound;
  },

  // Incrémenter le compteur d'utilisation
  incrementUsage: async (soundId: string): Promise<void> => {
    await firestore()
      .collection(Collections.SOUNDS)
      .doc(soundId)
      .update({ usageCount: firestore.FieldValue.increment(1) });
  },
};
