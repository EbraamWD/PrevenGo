import { v2 as cloudinary } from 'cloudinary';
import { config } from 'dotenv';
config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const cloudinaryService = {
  async uploadLogo(file) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'prevengo/logos',
      use_filename: true,
      unique_filename: true
    });
    return result.secure_url;
  },

  async deleteFile(publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
};

export default cloudinaryService;
