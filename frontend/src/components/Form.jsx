import React from 'react';

const Form = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <h1 className="text-3xl font-semibold text-indigo-700 mb-8">Admission Form</h1>

      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>Session 2024-25</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>B.Tech</option>
            <option>MCA</option>
            <option>BCA</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>CSE</option>
            <option>ECE</option>
          </select>

          <select className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <option>1</option>
            <option>3</option>
            <option>5</option>
            <option>7</option>
          </select>
        </div>

        <h2 className="text-center text-gray-600 mb-6">The whole form goes here...</h2>

        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all">
          Submit
        </button>
      </div>
    </div>
  );
};

export default Form;
