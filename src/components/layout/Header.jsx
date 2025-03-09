import { useState, useEffect, useRef } from "react";
import { useTheme } from "@/hooks/useTheme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faSun,
  faMoon,
  faLanguage,
  faCog,
  faBolt,
  faBell,
  faDesktop,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from "@/hooks/useAuth";

function Header() {
  const { darkMode, setDarkMode, language, setLanguage, themeMode, setThemeMode } = useTheme();
  const [isThemeOpen, setThemeOpen] = useState(false);
  const [isLangOpen, setLangOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const {logout } = useAuth();

  const themeRef = useRef(null);
  const langRef = useRef(null);
  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (themeRef.current && !themeRef.current.contains(event.target)) setThemeOpen(false);
      if (langRef.current && !langRef.current.contains(event.target)) setLangOpen(false);
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target)) setNotificationOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeTheme = (mode) => {
    setThemeMode(mode);
    if (mode === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDarkMode(systemDark);
    } else {
      setDarkMode(mode === "dark");
    }
  };

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <div className="container">
        <div className="menu-input">
          <button className="menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <label>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" style={{ color: "#A9AAAC" }} />
            <input type="text" placeholder="Search..." className="input" />
          </label>
        </div>

        <div className="flex">
          <div className="relative" ref={themeRef}>
            <button className="icon-btn" onClick={() => setThemeOpen(!isThemeOpen)}>
              <FontAwesomeIcon icon={themeMode === "dark" ? faMoon : themeMode === "light" ? faSun : faDesktop} />
            </button>
            {isThemeOpen && (
              <div className="dropdown">
                <button onClick={() => changeTheme("light")}>
                  <FontAwesomeIcon icon={faSun} /> Light
                </button>
                <button onClick={() => changeTheme("dark")}>
                  <FontAwesomeIcon icon={faMoon} /> Dark
                </button>
                <button onClick={() => changeTheme("system")}>
                  <FontAwesomeIcon icon={faDesktop} /> System
                </button>
              </div>
            )}
          </div>

          <div className="relative" ref={langRef}>
            <button className="icon-btn" onClick={() => setLangOpen(!isLangOpen)}>
              <FontAwesomeIcon icon={faLanguage} />
            </button>
            {isLangOpen && (
              <div className="dropdown">
                <button
                  onClick={() => {
                    setLanguage("en");
                    setLangOpen(false);
                  }}
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => {
                    setLanguage("uz");
                    setLangOpen(false);
                  }}
                >
                  🇺🇿 O'zbek
                </button>
                <button
                  onClick={() => {
                    setLanguage("ru");
                    setLangOpen(false);
                  }}
                >
                  🇷🇺 Русский
                </button>
              </div>
            )}
          </div>
          <button className="icon-btn">
            <FontAwesomeIcon icon={faCog} />
          </button>

          <button className="icon-btn">
            <FontAwesomeIcon icon={faBolt} />
          </button>

          <div className="relative" ref={notificationRef}>
            <button className="icon-btn notification" onClick={() => setNotificationOpen(!isNotificationOpen)}>
              <FontAwesomeIcon icon={faBell} />
              <span className="badge">3</span>
            </button>
            {isNotificationOpen && (
              <div className="dropdown">
                <p>📩 Sizda 3 ta yangi bildirishnoma bor!</p>
              </div>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <button className="avatar" onClick={() => setMenuOpen(!isMenuOpen)}>
              <img src="avatar.jpg" alt="User Avatar" />
            </button>
            {isMenuOpen && (
              <div className="dropdown">
                <button>👤 Profil</button>
                <button onClick={logout}>🔓 Chiqish</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
