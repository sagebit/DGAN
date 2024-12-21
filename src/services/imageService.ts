import axios from 'axios';

const COLAB_URL = 'https://07ec-34-57-55-7.ngrok-free.app'; // Replace with your ngrok URL

export const processImage = async (imageData: string) => {
  try {
    const response = await axios.post(`${COLAB_URL}/process-image`, {
      image: imageData
    });
    return response.data.processedImage;
  } catch (error) {
    console.error('Error processing image:', error);
    throw error;
  }
};