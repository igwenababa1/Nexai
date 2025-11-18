
import React, { useContext, useCallback, useState, useRef, useEffect } from 'react';
import type { QuestionType } from '../types.ts';
import { ALL_QUESTION_TYPES } from '../types.ts';
import { AppContext } from '../context/AppContext.tsx';
import Checkbox from '../components/Checkbox.tsx';
import QuizDisplay from '../components/QuizDisplay.tsx';

// SpeechRecognition API type is now in globals.d.ts
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const cybersecurityTopics = [
    // General & Foundational
    'Introduction to Cybersecurity',
    'The CIA Triad',
    'Common Cyber Attacks',
    'Password Security Best Practices',
    'Network Security Basics',
    
    // SOC, SIEM, and Analysis
    'SOC Analysis Fundamentals',
    'SIEM Analysis & Threat Hunting',
    'Log Analysis and Correlation',
    'MITRE ATT&CK Framework',
    'Incident Response Procedures',

    // Tools & Technologies
    'Endpoint Detection & Response (EDR)',
    'Network Scanners (Nmap, Nessus)',
    'Packet Analyzers (Wireshark)',
    'Vulnerability Management Tools',
    'Intrusion Detection Systems (IDS)',

    // Advanced & Specialized
    'Advanced Persistent Threats (APTs)',
    'Zero Trust Architecture',
    'Cloud Security (AWS, Azure, GCP)',
    'Cryptography and Encryption',
    'Digital Forensics (DFIR)',
    
    // Automation & Modern Concepts
    'SOAR & Automation in Security',
    'AI and Machine Learning in Cybersecurity',
    'DevSecOps Principles',
    'IoT and OT Security',
    'Cybersecurity Compliance (GDPR, HIPAA)',
];


const HomePage: React.FC = () => {
    const {
        quizData,
        loadingQuiz,
        errorQuiz,
        formDataQuiz,
        setFormDataQuiz,
        handleGenerateQuiz,
    } = useContext(AppContext);

    const [isListeningForTopic, setIsListeningForTopic] = useState(false);
    const recognitionRef = useRef<any>(null);

    // Effect for setting up Speech Recognition for the topic input
    useEffect(() => {
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API is not supported in this browser.");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
            let transcript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcript += event.results[i][0].transcript;
            }
            setFormDataQuiz(prev => ({ ...prev, topic: transcript }));
        };

        recognition.onend = () => {
            setIsListeningForTopic(false);
        };
        
        recognition.onerror = (event: any) => {
            console.error("Topic speech recognition error:", event.error);
            setIsListeningForTopic(false);
        };

        recognitionRef.current = recognition;
    }, [setFormDataQuiz]);

    const toggleTopicListening = () => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isListeningForTopic) {
            recognition.stop();
        } else {
            // Clear previous topic to start fresh
            setFormDataQuiz(prev => ({...prev, topic: ''}));
            recognition.start();
            setIsListeningForTopic(true);
        }
    };


    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormDataQuiz(prev => ({
            ...prev,
            [name]: name === 'numQuestions' ? Math.max(1, parseInt(value, 10) || 1) : value
        }));
    }, [setFormDataQuiz]);

    const handleCheckboxChange = useCallback((type: QuestionType) => {
        setFormDataQuiz(prev => {
            const newTypes = prev.questionTypes.includes(type)
                ? prev.questionTypes.filter(t => t !== type)
                : [...prev.questionTypes, type];
            return { ...prev, questionTypes: newTypes };
        });
    }, [setFormDataQuiz]);

    const handleSelectAllQuestionTypes = useCallback(() => {
        setFormDataQuiz(prev => ({
            ...prev,
            questionTypes: ALL_QUESTION_TYPES,
        }));
    }, [setFormDataQuiz]);
    
    const handleDifficultyChange = useCallback((difficulty: 'easy' | 'medium' | 'hard') => {
        setFormDataQuiz(prev => ({ ...prev, difficulty }));
    }, [setFormDataQuiz]);

    
    if (quizData) {
        return <QuizDisplay quizData={quizData} formData={formDataQuiz} />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form Container */}
            <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm p-8 rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30">
                <h2 className="text-3xl font-bold font-display mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">Create Your Quiz</h2>
                <p className="text-[var(--text-muted-color)] mb-6">Customize the details for your AI-generated quiz.</p>
                
                <div className="space-y-6">
                    {/* Topic */}
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium mb-2">Topic or Subject</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                id="topic" 
                                name="topic" 
                                value={formDataQuiz.topic} 
                                onChange={handleInputChange} 
                                placeholder="Type or use the mic..." 
                                className="w-full bg-black/20 p-3 pr-12 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all" 
                            />
                            {SpeechRecognition && (
                                <button
                                    type="button"
                                    onClick={toggleTopicListening}
                                    className={`absolute top-1/2 right-3 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        isListeningForTopic 
                                        ? 'bg-red-500 text-white animate-pulse' 
                                        : 'bg-white/10 text-[var(--text-muted-color)] hover:bg-white/20'
                                    }`}
                                    title="Set topic with voice"
                                >
                                    <i className="fas fa-microphone-alt"></i>
                                </button>
                            )}
                        </div>
                         <div className="flex flex-wrap gap-2 mt-3">
                            <span className="text-xs text-[var(--text-muted-color)] self-center">Suggestions:</span>
                            {cybersecurityTopics.map(topic => (
                                <button
                                    key={topic}
                                    type="button"
                                    onClick={() => setFormDataQuiz(prev => ({ ...prev, topic }))}
                                    className="px-3 py-1 text-xs font-medium bg-black/20 text-[var(--text-muted-color)] rounded-full hover:bg-[var(--primary-color)] hover:text-white transition-colors"
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Source Text */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="sourceText" className="block text-sm font-medium">Source Text / Context (Optional)</label>
                            <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono ${formDataQuiz.sourceText.length > 0 ? 'text-[var(--primary-color)]' : 'text-[var(--text-muted-color)]'}`}>
                                    {formDataQuiz.sourceText.length.toLocaleString()} chars
                                </span>
                            </div>
                        </div>
                        <textarea 
                            id="sourceText" 
                            name="sourceText" 
                            value={formDataQuiz.sourceText} 
                            onChange={handleInputChange} 
                            placeholder="Paste study notes, articles, or book excerpts here... The AI will analyze this content to create a perfectly tailored quiz." 
                            rows={10}
                            className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all resize-y min-h-[150px]" 
                        />
                        <p className="text-xs text-[var(--text-muted-color)] mt-1 italic">
                            Supports large texts. Providing context helps generate more specific and relevant questions.
                        </p>
                    </div>
                    
                    {/* Explanation Guidelines */}
                    <div>
                        <label htmlFor="explanationGuidelines" className="block text-sm font-medium mb-2">Explanation Guidelines (Optional)</label>
                        <textarea 
                            id="explanationGuidelines" 
                            name="explanationGuidelines" 
                            value={formDataQuiz.explanationGuidelines} 
                            onChange={handleInputChange} 
                            placeholder="e.g., Explain why the correct answer is right and the others are wrong. Keep it concise." 
                            rows={3}
                            className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all" 
                        />
                    </div>

                    {/* Difficulty and Number of Questions */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Difficulty</label>
                            <div className="grid grid-cols-3 gap-1 rounded-lg bg-black/20 p-1 border border-[var(--border-color)]">
                                {(['easy', 'medium', 'hard'] as const).map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        onClick={() => handleDifficultyChange(level)}
                                        className={`w-full text-center capitalize rounded-md py-2 px-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-color)] focus:ring-[var(--primary-color)] ${
                                            formDataQuiz.difficulty === level
                                                ? 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white shadow-md'
                                                : 'text-[var(--text-muted-color)] hover:bg-white/10'
                                        }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label htmlFor="numQuestions" className="block text-sm font-medium mb-2">Questions</label>
                            <input type="number" id="numQuestions" name="numQuestions" value={formDataQuiz.numQuestions} onChange={handleInputChange} min="1" max="20" className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all" />
                        </div>
                    </div>

                    {/* Question Types */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium">Question Types</label>
                            <button
                                type="button"
                                onClick={handleSelectAllQuestionTypes}
                                className="text-xs font-semibold text-[var(--primary-color)] hover:underline focus:outline-none"
                            >
                                Select All
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-black/10 rounded-lg">
                            {ALL_QUESTION_TYPES.map(type => (
                                <Checkbox 
                                    key={type} 
                                    id={type} 
                                    label={type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                                    checked={formDataQuiz.questionTypes.includes(type)} 
                                    onChange={() => handleCheckboxChange(type)} />
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <button onClick={handleGenerateQuiz} disabled={loadingQuiz} className="w-full flex justify-center items-center gap-3 text-lg font-bold p-4 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white transition-transform hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                        {loadingQuiz ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-cogs"></i>
                                Generate Quiz
                            </>
                        )}
                    </button>
                    {errorQuiz && <p className="text-red-400 text-sm text-center mt-2">{errorQuiz}</p>}
                </div>
            </div>
            
            {/* Placeholder / Info View */}
             <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm p-8 rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30">
                <div className="text-center">
                    <i className="fas fa-lightbulb text-6xl text-[var(--primary-color)] mb-4"></i>
                    <h3 className="text-2xl font-bold font-display mb-2">Welcome to the Future of Learning</h3>
                    <p className="text-[var(--text-muted-color)]">
                        Use the form to generate a custom quiz on any subject imaginable. Our advanced AI, powered by Google's Gemini, will craft questions tailored to your specifications.
                    </p>
                </div>
                <ul className="mt-8 space-y-3 text-sm">
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Multiple Question Formats:</strong> From multiple-choice to fill-in-the-blank.</span></li>
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Adjustable Difficulty:</strong> Tailor the challenge for any learner, from beginner to expert.</span></li>
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Instant Answers & Explanations:</strong> Get immediate feedback to accelerate learning.</span></li>
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Printable & Shareable:</strong> Easily take your quizzes offline for classroom or study group use.</span></li>
                </ul>
             </div>
        </div>
    );
};

export default HomePage;
