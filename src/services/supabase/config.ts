import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kxcpojsnsfkmvyevcyhu.supabase.co';
const supabaseKey = 'sb_publishable_HOYGfACFbaFITkUJYOv2zQ_4wMvaz5O';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const Tables = {
  USERS: 'users',
  PROFILES: 'profiles',
  VIDEOS: 'videos',
  COMMENTS: 'comments',
  LIKES: 'likes',
  FOLLOWERS: 'followers',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications',
  SOUNDS: 'sounds',
};
