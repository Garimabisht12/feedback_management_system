import React from 'react';
import { Link } from 'react-router-dom';

const Submitted = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50">
      <div className="bg-white shadow-md rounded-xl p-10 text-center">
        <h1 className="text-2xl font-semibold text-green-700 mb-2">
          Thank You for Your Response!
        </h1>
        <p className="text-gray-600">Your submission has been recorded successfully.</p>

        <div className="mt-6">
          <Link to='/'>
            ← Back to Home
          </Link>
          
        </div>
      </div>
    </div>
  );
};

export default Submitted;
