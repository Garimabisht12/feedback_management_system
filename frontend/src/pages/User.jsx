import React from 'react';
import { useNavigate } from 'react-router-dom';


const User = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f7ff] to-[#e3f2ff] p-5">
      <div className="max-w-2xl w-full">

        {/* Header */}
        <div className="text-center mb-12">
          {/* logo */}
          <div className="w-26 h-26 mx-auto mb-6 bg-gradient-to-br from-[#93c5fd] to-[#60a5fa] rounded-full flex items-center justify-center shadow-[0_8px_24px_rgba(59,130,246,0.3)]">
            <img
              src='\cllg.jpeg'
              alt="cllg"
              className="w-24 h-24 object-cover rounded-full"
              loading="lazy"
            />
          </div>
          <h1 className="text-4xl font-bold text-[#1e3a8a] mb-3 tracking-tight">
            Welcome to Feedback System
          </h1>
          <p className="text-[#60a5fa] text-lg">Please select your user type to continue</p>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Student Card */}
          <div
            onClick={() => navigate('/studentLogin')}
            className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] p-8 cursor-pointer transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)] group"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] rounded-full flex items-center justify-center transition-all duration-300 group-hover:from-[#93c5fd] group-hover:to-[#60a5fa] group-hover:shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#3b82f6] transition-colors duration-300 group-hover:text-white">
                  <path d="M11.7 2.805a.75.75 0 01.6 0A60.65 60.65 0 0122.83 8.72a.75.75 0 01-.231 1.337 49.949 49.949 0 00-9.902 3.912l-.003.002-.34.18a.75.75 0 01-.707 0A50.009 50.009 0 007.5 12.174v-.224c0-.131.067-.248.172-.311a54.614 54.614 0 014.653-2.52.75.75 0 00-.65-1.352 56.129 56.129 0 00-4.78 2.589 1.858 1.858 0 00-.859 1.228 49.803 49.803 0 00-4.634-1.527.75.75 0 01-.231-1.337A60.653 60.653 0 0111.7 2.805z" />
                  <path d="M13.06 15.473a48.45 48.45 0 017.666-3.282c.134 1.414.22 2.843.255 4.285a.75.75 0 01-.46.71 47.878 47.878 0 00-8.105 4.342.75.75 0 01-.832 0 47.877 47.877 0 00-8.104-4.342.75.75 0 01-.461-.71c.035-1.442.121-2.87.255-4.286A48.4 48.4 0 016 15.473v.001c-.001.246-.154.986-.832 1.664-.142.142-.335.212-.521.212a.75.75 0 010-1.5c.147 0 .283-.052.392-.161.188-.188.316-.556.316-.915 0-.26.071-.516.206-.732a54.758 54.758 0 015.026-2.447A.75.75 0 0113.06 15.473z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-3">Student</h2>
              <p className="text-[#60a5fa] text-sm mb-6">
                Submit your feedback and help improve our institution
              </p>
              <div className="inline-flex items-center text-[#3b82f6] font-medium group-hover:text-[#2563eb]">
                <span>Continue as Student</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div
            onClick={() => navigate('/adminLogin')}
            className="bg-white rounded-2xl shadow-[0_8px_32px_rgba(59,130,246,0.15)] p-8 cursor-pointer transition-all duration-300 hover:translate-y-[-8px] hover:shadow-[0_12px_40px_rgba(59,130,246,0.25)] group"
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#dbeafe] to-[#bfdbfe] rounded-full flex items-center justify-center transition-all duration-300 group-hover:from-[#93c5fd] group-hover:to-[#60a5fa] group-hover:shadow-[0_4px_16px_rgba(59,130,246,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-[#3b82f6] transition-colors duration-300 group-hover:text-white">
                  <path fillRule="evenodd" d="M12 1.5a.75.75 0 01.75.75V4.5a.75.75 0 01-1.5 0V2.25A.75.75 0 0112 1.5zM5.636 4.636a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.06l-1.591-1.59a.75.75 0 010-1.061zm12.728 0a.75.75 0 010 1.06l-1.591 1.592a.75.75 0 01-1.06-1.061l1.59-1.591a.75.75 0 011.061 0zm-6.816 4.496a.75.75 0 01.82.311l5.228 7.917a.75.75 0 01-.777 1.148l-2.097-.43 1.045 3.9a.75.75 0 01-1.45.388l-1.044-3.899-1.601 1.42a.75.75 0 01-1.247-.606l.569-9.47a.75.75 0 01.554-.68zM3 10.5a.75.75 0 01.75-.75H6a.75.75 0 010 1.5H3.75A.75.75 0 013 10.5zm14.25 0a.75.75 0 01.75-.75h2.25a.75.75 0 010 1.5H18a.75.75 0 01-.75-.75zm-8.962 3.712a.75.75 0 010 1.061l-1.591 1.591a.75.75 0 11-1.061-1.06l1.591-1.592a.75.75 0 011.06 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-[#1e3a8a] mb-3">Admin</h2>
              <p className="text-[#60a5fa] text-sm mb-6">
                Manage feedback, faculty, and system settings
              </p>
              <div className="inline-flex items-center text-[#3b82f6] font-medium group-hover:text-[#2563eb]">
                <span>Continue as Admin</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-[#60a5fa] text-sm">© 2025 Feedback Management System</p>
        </div>
      </div>
    </div>
  );
};

export default User;
