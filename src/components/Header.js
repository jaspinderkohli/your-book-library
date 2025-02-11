import React from "react";

const Header = ({ userEmail, onLogout }) => {
  return (
    <div className="w-full bg-white shadow-md p-4 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
      <h2 className="text-xl font-semibold">📚 Your Library</h2>

      <div className="flex items-center gap-4 mt-2 md:mt-0">
        {/* Show email on larger screens, hide on mobile */}
        <p className="text-gray-600 hidden sm:block">Logged in as: {userEmail}</p>

        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
