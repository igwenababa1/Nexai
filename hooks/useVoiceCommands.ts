import { useState, useEffect, useRef, useCallback } from 'react';

// TypeScript definitions for SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface Command {
    command: string | string[];
    callback: (...args: any[]) => void;
    matchInterim?: boolean;
}

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const useVoiceCommands = (commands: Command[]) => {
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    const processTranscript = useCallback((transcript: string) => {
        for (const { command, callback } of commands) {
            const commandsToTest = Array.isArray(command) ? command : [command];
            for (const cmd of commandsToTest) {
                const regex = new RegExp(`^${cmd.replace(/\*/g, '(.*?)').replace(/\s/g, '\\s')}$`, 'i');
                const match = transcript.trim().match(regex);
                if (match) {
                    callback(...match.slice(1));
                    return true;
                }
            }
        }
        return false;
    }, [commands]);

    useEffect(() => {
        if (!SpeechRecognition) {
            console.error("Speech Recognition API not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognitionRef.current = recognition;

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                processTranscript(finalTranscript);
            }
        };

        recognition.onend = () => {
            if (isListening) {
                // Restart recognition if it stops unexpectedly while listening
                recognition.start();
            }
        };
        
        return () => {
            recognition.stop();
        };
    }, [processTranscript, isListening]);
    
    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
                setIsListening(true);
            } catch (err) {
                console.error("Error starting recognition:", err);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return { isListening, startListening, stopListening };
};

export default useVoiceCommands;
