import React from "react";
import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  CameraIcon,
  BookOpenIcon,
  UserIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";

const Sidebar = () => {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-900 text-white p-1 flex justify-around md:fixed md:w-64 md:h-full md:flex-col md:items-start md:p-6">
      
      {/* Dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 rounded-md ${
            isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
          }`
        }
      >
        <HomeIcon className="h-6 w-6" />
        <span className="text-xs">Dashboard</span>
      </NavLink>

      {/* Scan Book */}
      <NavLink
        to="/scan"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 rounded-md ${
            isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
          }`
        }
      >
        <CameraIcon className="h-6 w-6" />
        <span className="text-xs">Scan</span>
      </NavLink>

      {/* Library */}
      <NavLink
        to="/library"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 rounded-md ${
            isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
          }`
        }
      >
        <BookOpenIcon className="h-6 w-6" />
        <span className="text-xs">Library</span>
      </NavLink>

      {/* Profile */}
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 rounded-md ${
            isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
          }`
        }
      >
        <UserIcon className="h-6 w-6" />
        <span className="text-xs">Profile</span>
      </NavLink>

      {/* Settings */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center p-2 rounded-md ${
            isActive ? "text-yellow-400 font-bold" : "hover:text-yellow-300"
          }`
        }
      >
        <Cog6ToothIcon className="h-6 w-6" />
        <span className="text-xs">Settings</span>
      </NavLink>

    </nav>
  );
};

export default Sidebar;
