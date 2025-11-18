
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types.ts';
import { streamChatResponse, streamTutorResponse } from '../services/geminiService.ts';
import MessageBubble from './chat/MessageBubble.tsx';
import TypingIndicator from './chat/TypingIndicator.tsx';

// SpeechRecognition API type is now in globals.d.ts
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const Chatbot: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [activeMode, setActiveMode] = useState<'assistant' | 'tutor'>('assistant');
    
    // Separate histories
    const [assistantMessages, setAssistantMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Hello! I'm Nexus, your AI learning assistant. How can I help you today?" }
    ]);
    const [tutorMessages, setTutorMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Welcome! I am your AI Tutor. I'm here to help you deepen your understanding of any topic using the Socratic method. What shall we explore?" }
    ]);

    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

    // Determine current messages and setter based on mode
    const messages = activeMode === 'assistant' ? assistantMessages : tutorMessages;

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages, isLoading, activeMode]);
    
    const handleSend = useCallback(async (textOverride?: string) => {
        const messageToSend = (textOverride || input).trim();
        if (!messageToSend || isLoading) return;

        // Capture current mode to ensure response goes to correct history even if user switches tabs
        const currentMode = activeMode;
        const setTargetMessages = currentMode === 'assistant' ? setAssistantMessages : setTutorMessages;
        const streamService = currentMode === 'assistant' ? streamChatResponse : streamTutorResponse;

        const newUserMessage: ChatMessage = { role: 'user', content: messageToSend };
        setTargetMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await streamService(messageToSend);
            let modelResponse = '';
            setTargetMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setTargetMessages(prev => {
                    const newMessages = [...prev];
                    if(newMessages.length > 0) {
                       newMessages[newMessages.length - 1].content = modelResponse;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: "Sorry, I'm having trouble connecting right now." };
            setTargetMessages(prev => {
                const newMessages = [...prev];
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].content === '') {
                   newMessages[newMessages.length - 1] = errorMessage;
                   return newMessages;
                }
                return [...prev, errorMessage];
             });
        } finally {
            setIsLoading(false);
        }
    }, [input, isLoading, activeMode]);

    useEffect(() => {
        if (!SpeechRecognition) {
            return;
        }
        recognitionRef.current = new SpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        const handleResult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    finalTranscript += transcript;
                } else {
                    interimTranscript += transcript;
                }
            }
            setInput(finalTranscript + interimTranscript);
            if (finalTranscript) {
                handleSend(finalTranscript);
            }
        };

        const handleEnd = () => setIsListening(false);
        const handleError = (event: any) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };
        
        recognition.addEventListener('result', handleResult);
        recognition.addEventListener('end', handleEnd);
        recognition.addEventListener('error', handleError);

        return () => {
            recognition.removeEventListener('result', handleResult);
            recognition.removeEventListener('end', handleEnd);
            recognition.removeEventListener('error', handleError);
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [handleSend]);

    const toggleListening = () => {
        const recognition = recognitionRef.current;
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            setInput('');
            recognition.start();
            setIsListening(true);
        }
    };

    return (
        <div className={`fixed bottom-24 right-6 w-full max-w-md h-[70vh] max-h-[600px] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'}`}>
            <div className="flex flex-col h-full bg-[var(--surface-dark)] text-white rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden">
                <header className="bg-black/20 border-b border-[var(--border-color)]">
                    <div className="flex items-center justify-between p-4 pb-2">
                        <h3 className="font-display text-lg font-bold flex items-center gap-2">
                            <i className={`fas ${activeMode === 'assistant' ? 'fa-robot text-[var(--primary-color)]' : 'fa-graduation-cap text-[var(--secondary-color)]'}`}></i> 
                            {activeMode === 'assistant' ? 'AI Assistant' : 'AI Tutor'}
                        </h3>
                        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 transition-colors">&times;</button>
                    </div>
                    <div className="flex px-4 gap-6">
                        <button 
                            onClick={() => setActiveMode('assistant')} 
                            className={`pb-2 text-sm font-bold transition-colors border-b-2 ${activeMode === 'assistant' ? 'border-[var(--primary-color)] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            Assistant
                        </button>
                        <button 
                            onClick={() => setActiveMode('tutor')} 
                            className={`pb-2 text-sm font-bold transition-colors border-b-2 ${activeMode === 'tutor' ? 'border-[var(--secondary-color)] text-white' : 'border-transparent text-gray-400 hover:text-white'}`}
                        >
                            Tutor Mode
                        </button>
                    </div>
                </header>
                
                <div ref={chatHistoryRef} className="flex-1 p-4 space-y-4 overflow-y-auto">
                    {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
                    {isLoading && !messages[messages.length-1].content && <TypingIndicator />}
                </div>
                <footer className="p-4 bg-black/20 border-t border-[var(--border-color)]">
                    <div className="flex items-center gap-2">
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder={isListening ? 'Listening...' : (activeMode === 'assistant' ? "Ask for help..." : "Ask the Tutor...")}
                            rows={1}
                            className="flex-1 p-2 bg-black/20 rounded-lg resize-none focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        />
                        {SpeechRecognition && (
                             <button onClick={toggleListening} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-white/10 hover:bg-white/20'}`}>
                                <i className="fas fa-microphone-alt"></i>
                            </button>
                        )}
                        <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className={`w-10 h-10 rounded-full bg-gradient-to-br ${activeMode === 'assistant' ? 'from-[var(--primary-color)] to-blue-600' : 'from-[var(--secondary-color)] to-purple-600'} text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed`}>
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

const ChatbotFab: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="chatbot-fab fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 z-50">
                <i className={`fas text-2xl transition-transform duration-300 ${isOpen ? 'fa-times' : 'fa-robot'}`}></i>
            </button>
            <Chatbot isOpen={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
};

export default ChatbotFab;
