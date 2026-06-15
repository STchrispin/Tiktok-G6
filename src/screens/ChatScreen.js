import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Salut ! Tu as vu ma dernière vidéo ?', sender: 'friend' },
    { id: '2', text: 'Grave ! Le montage est incroyable 🔥', sender: 'me' },
  ]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  // Envoyer un message
  const sendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'me',
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulation d'une réponse automatique (reception notification/message)
    setTimeout(() => {
      receiveMessage();
    }, 1500);
  };

  // Simuler la réception d'un message (TikTok style)
  const receiveMessage = () => {
    const reply = {
      id: Date.now().toString(),
      text: 'Merci ! Abonne-toi pour plus de contenu 😉',
      sender: 'friend',
    };
    setMessages(prev => [...prev, reply]);
    Alert.alert("Nouvelle notification", "Vous avez reçu un nouveau message de @TikTokUser");
  };

  // Fonction de Signalement (TikTok Safety)
  const handleReport = () => {
    Alert.alert(
      "Signaler l'utilisateur",
      "Pourquoi souhaitez-vous signaler cet utilisateur ?",
      [
        { text: "Contenu inapproprié", onPress: () => Alert.alert("Signalement envoyé", "Merci, nous allons analyser la situation.") },
        { text: "Harcèlement", onPress: () => Alert.alert("Signalement envoyé", "L'utilisateur a été signalé.") },
        { text: "Annuler", style: "cancel" }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {/* Header avec option de signalement */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>@TikTokUser</Text>
        <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
          <Text style={styles.reportText}>⚠️ Signaler</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        renderItem={({ item }) => (
          <View style={[
            styles.messageBubble, 
            item.sender === 'me' ? styles.myMessage : styles.friendMessage
          ]}>
            <Text style={styles.messageText}>{item.text}</Text>
          </View>
        )}
      />

      {/* Barre d'input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Envoyer un message privé..."
          placeholderTextColor="#666"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Envoyer</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { height: 60, backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 15, borderBottomWidth: 0.5, borderColor: '#333' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  reportButton: { padding: 5 },
  reportText: { color: '#ff4365', fontWeight: '600' },
  messageBubble: { padding: 12, borderRadius: 20, marginVertical: 5, maxWidth: '75%', marginHorizontal: 10 },
  myMessage: { backgroundColor: '#00f2fe', alignSelf: 'flex-end', borderBottomRightRadius: 0 },
  friendMessage: { backgroundColor: '#262626', alignSelf: 'flex-start', borderBottomLeftRadius: 0 },
  messageText: { color: '#fff', fontSize: 16 },
  inputContainer: { flexDirection: 'row', padding: 10, backgroundColor: '#121212', alignItems: 'center' },
  input: { flex: 1, backgroundColor: '#262626', color: '#fff', borderRadius: 25, paddingHorizontal: 15, height: 45 },
  sendButton: { marginLeft: 10, paddingHorizontal: 15 },
  sendButtonText: { color: '#00f2fe', fontWeight: 'bold', fontSize: 16 }
});