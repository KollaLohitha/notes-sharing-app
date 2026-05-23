import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signOut } from "firebase/auth";

import { auth } from "../firebase";

import { useAuth } from "../context/AuthContext";

const Topbar = ({ searchTerm, setSearchTerm }) => {

  const { user } = useAuth();

  const navigate = useNavigate();

  const [showMenu, setShowMenu] = useState(false);



  // LOGOUT

  const handleLogout = async () => {

    try {

      await signOut(auth);

      navigate("/login");

    } catch (error) {
      console.log(error);
    }
  };



  return (
    <div className="w-full bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">

      {/* Search Bar */}

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full md:w-96 bg-gray-800 text-white px-4 py-3 rounded-xl outline-none border border-gray-700 focus:border-blue-500"
      />



      {/* Profile */}

      <div className="relative ml-5">

        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg"
        >
          {user?.email?.charAt(0).toUpperCase()}
        </button>



        {/* Dropdown */}

        {showMenu && (

          <div className="absolute right-0 mt-3 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden z-50">

            <button
              className="w-full text-left px-4 py-3 hover:bg-gray-700 transition"
            >
              Edit Profile
            </button>



            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 hover:bg-red-600 transition"
            >
              Logout
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default Topbar;