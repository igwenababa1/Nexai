
import React from 'react';

const TypingIndicator: React.FC = () => (
    <div className="flex justify-start">
        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] text-white rounded-bl-none">
            <div className="flex items-center space-x-1">
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
            </div>
        </div>
    </div>
);

export default TypingIndicator;
