import React, { useState } from 'react';
import axios from 'axios';

const UploadSubjects = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please upload a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/upload-subjects', formData);
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error uploading file.');
    }
  };

  return (
    <div>
      <h2>Upload Subjects and Faculty</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {message && <p>{message}</p>}
      <p style={{ color: 'red' }}>Please ensure the file includes necessary values.</p>
    </div>
  );
};

export default UploadSubjects;