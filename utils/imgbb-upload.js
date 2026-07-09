const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function uploadToImgbb(screenshotPath) {
  try {
    const imageBuffer = fs.readFileSync(screenshotPath);
    const base64Image = imageBuffer.toString('base64');

    const formData = new FormData();
    formData.append('image', base64Image);
    formData.append('key', process.env.IMGBB_API_KEY);

    const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.data.success) {
      return {
        success: true,
        link: response.data.data.url,
        deleteUrl: response.data.data.delete_url,
      };
    } else {
      return { success: false, error: 'Upload failed' };
    }
  } catch (error) {
    console.error('ImgBB Upload Error:', error.message);
    return { success: false, error: error.message };
  }
}

module.exports = { uploadToImgbb };