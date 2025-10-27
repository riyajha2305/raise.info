"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage, languages } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { currentLanguage, setLanguage, t } = useLanguage();
  const { user, signOut, openAuthModal } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-dropdown')) {
        setIsLanguageDropdownOpen(false);
      }
      if (!target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (language: typeof languages[0]) => {
    setLanguage(language);
    setIsLanguageDropdownOpen(false);
  };

  return (
    <nav className="bg-gradient-to-r from-slate-200 to-slate-300 shadow-lg border-b border-slate-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg overflow-hidden group-hover:scale-105 transition-transform">
                <img 
                  src="/icon.png" 
                  alt="Salaris.fyi Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-2xl font-bold text-slate-700 group-hover:text-slate-800 transition-colors">
                salaris.fyi
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Community Link */}
            <Link
              href="/community"
              className="text-slate-600 hover:text-slate-800 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-200/50"
            >
              {t("nav.community")}
            </Link>

            {/* Internships Link */}
            <Link
              href="/internships"
              className="text-slate-600 hover:text-slate-800 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-200/50"
            >
              {t("nav.internships")}
            </Link>

            {/* University Data Link */}
            <Link
              href="/university-data"
              className="text-slate-600 hover:text-slate-800 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-200/50"
            >
              {t("nav.universityData")}
            </Link>

            {/* Language Dropdown */}
            <div className="relative language-dropdown">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-200/50"
              >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span>{currentLanguage.nativeName}</span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isLanguageDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLanguageDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 animate-slide-up">
                  <div className="py-1">
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        onClick={() => handleLanguageSelect(language)}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-3 ${
                          currentLanguage.code === language.code
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <span className="text-lg">{language.flag}</span>
                        <span className="font-medium">{language.nativeName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-slate-600 hover:text-slate-800 transition-colors font-medium flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-slate-200/50"
              title={`Current: ${theme === "system" ? "System" : theme} (${resolvedTheme})`}
            >
              {resolvedTheme === "dark" ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>{t("nav.light")}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  <span>{t("nav.dark")}</span>
                </>
              )}
            </button>

            {/* Auth Button / User Profile */}
            {user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 text-slate-600 hover:text-slate-800 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-slate-200/50"
                >
                  <img
                    src={user.user_metadata?.avatar_url || user.user_metadata?.picture || "/default-avatar.png"}
                    alt={user.user_metadata?.full_name || user.user_metadata?.name || "User"}
                    className="w-8 h-8 rounded-full border-2 border-slate-300"
                  />
                  <span className="max-w-32 truncate">{user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}</span>
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      isUserDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700 animate-slide-up">
                    <div className="py-1">
                      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          signOut();
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center space-x-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="bg-slate-400/20 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-400/30 transition-colors font-medium border border-slate-400/30 hover:border-slate-400/50"
              >
                {t("nav.signin")}
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                // Mobile menu toggle logic would go here
                console.log("Mobile menu toggle");
              }}
              className="text-[#F0F0F0] hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
