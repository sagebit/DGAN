import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { processImage } from '../services/imageService';

export const ImageUpload = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setProcessedImage(null);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleProcessImage = useCallback(async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await processImage(selectedImage);
      setProcessedImage(result);
    } catch (err) {
      setError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedImage]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {selectedImage && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Original Image</h3>
              <img
                src={selectedImage}
                alt="Original"
                className="w-full h-auto rounded-lg"
              />
              <button
                onClick={handleProcessImage}
                disabled={isProcessing}
                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isProcessing ? 'Processing...' : 'Process Image'}
              </button>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Processed Result</h3>
          {processedImage ? (
            <img
              src={processedImage}
              alt="Processed"
              className="w-full h-auto rounded-lg"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-500">
                {error || 'Processed image will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};