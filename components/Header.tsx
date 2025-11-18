
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { Page } from '../context/AppContext.tsx';


const NavButton: React.FC<{
    page: Page;
    label: string;
}> = ({ page, label }) => {
    const { currentPage, navigateTo } = useContext(AppContext);
    const isActive = currentPage === page;
    return (
        <button
            onClick={() => navigateTo(page)}
            className={`font-display relative px-4 py-2 text-lg transition-colors duration-300 ${
                isActive
                    ? 'text-[var(--primary-color)]'
                    : 'text-[var(--text-muted-color)] hover:text-[var(--text-color)]'
            }`}
        >
            {label}
            {isActive && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-[var(--primary-color)] rounded-full"></span>
            )}
        </button>
    );
};


const Header: React.FC = () => {
    const { darkMode, toggleDarkMode } = useContext(AppContext);
    return (
        <header className="sticky top-0 z-50 bg-[var(--surface-color)]/80 backdrop-blur-md shadow-lg shadow-black/20">
            <div className="container mx-auto flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                    <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-full">
                        <i className="fas fa-brain text-2xl text-white"></i>
                    </div>
                    <span className="font-display text-2xl font-bold">NexusLearn AI</span>
                </div>
                <nav className="hidden md:flex items-center gap-4">
                    <NavButton page="home" label="Quiz Generator" />
                    <NavButton page="guides" label="Study Guides" />
                    <NavButton page="tutor" label="AI Tutor" />
                    <NavButton page="bookmarks" label="Bookmarks" />
                    <NavButton page="about" label="About" />
                    <NavButton page="contact" label="Contact" />
                </nav>
                <div className="flex items-center gap-4">
                    <label htmlFor="theme-toggle" className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" id="theme-toggle" className="sr-only peer" checked={!darkMode} onChange={toggleDarkMode} />
                        <div className="w-14 h-7 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary-color)] flex items-center justify-between px-2 text-yellow-300 text-purple-400">
                           <i className="fas fa-moon"></i>
                           <i className="fas fa-sun"></i>
                        </div>
                    </label>
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-700 dark:bg-gray-800 text-white font-bold rounded-full border-2 border-[var(--secondary-color)]">
                        JS
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;