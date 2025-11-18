
import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { generateQuiz, generateStudyGuide } from '../services/geminiService.ts';
import type { QuizData, StudyGuideData, GuideDepth, GuideFormat, QuizFormData, QuizBookmark } from '../types.ts';
import { useToasts } from '../hooks/useToast.ts';
import type { Toast } from '../hooks/useToast.ts';

export type Page = 'home' | 'guides' | 'tutor' | 'bookmarks' | 'about' | 'contact';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface GuideFormData {
    topic: string;
    depth: GuideDepth;
    format: GuideFormat;
}

interface AppContextType {
    // State
    currentPage: Page;
    darkMode: boolean;
    toasts: Toast[];

    // Quiz State
    quizData: QuizData | null;
    loadingQuiz: boolean;
    errorQuiz: string | null;
    formDataQuiz: QuizFormData;
    
    // Bookmarks State
    bookmarks: QuizBookmark[];

    // Study Guide State
    guideData: StudyGuideData | null;
    loadingGuide: boolean;
    errorGuide: string | null;
    formDataGuide: GuideFormData;

    // Actions
    navigateTo: (page: Page) => void;
    toggleDarkMode: () => void;
    addToast: (message: string, type?: 'info' | 'success' | 'error') => void;
    removeToast: (id: number) => void;

    // Quiz Actions
    handleGenerateQuiz: () => Promise<void>;
    resetQuiz: () => void;
    setFormDataQuiz: React.Dispatch<React.SetStateAction<QuizFormData>>;
    
    // Bookmark Actions
    addBookmark: (name: string, config: QuizFormData) => void;
    removeBookmark: (id: number) => void;
    loadBookmark: (id: number) => void;
    
    // Study Guide Actions
    handleGenerateGuide: () => Promise<void>;
    resetGuide: () => void;
    setFormDataGuide: React.Dispatch<React.SetStateAction<GuideFormData>>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Navigation and Theme State
    const [currentPage, setCurrentPage] = useState<Page>('home');
    const [darkMode, setDarkMode] = useState<boolean>(true);

    // Quiz State
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [loadingQuiz, setLoadingQuiz] = useState(false);
    const [errorQuiz, setErrorQuiz] = useState<string | null>(null);
    const [formDataQuiz, setFormDataQuiz] = useState<QuizFormData>({
        topic: 'The Solar System',
        sourceText: '',
        explanationGuidelines: '',
        difficulty: 'medium',
        questionTypes: ['multiple-choice', 'true-false'],
        numQuestions: 5
    });
    
    // Bookmarks State
    const [bookmarks, setBookmarks] = useState<QuizBookmark[]>([]);
    
    // Study Guide State
    const [guideData, setGuideData] = useState<StudyGuideData | null>(null);
    const [loadingGuide, setLoadingGuide] = useState(false);
    const [errorGuide, setErrorGuide] = useState<string | null>(null);
    const [formDataGuide, setFormDataGuide] = useState<GuideFormData>({
        topic: 'Introduction to Quantum Mechanics',
        depth: 'in-depth',
        format: 'key-points',
    });


    // Toast Notification State
    const { toasts, addToast, removeToast } = useToasts();

    // Theme & Bookmarks Effect
    useEffect(() => {
        // Load theme from local storage
        const isDark = localStorage.getItem('darkMode') !== 'false';
        setDarkMode(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        
        // Load bookmarks from local storage
        try {
            const savedBookmarks = localStorage.getItem('quizBookmarks');
            if (savedBookmarks) {
                setBookmarks(JSON.parse(savedBookmarks));
            }
        } catch (error) {
            console.error("Failed to load bookmarks from localStorage", error);
            addToast("Could not load saved bookmarks.", "error");
        }
    }, [addToast]);

    const toggleDarkMode = useCallback(() => {
        setDarkMode(prevMode => {
            const newMode = !prevMode;
            localStorage.setItem('darkMode', String(newMode));
            if (newMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
            return newMode;
        });
    }, []);
    
    // Navigation
    const navigateTo = useCallback((page: Page) => {
        setCurrentPage(page);
    }, []);

    // Quiz Actions
    const handleGenerateQuiz = useCallback(async () => {
        if (!formDataQuiz.topic) {
            const msg = "Please provide a topic for your quiz.";
            setErrorQuiz(msg);
            addToast(msg, 'error');
            return;
        }
        if (formDataQuiz.questionTypes.length === 0) {
            const msg = "Please select at least one question type.";
            setErrorQuiz(msg);
            addToast(msg, 'error');
            return;
        }
        setLoadingQuiz(true);
        setErrorQuiz(null);
        try {
            const data = await generateQuiz(formDataQuiz.topic, formDataQuiz.difficulty, formDataQuiz.questionTypes, formDataQuiz.numQuestions, formDataQuiz.sourceText, formDataQuiz.explanationGuidelines);
            setQuizData(data);
            addToast('Quiz generated successfully!', 'success');
        } catch (e: any) {
            const msg = e.message || "An unexpected error occurred.";
            setErrorQuiz(msg);
            addToast(msg, 'error');
        } finally {
            setLoadingQuiz(false);
        }
    }, [formDataQuiz, addToast]);
    
    const resetQuiz = useCallback(() => {
        setQuizData(null);
        setErrorQuiz(null);
    }, []);
    
    // Bookmark Actions
    const addBookmark = useCallback((name: string, config: QuizFormData) => {
        const newBookmark: QuizBookmark = { id: Date.now(), name, config };
        const updatedBookmarks = [...bookmarks, newBookmark];
        setBookmarks(updatedBookmarks);
        localStorage.setItem('quizBookmarks', JSON.stringify(updatedBookmarks));
        addToast(`Bookmarked quiz: "${name}"`, 'success');
    }, [bookmarks, addToast]);
    
    const removeBookmark = useCallback((id: number) => {
        const updatedBookmarks = bookmarks.filter(b => b.id !== id);
        setBookmarks(updatedBookmarks);
        localStorage.setItem('quizBookmarks', JSON.stringify(updatedBookmarks));
        addToast('Bookmark removed.', 'info');
    }, [bookmarks, addToast]);
    
    const loadBookmark = useCallback((id: number) => {
        const bookmark = bookmarks.find(b => b.id === id);
        if (bookmark) {
            setFormDataQuiz(bookmark.config);
            navigateTo('home');
            resetQuiz(); // Ensure we are on the form page
            addToast(`Loaded bookmark: "${bookmark.name}"`, 'success');
        } else {
            addToast('Could not find bookmark to load.', 'error');
        }
    }, [bookmarks, addToast, navigateTo, resetQuiz]);
    
    // Study Guide Actions
    const handleGenerateGuide = useCallback(async () => {
        if (!formDataGuide.topic) {
            const msg = "Please provide a topic for your study guide.";
            setErrorGuide(msg);
            addToast(msg, 'error');
            return;
        }
        setLoadingGuide(true);
        setErrorGuide(null);
        try {
            const data = await generateStudyGuide(formDataGuide.topic, formDataGuide.depth, formDataGuide.format);
            setGuideData(data);
            addToast('Study guide generated successfully!', 'success');
        } catch (e: any) {
             const msg = e.message || "An unexpected error occurred.";
            setErrorGuide(msg);
            addToast(msg, 'error');
        } finally {
            setLoadingGuide(false);
        }
    }, [formDataGuide, addToast]);

    const resetGuide = useCallback(() => {
        setGuideData(null);
        setErrorGuide(null);
    }, []);


    const value: AppContextType = {
        currentPage,
        darkMode,
        toasts,
        quizData,
        loadingQuiz,
        errorQuiz,
        formDataQuiz,
        guideData,
        loadingGuide,
        errorGuide,
        formDataGuide,
        bookmarks,
        navigateTo,
        toggleDarkMode,
        addToast,
        removeToast,
        handleGenerateQuiz,
        resetQuiz,
        setFormDataQuiz,
        addBookmark,
        removeBookmark,
        loadBookmark,
        handleGenerateGuide,
        resetGuide,
        setFormDataGuide,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};