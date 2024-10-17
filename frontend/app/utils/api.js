// utils/api.js
export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error uploading file');
      }
  
      const result = await response.json();
      return result; // Assuming the API returns a JSON response with the summary
    } catch (error) {
      console.error('Failed to upload file:', error);
      throw error;
    }
  };
  