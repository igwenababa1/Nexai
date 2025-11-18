
import React, { useMemo } from 'react';

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    const parsedContent = useMemo(() => {
        let html = content
            // Sanitize basic HTML
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        // Process markdown
        html = html
            .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>')
            .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 border-b border-white/20 pb-2">$1</h2>')
            .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code class="bg-black/50 px-1.5 py-1 rounded-md font-mono text-sm text-[#a6e22e]">$1</code>');

        // Handle lists
        html = html.replace(/^\s*[-*] (.*)/gm, '<li>$1</li>');
        html = html.replace(/^\s*\d+\. (.*)/gm, '<li>$1</li>'); // Treat ordered same as unordered for simplicity of regex

        // Wrap list items in <ul>
        html = html.replace(/<li>.*<\/li>/gs, (match) => `<ul>${match}</ul>`);
        html = html.replace(/<\/ul>\s?<ul>/g, '');

        // Line breaks
        html = html.replace(/\n/g, '<br />');
        // Remove <br> inside lists
        html = html.replace(/<ul><br \/>/g, '<ul>');
        html = html.replace(/<br \/><li>/g, '<li>');
        html = html.replace(/<\/li><br \/>/g, '</li>');

        return html;
    }, [content]);

    return (
        <div 
            className="markdown-content space-y-2" 
            dangerouslySetInnerHTML={{ __html: parsedContent }} 
            style={{
                lineHeight: '1.6',
            }}
        />
    );
};

export default MarkdownRenderer;
