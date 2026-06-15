const cloudinaryConfig = {
  cloudName: 'VOTRE_CLOUD_NAME',
  apiKey: 'VOTRE_API_KEY',
  apiSecret: 'VOTRE_API_SECRET',
  uploadPreset: 'tiktok_videos',
};

export const uploadVideo = async (videoUri: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: videoUri,
    type: 'video/mp4',
    name: 'video.mp4',
  } as any);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/video/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};

export const uploadImage = async (imageUri: string) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'image.jpg',
  } as any);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  const data = await response.json();
  return data.secure_url;
};

export default cloudinaryConfig;
