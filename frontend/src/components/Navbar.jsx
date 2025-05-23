import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut, Settings, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const Navbar = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();
  const menuref = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuref.current && !menuref.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleMenuToggle = () => {
    setMenuOpen((prev) => !prev);
  };
  const handleLogout = () => {
    setMenuOpen(false);
    onLogout();
  };
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-4 py-2">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigate("/")}
        >
          {/* Logo */}
          <div
            className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-500
        to-indigo-500 shadow-lg group-hover:shadow-purple-300/50 transition-all group-hover:scale-105"
          >
            <Zap className="w-6 h-6 text-white" />
            <div className="absolute -bottom-1 -middle-1 w-3 h-3 bg-white rounded-full shadow-md animate-ping" />
          </div>
          {/* Brand Name */}
          <span
            className="text-2xl font-extrabold bg-gradient-to-r from-fuchsia-500
          via-purple-500 to-indigo-500 bg-clip-text  tracking-wide"
          >
            Task
          </span>
        </div>
        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 text-gray-600 hover:text-purple-500 transition-colors duration-300
           hover:bg-purple-50 rounded-full"
            onClick={() => navigate("/profile")}
          >
            <Settings className="w-5 h-5" />
          </button>
          {/* User DropDown */}
          <div ref={menuref} className="relative">
            <button
              onClick={handleMenuToggle}
              className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer  hover:bg-purple-50
                transition-colors duration-300 border border-transparent hover:border-purple-200"
            >
              <div className="relative">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full object-cover shadow-sm"
                  />
                ) : (
                  <div
                    className="w-8 h-8 flex items-center justify-center rounded-full
                             bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white font-semibold shadow-md"
                  >
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                )}
              </div>
              <div
                className="absolute -bottom-0.5 right-33 w-3 h-3 bg-green-400 
                  rounded-full border-2 border-white shadow-md animate-ping"
              ></div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user.name}</p>
                <p className="text-xs font-normal text-gray-500">
                  {user.email}
                </p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-300
                  ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>
            {menuOpen && (
              <ul
                className="absolute right-0 top-14 mt-2 w-56 bg-white rounded-2xl shadow-xl
                        border border-purple-100 z-50 overflow-hidden animate-fadeIn"
              >
                <li className="p-2">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full px-4 py-2.5 text-left hover:bg-purple-50 text-sm
                                text-gray-700 flex items-center gap-2 group transition-colors duration-300"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4 text-gray-700" />
                    Profile Settings
                  </button>
                </li>
                <li className="p-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-3 py-2 rounded-lg 
                           hover:bg-red-50 text-sm text-red-600"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4 " />
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
