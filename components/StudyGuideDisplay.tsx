
import React, { useState, useRef, useContext } from 'react';
import type { StudyGuideData } from '../types.ts';
import html2pdf from 'html2pdf.js';
import { AppContext } from '../context/AppContext.tsx';
import MarkdownRenderer from './MarkdownRenderer.tsx';


const StudyGuideDisplay: React.FC<{ guideData: StudyGuideData }> = ({ guideData }) => {
    const { resetGuide } = useContext(AppContext);
    const [isDownloading, setIsDownloading] = useState(false);
    const guidePaperRef = useRef<HTMLDivElement>(null);

    const printGuide = () => {
        window.print();
    };

    const handleDownloadPDF = async () => {
        if (!guidePaperRef.current) return;
        
        setIsDownloading(true);
        const element = guidePaperRef.current;
        const opt = {
            margin: 0.5,
            filename: `${guideData.title.replace(/\s+/g, '_')}_Study_Guide.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };
        
        await html2pdf().set(opt).from(element).save();
        setIsDownloading(false);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="quiz-actions-header sticky top-24 z-40 flex justify-between items-center mb-6 p-3 bg-[var(--surface-color)]/80 backdrop-blur-md rounded-lg border border-[var(--border-color)]">
                <button onClick={resetGuide} className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-500/20 hover:bg-gray-500/40 transition-colors">
                    <i className="fas fa-arrow-left"></i> Back
                </button>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={handleDownloadPDF} 
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 rounded-md bg-purple-500/20 hover:bg-purple-500/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-file-pdf"></i>
                                <span>Download PDF</span>
                            </>
                        )}
                    </button>
                    <button onClick={printGuide} className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-500/20 hover:bg-blue-500/40 transition-colors">
                        <i className="fas fa-print"></i> Print
                    </button>
                </div>
            </div>

            <div ref={guidePaperRef} className="quiz-paper p-8 md:p-12 bg-[var(--surface-color)] rounded-xl shadow-2xl shadow-black/30 border border-[var(--border-color)]">
                <header className="text-center border-b-2 border-[var(--border-color)] pb-6 mb-8">
                    <h1 className="text-4xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">{guideData.title}</h1>
                    <div className="flex justify-center gap-6 mt-4 text-sm text-[var(--text-muted-color)] capitalize">
                        <span><strong>Topic:</strong> {guideData.topic}</span>
                        <span><strong>Depth:</strong> {guideData.depth}</span>
                        <span><strong>Format:</strong> {guideData.format.replace('-', ' & ')}</span>
                    </div>
                </header>
                
                <section>
                    <MarkdownRenderer content={guideData.content} />
                </section>
            </div>
        </div>
    );
};

export default StudyGuideDisplay;