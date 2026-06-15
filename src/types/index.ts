// Types utilisateur
export interface User {
  id: string;
  username: string;
  email: string;
  photoURL: string;
  bio: string;
  followers: number;
  following: number;
  likes: number;
  createdAt: string;
}

// Types vidéo
export interface Video {
  id: string;
  url: string;
  thumbnail: string;
  description: string;
  userId: string;
  username: string;
  likes: number;
  comments: number;
  shares: number;
  sound: string;
  createdAt: string;
}

// Types commentaire
export interface Comment {
  id: string;
  videoId: string;
  userId: string;
  username: string;
  photoURL: string;
  text: string;
  likes: number;
  createdAt: string;
}

// Types notification
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  fromUserId: string;
  fromUsername: string;
  fromPhotoURL: string;
  videoId?: string;
  message?: string;
  isRead: boolean;
  createdAt: string;
}

// Types message
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

// Types navigation
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Feed: undefined;
  Search: undefined;
  Upload: undefined;
  Messages: undefined;
  Profile: { userId?: string };
  Comments: { videoId: string };
  Chat: { userId: string; username: string };
};
