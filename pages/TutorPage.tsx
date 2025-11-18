
import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { ChatMessage } from '../types.ts';
import { streamTutorResponse } from '../services/geminiService.ts';
import MessageBubble from '../components/chat/MessageBubble.tsx';
import TypingIndicator from '../components/chat/TypingIndicator.tsx';

const conversationStarters = [
    "Explain quantum computing like I'm five.",
    "Why is the sky blue?",
    "Break down the process of photosynthesis.",
    "Tell me about the historical significance of the Silk Road.",
];

const TutorPage: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: 'model', content: "Welcome! I am your AI Tutor. What complex topic can I help you understand today? Feel free to ask me anything or select one of the prompts below." }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatHistoryRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = useCallback(async (textOverride?: string) => {
        const messageToSend = (textOverride || input).trim();
        if (!messageToSend || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', content: messageToSend };
        setMessages(prev => [...prev, newUserMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await streamTutorResponse(messageToSend);
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    if(newMessages.length > 0) {
                       newMessages[newMessages.length - 1].content = modelResponse;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Tutor chat error:", error);
            const errorMessage: ChatMessage = { role: 'model', content: "I apologize, I seem to be having trouble connecting. Please try again in a moment." };
            setMessages(prev => {
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
    }, [input, isLoading, messages]);
    
    return (
        <div className="w-full max-w-4xl mx-auto h-[80vh] flex flex-col">
            <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30 flex flex-col h-full overflow-hidden">
                <header className="p-4 border-b border-[var(--border-color)] text-center">
                    <h2 className="text-3xl font-bold font-display text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">AI Tutor Session</h2>
                    <p className="text-sm text-[var(--text-muted-color)]">Your personal guide to understanding complex topics.</p>
                </header>

                <div ref={chatHistoryRef} className="flex-1 p-6 space-y-4 overflow-y-auto">
                    {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
                    {isLoading && messages[messages.length - 1]?.content === '' && <TypingIndicator />}
                </div>

                {!isLoading && messages.length <= 1 && (
                     <div className="p-6 border-t border-[var(--border-color)]">
                        <h4 className="text-sm font-semibold mb-3 text-[var(--text-muted-color)]">Or try a conversation starter:</h4>
                        <div className="grid grid-cols-2 gap-3">
                            {conversationStarters.map(prompt => (
                                <button key={prompt} onClick={() => handleSend(prompt)} className="p-3 bg-white/5 rounded-lg text-left text-sm hover:bg-white/10 transition-colors">
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <footer className="p-4 bg-black/20 border-t border-[var(--border-color)]">
                     <div className="flex items-center gap-3">
                        <textarea
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                            placeholder="Ask the tutor a question..."
                            rows={1}
                            className="flex-1 p-3 bg-black/20 rounded-lg resize-none focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-colors disabled:opacity-50"
                            disabled={isLoading}
                        />
                        <button onClick={() => handleSend()} disabled={isLoading || !input.trim()} className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white flex items-center justify-center transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 disabled:cursor-not-allowed">
                            <i className="fas fa-paper-plane text-xl"></i>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default TutorPage;