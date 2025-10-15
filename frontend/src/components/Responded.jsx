import React from 'react';

const Responded = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
      <div className="bg-white shadow-md rounded-xl p-10 text-center">
        <h1 className="text-2xl font-semibold text-yellow-700 mb-2">
          Already Responded!
        </h1>
        <p className="text-gray-600">Thank you for your time 😊</p>
      </div>
    </div>
  );
};

export default Responded;
