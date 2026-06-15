// src/components/tiktok/UploadScreen.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator, Alert, TextInput } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';

// Liste de musiques fictives pour simuler les "musiques de l'actualité"
const TRENDING_MUSICS = [
  { id: 'm1', title: 'Afrobeats Vibe 2026', artist: 'Burna Boy' },
  { id: 'm2', title: 'Acoustic Summer', artist: 'Lo-Fi Chill' },
  { id: 'm3', title: 'TikTok Techno Bass', artist: 'DJ Club' },
];

export const UploadScreen: React.FC = () => {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [selectedMusic, setSelectedMusic] = useState<typeof TRENDING_MUSICS[0] | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Prendre une vidéo en direct avec l'appareil photo
  const handleRecordVideo = async () => {
    const result: ImagePickerResponse = await launchCamera({
      mediaType: 'video',
      videoQuality: 'high',
      durationLimit: 30, // Limite à 30 secondes à la TikTok
    });

    if (result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri || null);
    }
  };

  // 2. Choisir une vidéo existante depuis la Galerie
  const handlePickFromGallery = async () => {
    const result: ImagePickerResponse = await launchImageLibrary({
      mediaType: 'video',
    });

    if (result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri || null);
    }
  };

  // 3. Processus de compression et téléversement (Cloudinary + Firebase)
  const handlePublish = async () => {
    if (!videoUri) {
      Alert.alert('Erreur', 'Veuillez d’abord enregistrer ou sélectionner une vidéo.');
      return;
    }

    setLoading(true);

    try {
      // Préparation du fichier pour Cloudinary
      const data = new FormData();
      data.append('file', {
        uri: videoUri,
        type: 'video/mp4',
        name: 'tiktok_clone_video.mp4',
      } as any);
      
      // Configuration Cloudinary pour la compression automatique à la volée (q_auto, f_auto)
      data.append('upload_preset', 'ton_upload_preset_cloudinary'); 

      // Envoi de la vidéo brute à Cloudinary
      const response = await fetch('https://api.cloudinary.com/v1_1/TON_CLOUD_NAME/video/upload', {
        method: 'POST',
        body: data,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const responseData = await response.json();
      const compressedVideoUrl = responseData.secure_url; // Cloudinary renvoie l'URL optimisée

      if (!compressedVideoUrl) throw new Error("Échec du téléversement sur Cloudinary");

      // Enregistrement des métadonnées dans Firebase Firestore
      await firestore().collection('videos').add({
        video_url: compressedVideoUrl,
        description: description || 'Pas de description',
        username: 'Lyslone_Dev', // Simulé en attendant le module Auth
        likes_count: 0,
        comments_count: 0,
        music_title: selectedMusic ? `${selectedMusic.title} - ${selectedMusic.artist}` : 'Son original',
        created_at: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Succès 🎉', 'Votre vidéo a été compressée et publiée !');
      
      // Réinitialisation de l'écran après publication
      setVideoUri(null);
      setDescription('');
      setSelectedMusic(null);

    } catch (error) {
      console.error(error);
      Alert.alert('Erreur', 'Impossible de publier la vidéo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Créer un TikTok</Text>

      {/* Zone de prévisualisation ou de choix de source */}
      {!videoUri ? (
        <View style={styles.sourceSelector}>
          <TouchableOpacity style={styles.captureButton} onPress={handleRecordVideo}>
            <Icon name="camera" size={40} color="#fff" />
            <Text style={styles.buttonText}>Caméra (Enregistrer)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.galleryButton} onPress={handlePickFromGallery}>
            <Icon name="images" size={40} color="#fff" />
            <Text style={styles.buttonText}>Galerie (Téléverser)</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>✓ Vidéo prête à être traitée</Text>
          <TouchableOpacity onPress={() => setVideoUri(null)}>
            <Text style={styles.changeVideoText}>Changer de vidéo</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sélection des musiques tendances */}
      <Text style={styles.sectionTitle}>Ajouter une musique de l'actualité :</Text>
      <View style={styles.musicContainer}>
        {TRENDING_MUSICS.map((music) => (
          <TouchableOpacity 
            key={music.id} 
            style={[styles.musicBadge, selectedMusic?.id === music.id && styles.selectedMusicBadge]}
            onPress={() => setSelectedMusic(music)}
          >
            <Icon name="musical-notes" size={16} color={selectedMusic?.id === music.id ? '#fff' : '#000'} />
            <Text style={[styles.musicText, selectedMusic?.id === music.id && styles.selectedMusicText]}>
              {music.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Saisie de la description */}
      <TextInput
        style={styles.input}
        placeholder="Écrivez une description avec des #hashtags..."
        placeholderTextColor="#666"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* Bouton de Publication */}
      <TouchableOpacity 
        style={[styles.publishButton, !videoUri && styles.disabledButton]} 
        onPress={handlePublish}
        disabled={loading || !videoUri}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.publishButtonText}>Compresser & Publier</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  sourceSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  captureButton: {
    backgroundColor: '#ff0050',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '45%',
  },
  galleryButton: {
    backgroundColor: '#00f2fe',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    width: '45%',
  },
  buttonText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  previewContainer: {
    backgroundColor: '#222',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  previewText: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  changeVideoText: {
    color: '#ff0050',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  musicContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  musicBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
  },
  selectedMusicBadge: {
    backgroundColor: '#ff0050',
  },
  musicText: {
    color: '#000',
    marginLeft: 5,
    fontSize: 12,
  },
  selectedMusicText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 10,
    padding: 15,
    height: 80,
    textAlignVertical: 'top',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
  },
  publishButton: {
    backgroundColor: '#ff0050',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#555',
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});