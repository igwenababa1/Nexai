
import React from 'react';
import type { ChatMessage } from '../../types.ts';
import MarkdownRenderer from '../MarkdownRenderer.tsx';

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
    const isModel = message.role === 'model';
    return (
        <div className={`flex w-full ${isModel ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-md lg:max-w-2xl px-4 py-3 rounded-2xl ${isModel ? 'bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-bl-none' : 'bg-white/10 text-[var(--text-color)] rounded-br-none'}`}>
                 {isModel ? <MarkdownRenderer content={message.content} /> : <div>{message.content}</div>}
            </div>
        </div>
    );
};

export default MessageBubble;