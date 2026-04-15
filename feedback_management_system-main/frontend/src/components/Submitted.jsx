import React from 'react';
import { useNavigate } from 'react-router-dom';

const Submitted = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white shadow-md rounded-xl p-10 text-center">
        <h1 className="text-2xl font-semibold text-green-700 mb-2">
          Thank You for Your Response!
        </h1>
        <p className="text-gray-600">Your submission has been recorded successfully.</p>

        <div className="mt-6">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 mt-4 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submitted;
