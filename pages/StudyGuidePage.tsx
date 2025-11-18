
import React, { useContext, useCallback } from 'react';
import { AppContext } from '../context/AppContext.tsx';
import type { GuideDepth, GuideFormat } from '../types.ts';
import StudyGuideDisplay from '../components/StudyGuideDisplay.tsx';

const StudyGuidePage: React.FC = () => {
    const {
        guideData,
        loadingGuide,
        errorGuide,
        formDataGuide,
        setFormDataGuide,
        handleGenerateGuide,
    } = useContext(AppContext);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormDataGuide(prev => ({ ...prev, [name]: value }));
    }, [setFormDataGuide]);

    const handleOptionChange = useCallback((type: 'depth' | 'format', value: GuideDepth | GuideFormat) => {
        setFormDataGuide(prev => ({ ...prev, [type]: value as any }));
    }, [setFormDataGuide]);

    if (guideData) {
        return <StudyGuideDisplay guideData={guideData} />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Form Container */}
            <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm p-8 rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30">
                <h2 className="text-3xl font-bold font-display mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">AI Study Guide Generator</h2>
                <p className="text-[var(--text-muted-color)] mb-6">Create comprehensive study materials tailored to your needs.</p>
                
                <div className="space-y-6">
                    {/* Topic */}
                    <div>
                        <label htmlFor="topic" className="block text-sm font-medium mb-2">Topic</label>
                        <input type="text" id="topic" name="topic" value={formDataGuide.topic} onChange={handleInputChange} placeholder="e.g., The French Revolution" className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all" />
                    </div>

                    {/* Depth */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Depth</label>
                        <div className="grid grid-cols-3 gap-1 rounded-lg bg-black/20 p-1 border border-[var(--border-color)]">
                            {(['summary', 'in-depth', 'expert'] as const).map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => handleOptionChange('depth', level)}
                                    className={`w-full text-center capitalize rounded-md py-2 px-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-color)] focus:ring-[var(--primary-color)] ${
                                        formDataGuide.depth === level
                                            ? 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white shadow-md'
                                            : 'text-[var(--text-muted-color)] hover:bg-white/10'
                                    }`}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Format */}
                     <div>
                        <label className="block text-sm font-medium mb-2">Format</label>
                        <div className="grid grid-cols-3 gap-1 rounded-lg bg-black/20 p-1 border border-[var(--border-color)]">
                            {(['key-points', 'q-and-a', 'concept-map'] as const).map((format) => (
                                <button
                                    key={format}
                                    type="button"
                                    onClick={() => handleOptionChange('format', format)}
                                    className={`w-full text-center capitalize rounded-md py-2 px-2 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface-color)] focus:ring-[var(--primary-color)] ${
                                        formDataGuide.format === format
                                            ? 'bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white shadow-md'
                                            : 'text-[var(--text-muted-color)] hover:bg-white/10'
                                    }`}
                                >
                                    {format.replace('-', ' & ')}
                                </button>
                            ))}
                        </div>
                    </div>


                    {/* Generate Button */}
                    <button onClick={handleGenerateGuide} disabled={loadingGuide} className="w-full flex justify-center items-center gap-3 text-lg font-bold p-4 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white transition-transform hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100">
                        {loadingGuide ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generating Guide...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-book-open"></i>
                                Generate Guide
                            </>
                        )}
                    </button>
                    {errorGuide && <p className="text-red-400 text-sm text-center mt-2">{errorGuide}</p>}
                </div>
            </div>
            
            {/* Placeholder / Info View */}
             <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm p-8 rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30">
                <div className="text-center">
                    <i className="fas fa-rocket text-6xl text-[var(--primary-color)] mb-4"></i>
                    <h3 className="text-2xl font-bold font-display mb-2">Your Personal Knowledge Architect</h3>
                    <p className="text-[var(--text-muted-color)]">
                        Select a topic, choose your desired depth and format, and let our AI build a custom study guide to accelerate your learning and master new subjects.
                    </p>
                </div>
                <ul className="mt-8 space-y-3 text-sm">
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Multiple Formats:</strong> Choose from concise key points, detailed Q&A, or structured concept maps.</span></li>
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Variable Depth:</strong> Get a quick summary for review or an expert-level guide for deep dives.</span></li>
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Powered by Gemini:</strong> Leverages advanced AI to provide accurate, well-organized, and easy-to-understand content.</span></li>
                    <li className="flex gap-3 items-start"><i className="fas fa-check-circle text-green-400 mt-1"></i><span><strong>Downloadable & Printable:</strong> Take your study materials with you anywhere, in high-quality PDF format.</span></li>
                </ul>
             </div>
        </div>
    );
};

export default StudyGuidePage;