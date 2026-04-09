import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { useLogout } from "../../features/auth/hooks/useLogout";
import { Button } from "../ui/Button";
// Importera Cog6ToothIcon från Heroicons
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { handleLogout } = useLogout();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const isAuthPage = location.pathname.startsWith("/auth");

  // Stänger menyn om man klickar utanför
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full h-[80px] px-6 py-4 flex justify-between items-center relative border-b border-gray-100">
      {/* Vänster - Logotyp/Hem */}
      <div className="flex items-center">
        {!user && isHomePage && (
          <Link to="/about">
            <Button variant="secondary">Om oss</Button>
          </Link>
        )}
        {!user && isAuthPage && (
          <Link to="/">
            <img src="/src/assets/logo.svg" alt="Home" className="w-14 h-14" />
          </Link>
        )}
        {user && (
          <Link to="/dashboard">
            <img
              src="/src/assets/logo.svg"
              alt="Dashboard"
              className="w-14 h-14"
            />
          </Link>
        )}
      </div>

      {/* Höger */}
      <div className="flex items-center gap-4">
        {!user && (isHomePage || isAuthPage) && (
          <Link to={isHomePage ? "/auth" : "/about"}>
            <Button variant={isHomePage ? "primary" : "secondary"}>
              {isHomePage ? "Logga in" : "Om oss"}
            </Button>
          </Link>
        )}

        {user && (
          <div className="relative" ref={menuRef}>
            {/* Kugghjuls-knapp */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-primary hover:bg-orange-500 transition-colors flex items-center justify-center outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Inställningar"
            >
              <Cog6ToothIcon className="w-6 h-6 text-white" />
            </button>

            {/* Dropdown-menyn */}
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 transform origin-top-right transition-all">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400 uppercase font-semibold">
                    Konto
                  </p>
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user.email}
                  </p>
                </div>

                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Kontoinställningar
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  Logga ut
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
