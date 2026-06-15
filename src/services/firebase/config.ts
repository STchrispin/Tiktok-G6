import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import analytics from '@react-native-firebase/analytics';

export const Collections = {
  USERS: 'users',
  VIDEOS: 'videos',
  COMMENTS: 'comments',
  LIKES: 'likes',
  FOLLOWERS: 'followers',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  REPORTS: 'reports',
  SOUNDS: 'sounds',
};

export const db = firestore();
export const firebaseAuth = auth();
export const firebaseMessaging = messaging();
export const firebaseAnalytics = analytics();
