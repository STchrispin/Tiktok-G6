import auth from '@react-native-firebase/auth';
import { store } from '../../store';
import { setUser, logout } from '../../store/slices/authSlice';

export const firebaseAuth = {
  // Inscription
  register: async (email: string, password: string) => {
    const result = await auth().createUserWithEmailAndPassword(email, password);
    return result.user;
  },

  // Connexion
  login: async (email: string, password: string) => {
    const result = await auth().signInWithEmailAndPassword(email, password);
    return result.user;
  },

  // Déconnexion
  logout: async () => {
    await auth().signOut();
    store.dispatch(logout());
  },

  // Mot de passe oublié
  resetPassword: async (email: string) => {
    await auth().sendPasswordResetEmail(email);
  },

  // Observer l'état de connexion
  onAuthStateChanged: () => {
    return auth().onAuthStateChanged((user) => {
      if (user) {
        store.dispatch(setUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        }));
      } else {
        store.dispatch(logout());
      }
    });
  },
};
