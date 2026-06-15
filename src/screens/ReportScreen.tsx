import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';

const REPORT_REASONS = [
  'Contenu haineux ou harcèlement',
  'Spam ou faux compte',
  'Atteinte à la propriété intellectuelle (Spotify/TikTok)',
  'Contenu inapproprié ou violent',
  'Autre motif',
];

export default function ReportScreen() {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) {
      Alert.alert('Erreur', 'Veuillez sélectionner un motif de signalement.');
      return;
    }
    // Logique d'envoi à l'API de modération
    Alert.alert('Signalement envoyé', 'Merci, notre équipe de modération va examiner votre demande.');
    setSelectedReason(null);
    setComment('');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Signaler un problème</Text>
      <Text style={styles.subtitle}>Pourquoi signalez-vous cet utilisateur ou ce contenu ?</Text>

      {REPORT_REASONS.map((reason, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.reasonItem, selectedReason === reason && styles.reasonItemSelected]}
          onPress={() => setSelectedReason(reason)}
        >
          <Text style={[styles.reasonText, selectedReason === reason && styles.reasonTextSelected]}>
            {reason}
          </Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.label}>Détails supplémentaires (optionnel)</Text>
      <TextInput
        style={styles.textInput}
        multiline
        numberOfLines={4}
        placeholder="Donnez-nous plus de précisions..."
        placeholderTextColor="#555"
        value={comment}
        onChangeText={setComment}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Soumettre le signalement</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  title: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginBottom: 8, marginTop: 10 },
  subtitle: { color: '#aaa', fontSize: 14, marginBottom: 20 },
  reasonItem: { backgroundColor: '#121212', padding: 16, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#222' },
  reasonItemSelected: { borderColor: '#FE2C55', backgroundColor: '#1a050a' },
  reasonText: { color: '#FFF', fontSize: 15 },
  reasonTextSelected: { color: '#FE2C55', fontWeight: '600' },
  label: { color: '#aaa', fontSize: 14, marginTop: 20, marginBottom: 8 },
  textInput: { backgroundColor: '#121212', color: '#FFF', padding: 12, borderRadius: 8, textAlignVertical: 'top', borderWidth: 1, borderColor: '#222', fontSize: 15 },
  submitButton: { backgroundColor: '#FE2C55', paddingVertical: 14, borderRadius: 8, marginTop: 30, alignItems: 'center' },
  submitText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
});