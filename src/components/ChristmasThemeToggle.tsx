import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sparkles, X } from "lucide-react";

export const ChristmasThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const christmasLogoUrl = "https://i.ibb.co/FkMs5W5h/Gemini-Generated-Image-uo458huo458huo45.png";
  const droplinkLogoUrl = "https://droplink.space/logo.png"; // Droplink official logo

  return (
    <>
      {/* Floating Theme Switcher Button - Vintage maroon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full text-white font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-110 ${
          theme === "christmas"
            ? "bg-gradient-to-r from-red-900 to-red-950 hover:from-red-950 hover:to-black"
            : "bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700"
        }`}
        style={{
          position: 'fixed',
          bottom: '6rem',
          right: '1.5rem',
          zIndex: 50
        }}
        title="Open theme switcher"
      >
        <Sparkles className="w-6 h-6 group-hover:animate-spin" />
      </button>

      {/* Theme Panel - Sky blue for Original, Red for Christmas */}
      {isOpen && (
        <div className={`fixed w-80 p-6 rounded-2xl shadow-2xl border-2 animate-in slide-in-from-bottom-4 duration-300 ${
          theme === "christmas"
            ? "bg-gradient-to-br from-red-900 to-red-950 border-red-700"
            : "bg-gradient-to-br from-sky-500 to-sky-700 border-sky-300"
        }`} style={{
          position: 'fixed',
          bottom: '12rem',
          right: '1.5rem',
          zIndex: 50
        }}>
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className={`absolute top-3 right-3 p-1 rounded-full transition-colors ${
              theme === "christmas"
                ? "hover:bg-red-800 text-white"
                : "hover:bg-sky-600 text-white"
            }`}
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <h3 className={`text-lg font-bold mb-4 ${
            theme === "christmas" ? "text-red-100" : "text-white"
          }`}>Theme Switcher</h3>

          {/* Logo Preview */}
          <div className={`mb-4 p-4 rounded-lg flex items-center justify-center min-h-24 ${
            theme === "christmas"
              ? "bg-gradient-to-b from-red-800 to-red-900"
              : "bg-gradient-to-b from-sky-400 to-sky-500"
          }`}>
            <div className="text-center">
              {(theme as string) === "christmas" ? (
                <img
                  src={christmasLogoUrl}
                  alt="Christmas Logo"
                  className="w-16 h-16 object-contain mx-auto drop-shadow-lg"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext x='50' y='50' dominant-baseline='middle' text-anchor='middle' font-size='40'%3E🎄%3C/text%3E%3C/svg%3E";
                  }}
                />
              ) : (
                <>
                  <img
                    src="https://i.ibb.co/LDGGGXCk/Gemini-Generated-Image-ar8t52ar8t52ar8t-1.png"
                    alt="Droplink Logo"
                    className="w-16 h-16 object-contain mx-auto mb-2 drop-shadow-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                      (e.target as HTMLImageElement).parentElement?.querySelector('.droplink-fallback')?.classList.remove('hidden');
                    }}
                  />
                  <div className="droplink-fallback hidden text-3xl text-white">💧</div>
                  <p className="text-xs font-semibold text-white mt-1">Droplink</p>
                </>
              )}
            </div>
          </div>

          {/* Theme Options */}
          <div className="space-y-3">
            {/* Christmas Theme Button - Vintage maroon when active */}
            <button
              onClick={() => {
                if ((theme as string) !== "christmas") toggleTheme();
                setIsOpen(false);
              }}
              className={`w-full p-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-between ${
                (theme as string) === "christmas"
                  ? "bg-red-800 text-white shadow-lg border-2 border-red-600"
                  : "bg-sky-800 text-gray-300 hover:bg-sky-700 border-2 border-sky-700"
              }`}
            >
              <span className={`flex items-center gap-2 ${(theme as string) === "christmas" ? "text-white" : "text-gray-300"}`}>
                <span className="text-xl">🎄</span>
                <span className={`font-bold ${(theme as string) === "christmas" ? "text-white" : "text-gray-300"}`}>Christmas Theme</span>
              </span>
              {(theme as string) === "christmas" && <span className="text-lg text-white font-bold">✓</span>}
            </button>

            {/* Original Theme Button */}
            <button
              onClick={() => {
                if ((theme as string) !== "original") toggleTheme();
                setIsOpen(false);
              }}
              className={`w-full p-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-between ${
                (theme as string) === "original"
                  ? "bg-sky-400 text-white shadow-lg border-2 border-sky-200"
                  : "bg-red-800 text-gray-300 hover:bg-red-700 border-2 border-red-700"
              }`}
            >
              <span className={`flex items-center gap-2 ${(theme as string) === "original" ? "text-white" : "text-gray-300"}`}>
                <span className="text-xl">🌟</span>
                <span className={`font-bold ${(theme as string) === "original" ? "text-white" : "text-gray-300"}`}>Original Theme</span>
              </span>
              {(theme as string) === "original" && <span className="text-lg text-white font-bold">✓</span>}
            </button>
          </div>

          {/* Current Theme Info */}
          <div className={`mt-4 pt-4 border-t ${
            theme === "christmas" ? "border-red-700" : "border-sky-400"
          }`}>
            <p className={`text-sm font-semibold ${
              theme === "christmas" ? "text-red-100" : "text-white"
            }`}>
              Active Theme:{" "}
              <span className="capitalize font-bold ml-1">
                {(theme as string) === "christmas" ? "🎄 Christmas" : "🌟 Original"}
              </span>
            </p>
            <p className={`text-xs mt-2 leading-relaxed ${
              theme === "christmas" ? "text-red-200" : "text-sky-100"
            }`}>
              Your preference is saved and will persist across sessions.
            </p>
          </div>
        </div>
      )}

      {/* Backdrop - Close panel when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 40,
            backgroundColor: 'rgba(0, 0, 0, 0.2)'
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default ChristmasThemeToggle;
