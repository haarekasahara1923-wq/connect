'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
  folder?: string;
}

export function ImageUpload({ onUpload, defaultImage, folder = 'general' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [showVideo, setShowVideo] = useState(false);

  // Sync preview with defaultImage when it changes
  useEffect(() => {
    if (defaultImage !== undefined) {
      setPreview(defaultImage || null);
      if (defaultImage?.includes('/video/upload/')) setShowVideo(true);
      else setShowVideo(false);
    }
  }, [defaultImage]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File too large (max 10MB)');
      return;
    }

    setIsUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setShowVideo(file.type.startsWith('video/'));

    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const contentType = res.headers.get('content-type');
      let data: any = {};
      if (contentType?.includes('application/json')) {
        data = await res.json();
      } else {
        throw new Error(`Upload Server Error (${res.status}).`);
      }

      if (!res.ok) throw new Error(data.error || 'Upload failed');
      
      onUpload(data.url);
      if (data.url.includes('/video/upload/')) setShowVideo(true);
      toast.success('Sync complete! Media uploaded.');
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
      setPreview(defaultImage || null);
    } finally {
      setIsUploading(false);
    }
  }, [folder, onUpload, defaultImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 
      'image/*': ['.jpeg', '.png', '.webp', '.jpg'],
      'video/*': ['.mp4', '.mov', '.webm']
    },
    maxFiles: 1,
    disabled: isUploading,
  });

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-muted/20">
          {showVideo ? (
            <video src={preview} className="w-full h-full object-cover" muted autoPlay loop />
          ) : (
            <img 
              src={preview} 
              alt="Upload preview" 
              className="w-full h-full object-cover" 
            />
          )}
          <button
            type="button"
            onClick={() => { setPreview(null); onUpload(''); setShowVideo(false); }}
            className="absolute top-2 right-2 p-1.5 bg-red-600/90 text-white rounded-md hover:bg-red-700 z-20"
          >
            <X className="w-4 h-4" />
          </button>
          {isUploading && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white z-10">
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Injecting Stream...</p>
            </div>
          )}
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
          }`}
        >
          <input {...getInputProps()} />
          <UploadCloud className="w-10 h-10 mb-3 text-gray-400" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold text-primary">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 uppercase font-black italic">Images or Videos (MP4/MOV) MAX. 10MB</p>
        </div>
      )}
    </div>
  );
}
