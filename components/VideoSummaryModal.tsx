
import React, { useState, useEffect, useCallback } from 'react';
import { generateVideoSummary } from '../services/geminiService.ts';

interface VideoSummaryModalProps {
    topic: string;
    onClose: () => void;
}

type Status = 'checking_key' | 'needs_key' | 'generating' | 'success' | 'error';

const progressMessages = [
    "Warming up the AI's creative circuits...",
    "Gathering visual concepts for your topic...",
    "Directing the digital film crew...",
    "Rendering the first sequence of frames...",
    "Applying cinematic color grading...",
    "Compositing the final shots...",
    "Adding a touch of AI magic...",
    "The final cut is almost ready...",
];

const VideoSummaryModal: React.FC<VideoSummaryModalProps> = ({ topic, onClose }) => {
    const [status, setStatus] = useState<Status>('checking_key');
    const [progressMessage, setProgressMessage] = useState('Initializing...');
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleGenerateVideo = useCallback(async () => {
        setStatus('generating');
        setErrorMessage(null);

        try {
            const fullUrl = await generateVideoSummary(topic, (message) => {
                setProgressMessage(message);
            });
            // The service returns the full URI with the key appended
            setVideoUrl(fullUrl);
            setStatus('success');
        } catch (err: any) {
            setErrorMessage(err.message || 'An unknown error occurred.');
            setStatus('error');
            // If the error is an invalid key, prompt the user to select a new one.
            if (err.message && err.message.includes("Invalid API key")) {
                 setStatus('needs_key');
            }
        }
    }, [topic]);

    useEffect(() => {
        let isMounted = true;
        
        // Progress message cycling for 'generating' state
        let interval: number | undefined;
        if (status === 'generating') {
            let i = 0;
            interval = window.setInterval(() => {
                 if(isMounted) {
                    setProgressMessage(progressMessages[i % progressMessages.length]);
                    i++;
                }
            }, 5000);
        }

        // Initial check for API Key
        if (status === 'checking_key') {
            const checkApiKey = async () => {
                if (window.aistudio && await window.aistudio.hasSelectedApiKey()) {
                    if(isMounted) handleGenerateVideo();
                } else {
                    if(isMounted) setStatus('needs_key');
                }
            };
            checkApiKey();
        }

        return () => {
            isMounted = false;
            if(interval) clearInterval(interval);
        };
    }, [status, handleGenerateVideo]);

    const handleSelectKey = async () => {
        if (!window.aistudio) return;
        try {
            await window.aistudio.openSelectKey();
            // Assume key selection is successful and proceed
            handleGenerateVideo();
        } catch (error) {
            console.error("Error opening select key dialog:", error);
            setErrorMessage("Failed to open the API key selection dialog.");
            setStatus('error');
        }
    };
    
    const renderContent = () => {
        switch (status) {
            case 'checking_key':
            case 'generating':
                return (
                    <div className="text-center p-8">
                        <svg className="animate-spin h-12 w-12 text-[var(--primary-color)] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="mt-4 text-lg font-semibold">{progressMessage}</p>
                        <p className="text-sm text-[var(--text-muted-color)] mt-1">This can take a few minutes. Please be patient.</p>
                    </div>
                );
            case 'needs_key':
                 return (
                    <div className="text-center p-8">
                         <i className="fas fa-key text-4xl text-yellow-400 mb-4"></i>
                         <h3 className="text-xl font-bold mb-2">API Key Required</h3>
                         <p className="text-[var(--text-muted-color)] mb-4">
                             Video generation with Veo requires you to select your own Google AI API key. This is a one-time setup for this feature.
                         </p>
                         <button onClick={handleSelectKey} className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors">
                             Select API Key
                         </button>
                         <p className="text-xs text-[var(--text-muted-color)] mt-3">
                            For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-[var(--primary-color)] underline">billing documentation</a>.
                         </p>
                         {errorMessage && <p className="text-red-400 mt-4">{errorMessage}</p>}
                    </div>
                 );
            case 'success':
                return (
                    <div className="flex flex-col gap-4">
                        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden">
                            {videoUrl && (
                                <video src={videoUrl} controls autoPlay className="w-full h-full object-contain"></video>
                            )}
                        </div>
                         <div className="flex justify-center">
                            <a 
                                href={videoUrl || '#'} 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-md hover:opacity-90 transition-opacity"
                            >
                                <i className="fas fa-download"></i> Open Video
                            </a>
                        </div>
                    </div>
                );
            case 'error':
                 return (
                    <div className="text-center p-8">
                        <i className="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
                        <p className="text-[var(--text-muted-color)]">{errorMessage}</p>
                        <button onClick={onClose} className="mt-4 px-6 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-colors">
                            Close
                        </button>
                    </div>
                 );
        }
    };


    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--surface-color)] w-full max-w-2xl rounded-xl shadow-2xl border border-[var(--border-color)] flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <h3 className="font-display text-lg font-bold">Video Summary: {topic}</h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors">&times;</button>
                </header>
                <div className="flex-1 p-4">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default VideoSummaryModal;
