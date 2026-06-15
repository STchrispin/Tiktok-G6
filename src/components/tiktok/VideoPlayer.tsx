// src/components/tiktok/VideoPlayer.tsx
import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Video from 'react-native-video';

interface VideoPlayerProps {
  videoUrl: string;
  isPaused: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, isPaused }) => {
  return (
    <Video
      source={{ uri: videoUrl }}
      style={styles.video}
      resizeMode="cover"
      repeat={true}
      paused={isPaused}
      muted={false}
      playInBackground={false}
      playWhenInactive={false}
    />
  );
};

const styles = StyleSheet.create({
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});