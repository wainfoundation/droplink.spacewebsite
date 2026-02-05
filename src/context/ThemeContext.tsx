import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

export type ThemeType = "original";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "original",
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeType>("original");
  const [isClient, setIsClient] = useState(false);

  // Initialize theme from localStorage on mount
  useEffect(() => {
    setIsClient(true);
    const savedTheme = localStorage.getItem("droplink-theme") as ThemeType | null;
    if (savedTheme) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("original");
    }
  }, []);

  const applyTheme = (newTheme: ThemeType) => {
    const htmlElement = document.documentElement;
    htmlElement.classList.remove("christmas-theme");
  };


  const setTheme = (newTheme: ThemeType) => {
    setThemeState("original");
    localStorage.setItem("droplink-theme", "original");
    applyTheme("original");
  };


  const toggleTheme = () => {
    setTheme("original");
  };

  if (!isClient) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
