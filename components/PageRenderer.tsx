
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import HomePage from '../pages/HomePage.tsx';
import AboutPage from '../pages/AboutPage.tsx';
import ContactPage from '../pages/ContactPage.tsx';
import StudyGuidePage from '../pages/StudyGuidePage.tsx';
import TutorPage from '../pages/TutorPage.tsx';
import BookmarksPage from '../pages/BookmarksPage.tsx';

const PageRenderer: React.FC = () => {
    const { currentPage } = useContext(AppContext);

    switch (currentPage) {
        case 'home':
            return <HomePage />;
        case 'guides':
            return <StudyGuidePage />;
        case 'tutor':
            return <TutorPage />;
        case 'bookmarks':
            return <BookmarksPage />;
        case 'about':
            return <AboutPage />;
        case 'contact':
            return <ContactPage />;
        default:
            return <HomePage />;
    }
};

export default PageRenderer;