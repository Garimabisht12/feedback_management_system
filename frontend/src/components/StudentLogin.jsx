import React from 'react';

const StudentLogin = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <h1 className="text-3xl font-bold text-indigo-700 mb-6">Student Login</h1>
      <div className="bg-white shadow-lg rounded-xl p-8 w-80">
        <input
          type="text"
          placeholder="Roll Number"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all">
          Login
        </button>
      </div>
    </div>
  );
};

export default StudentLogin;
