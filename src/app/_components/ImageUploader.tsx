"use client";
import React, { useState } from "react";
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import api from "../utils/api";
import Image from "next/image";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch(`${api}/image-auth`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}: ${errorText}`
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Authentication request failed: ${error.message}`);
    } else {
      throw new Error("Authentication request failed");
    }
  }
};

interface ImageUploaderProps {
  onUploadComplete: (url: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUploadComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onError = (err: any) => {
    console.error("Error", err);
    setError("Failed to upload image. Please try again.");
    setIsUploading(false);
  };

  const onSuccess = (res: any) => {
    console.log("Success", res);
    const imageUrl = res.url;
    setUploadedUrl(imageUrl);
    setIsUploading(false);
    onUploadComplete(imageUrl); // Call the callback with the uploaded URL
  };

  const onUploadStart = () => {
    setIsUploading(true);
    setError(null);
  };

  const handleRemoveImage = () => {
    setUploadedUrl(null);
    setPreview(null);
    // Optionally notify parent component about removal
    onUploadComplete('');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    // Create FormData
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.url) {
        throw new Error('No URL received from upload');
      }

      // Create preview
      setPreview(URL.createObjectURL(file));
      onUploadComplete(data.url);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      {error && (
        <p className="text-red-500 text-sm mb-2">{error}</p>
      )}
      
      {uploadedUrl || preview ? (
        <div className="relative flex h-64 rounded-lg overflow-hidden group">
          <img
            src={uploadedUrl || preview || undefined}
            alt="Uploaded image"
            className="object-cover rounded-lg"
          />
          <div className="absolute bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
            >
              Remove & Re-upload
            </button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <ImageKitProvider
            publicKey={publicKey}
            urlEndpoint={urlEndpoint}
            authenticator={authenticator}
          >
            <IKUpload
              fileName="incident-image.png"
              onError={onError}
              onSuccess={onSuccess}
              onUploadStart={onUploadStart}
              disabled={isUploading}
              className={`w-full p-2 border-2 border-dashed rounded-lg 
                ${isUploading ? 'opacity-50 cursor-not-allowed' : 'border-gray-300 hover:border-blue-500'}
              `}
            />
          </ImageKitProvider>
          
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-sm text-gray-600">Uploading...</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
