import { v2 as cloudinary } from 'cloudinary';

const initCloudinary = () => {
  if (!process.env.CLOUDINARY_API_KEY) {
    throw new Error('Cloudinary environment variables not loaded (API KEY MISSING)');
  }
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

export { cloudinary };

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string,
  publicId?: string
): Promise<{ url: string; publicId: string }> {
  initCloudinary();
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `influencer-connect/${folder}`,
        public_id: publicId,
        resource_type: 'auto',
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result!.secure_url, publicId: result!.public_id });
      }
    );
    uploadStream.end(fileBuffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  initCloudinary();
  await cloudinary.uploader.destroy(publicId);
}

export function getOptimizedUrl(publicId: string, width = 400, height = 400): string {
  initCloudinary();
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  });
}
