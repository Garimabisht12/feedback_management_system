import React from 'react';

import { useNavigate } from 'react-router-dom';

const User = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <h1 className="text-3xl font-semibold text-indigo-700 mb-8">Select User Type</h1>
      <ul className="flex gap-6">
        <li>
          <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all" onClick={()=>navigate('/studentLogin')}>
            Student
          </button>
        </li>
        <li>
          <button className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-md transition-all" onClick={()=>navigate('/adminLogin')}>
            Admin
          </button>
        </li>
      </ul>
    </div>
  );
};

export default User;
