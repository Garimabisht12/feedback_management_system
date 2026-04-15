import React from 'react';
import { useNavigate } from 'react-router-dom';

const Responded = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
      <div className="bg-white shadow-md rounded-xl p-10 text-center">
        <h1 className="text-2xl font-semibold text-yellow-700 mb-2">
          Already Responded!
        </h1>
        <p className="text-gray-600">
          Your submission has been recorded successfully.
          Thank you for your time </p>

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

export default Responded;
