import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Video {
  id: string;
  url: string;
  thumbnail: string;
  description: string;
  userId: string;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
}

interface VideoState {
  videos: Video[];
  currentVideo: Video | null;
  isLoading: boolean;
}

const initialState: VideoState = {
  videos: [],
  currentVideo: null,
  isLoading: false,
};

const videoSlice = createSlice({
  name: 'video',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
    },
    setCurrentVideo: (state, action: PayloadAction<Video>) => {
      state.currentVideo = action.payload;
    },
    addVideo: (state, action: PayloadAction<Video>) => {
      state.videos.unshift(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    likeVideo: (state, action: PayloadAction<string>) => {
      const video = state.videos.find(v => v.id === action.payload);
      if (video) video.likes += 1;
    },
  },
});

export const { setVideos, setCurrentVideo, addVideo, setLoading, likeVideo } = videoSlice.actions;
export default videoSlice.reducer;
