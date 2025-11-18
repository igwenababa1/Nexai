
import React, { useState, useEffect } from 'react';
import { generateQuizArt } from '../services/geminiService.ts';

interface ArtGeneratorModalProps {
    topic: string;
    onClose: () => void;
}

const loadingMessages = [
    "Mixing digital colors...",
    "Sketching the composition...",
    "Adjusting lighting and shadows...",
    "Applying final artistic touches...",
];

const ArtGeneratorModal: React.FC<ArtGeneratorModalProps> = ({ topic, onClose }) => {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [msgIndex, setMsgIndex] = useState(0);

    useEffect(() => {
        let isMounted = true;
        const generate = async () => {
            try {
                const url = await generateQuizArt(topic);
                if (isMounted) {
                    setImageUrl(url);
                    setLoading(false);
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err.message || "Failed to generate art.");
                    setLoading(false);
                }
            }
        };
        generate();

        // Cycle loading messages
        const interval = setInterval(() => {
            setMsgIndex(prev => (prev + 1) % loadingMessages.length);
        }, 3000);

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [topic]);

    return (
        <div className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div className="bg-[var(--surface-color)] w-full max-w-3xl rounded-xl shadow-2xl border border-[var(--border-color)] flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                    <h3 className="font-display text-lg font-bold flex items-center gap-2">
                        <i className="fas fa-palette text-pink-400"></i>
                        AI Art: {topic}
                    </h3>
                    <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors">&times;</button>
                </header>
                
                <div className="flex-1 p-6 overflow-y-auto flex flex-col items-center justify-center min-h-[400px]">
                    {loading ? (
                        <div className="text-center">
                             <div className="w-16 h-16 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin mx-auto mb-6"></div>
                             <p className="text-xl font-semibold animate-pulse">{loadingMessages[msgIndex]}</p>
                             <p className="text-sm text-[var(--text-muted-color)] mt-2">Powered by Imagen 3</p>
                        </div>
                    ) : error ? (
                        <div className="text-center max-w-md">
                            <i className="fas fa-exclamation-circle text-4xl text-red-400 mb-4"></i>
                            <h4 className="text-xl font-bold mb-2">Creation Failed</h4>
                            <p className="text-[var(--text-muted-color)] mb-6">{error}</p>
                            <button onClick={onClose} className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-md text-white transition-colors">Close</button>
                        </div>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center">
                            <div className="relative w-full rounded-lg overflow-hidden shadow-2xl border border-[var(--border-color)] group">
                                <img src={imageUrl!} alt={`AI Art for ${topic}`} className="w-full h-auto object-contain max-h-[60vh]" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-bold text-lg">Generated with Google Imagen</p>
                                </div>
                            </div>
                            <div className="mt-6 flex gap-4">
                                <a 
                                    href={imageUrl!} 
                                    download={`${topic.replace(/\s+/g, '_')}_AI_Art.jpg`}
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold rounded-md shadow-lg transition-all transform hover:scale-105"
                                >
                                    <i className="fas fa-download"></i> Download Artwork
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArtGeneratorModal;
