import React from 'react';
import { ImageUpload } from './components/ImageUpload';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Image Denoising with GAN
        </h1>
        <p className="text-lg text-gray-600">
          Upload a noisy image and let our AI remove the noise
        </p>
      </div>
      <ImageUpload />
    </div>
  );
}

export default App;