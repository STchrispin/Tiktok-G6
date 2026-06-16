import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { supabase } from '../../services/supabase/config';

const ForgotPasswordScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) Alert.alert('Erreur', error.message);
    else Alert.alert('Succès', 'Email de réinitialisation envoyé !');
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mot de passe oublié</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleReset}>
        <Text style={styles.buttonText}>
          {loading ? 'Envoi...' : 'Réinitialiser'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Retour à la connexion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    color: '#fe2c55',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#fe2c55',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  link: {
    color: '#aaa',
    marginTop: 10,
  },
});

export default ForgotPasswordScreen;
