import React, { useState } from 'react';
import axios from '../../api/axios';
import * as XLSX from 'xlsx';

const UploadSubjects = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage('Please upload an Excel file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      try {
        const response = await axios.post('/admin/uploadSubjects', jsonData);
        setMessage(`✓ ${response.data.message} (${response.data.subjectsAdded} subjects, ${response.data.facultyUpdated} faculty updated)`);
        setFile(null);
      } catch (error) {
        console.error('Error uploading data:', error);
        setMessage(`✗ Error: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Upload Subjects and Faculty</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
        Upload
      </button>
      {message && <p className="text-red-500 mt-2">{message}</p>}
      <p className="text-red-500 mt-2">Note: Ensure the Excel sheet includes necessary fields.</p>
    </div>
  );
};

export default UploadSubjects;