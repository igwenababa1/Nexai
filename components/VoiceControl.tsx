
import React, { useContext, useMemo } from 'react';
import useVoiceCommands from '../hooks/useVoiceCommands.ts';
import { AppContext } from '../context/AppContext.tsx';
import type { Page, Difficulty } from '../context/AppContext.tsx';
import type { QuestionType } from '../types.ts';

// Helper function to parse question types from natural language
const parseQuestionTypes = (typeString: string): { valid: QuestionType[], invalid: string[] } => {
    const typeMap: { [key: string]: QuestionType } = {
        'multiple choice': 'multiple-choice',
        'true false': 'true-false',
        'true or false': 'true-false',
        'fill in the blank': 'fill-blank',
        'fill blank': 'fill-blank',
        'matching': 'matching',
        'ordering': 'ordering',
    };

    const requestedTypes = typeString.split(/ and |,/i).map(t => t.trim().toLowerCase());
    const valid: QuestionType[] = [];
    const invalid: string[] = [];

    for (const type of requestedTypes) {
        if (typeMap[type]) {
            valid.push(typeMap[type]);
        } else if (type) {
            invalid.push(type);
        }
    }
    return { valid, invalid };
};


const VoiceControl: React.FC = () => {
    const {
        navigateTo,
        setFormDataQuiz,
        handleGenerateQuiz,
        addToast,
    } = useContext(AppContext);

    const commands = useMemo(() => [
        {
            command: ['navigate to * page', 'go to * page', 'show me the * page'],
            callback: (page: string) => {
                const pageLower = page.toLowerCase().trim();
                if (['home', 'guides', 'tutor', 'bookmarks', 'about', 'contact'].includes(pageLower)) {
                    addToast(`Navigating to ${pageLower} page...`);
                    navigateTo(pageLower as Page);
                } else {
                    addToast(`Sorry, I can't find the "${pageLower}" page.`, 'error');
                }
            }
        },
        // Combined, powerful commands (most specific first)
        {
            command: 'generate a * question quiz about * with *',
            callback: (countStr: string, topic: string, typeStr: string) => {
                const count = parseInt(countStr, 10);
                const { valid: types, invalid } = parseQuestionTypes(typeStr);

                if (isNaN(count) || count <= 0) {
                    addToast(`"${countStr}" is not a valid number of questions.`, 'error');
                    return;
                }
                if (invalid.length > 0) {
                    addToast(`Could not recognize question type(s): ${invalid.join(', ')}.`, 'error');
                }
                 if (types.length === 0) {
                    addToast(`No valid question types provided in "${typeStr}".`, 'error');
                    return;
                }
                
                addToast(`Generating a ${count}-question quiz about "${topic}" with ${types.join(', ')} types...`);
                setFormDataQuiz(prev => ({...prev, topic, numQuestions: count, questionTypes: types}));
                handleGenerateQuiz();
            }
        },
        {
            command: 'generate a * question quiz with *',
            callback: (countStr: string, typeStr: string) => {
                const count = parseInt(countStr, 10);
                const { valid: types, invalid } = parseQuestionTypes(typeStr);

                if (isNaN(count) || count <= 0) {
                    addToast(`"${countStr}" is not a valid number of questions.`, 'error');
                    return;
                }
                if (invalid.length > 0) {
                    addToast(`Could not recognize question type(s): ${invalid.join(', ')}.`, 'error');
                }
                if (types.length === 0) {
                    addToast(`No valid question types provided in "${typeStr}".`, 'error');
                    return;
                }
                
                addToast(`Generating a ${count}-question quiz with ${types.join(', ')} types...`);
                setFormDataQuiz(prev => ({...prev, numQuestions: count, questionTypes: types}));
                handleGenerateQuiz();
            }
        },
        {
            command: 'generate quiz about *',
            callback: (topic: string) => {
                addToast(`Setting topic to "${topic}" and generating quiz...`);
                setFormDataQuiz(prev => ({...prev, topic}));
                handleGenerateQuiz();
            }
        },
        {
            command: ['generate quiz', 'create quiz', 'start quiz'],
            callback: () => {
                addToast('Generating quiz now...');
                handleGenerateQuiz();
            }
        },
        // Individual setters
        {
            command: 'set topic to *',
            callback: (topic: string) => {
                addToast(`Setting topic to: ${topic}`);
                setFormDataQuiz(prev => ({...prev, topic}));
            }
        },
        {
            command: 'set number of questions to *',
            callback: (countStr: string) => {
                const count = parseInt(countStr, 10);
                if (!isNaN(count) && count > 0 && count <= 50) {
                    addToast(`Setting number of questions to ${count}.`);
                    setFormDataQuiz(prev => ({...prev, numQuestions: count}));
                } else {
                    addToast(`"${countStr}" is not a valid number (1-50).`, 'error');
                }
            }
        },
        {
            command: 'set difficulty to *',
            callback: (difficulty: string) => {
                const diffLower = difficulty.toLowerCase().trim();
                 if (['easy', 'medium', 'hard'].includes(diffLower)) {
                    addToast(`Setting difficulty to ${diffLower}.`);
                    setFormDataQuiz(prev => ({...prev, difficulty: diffLower as Difficulty }));
                } else {
                    addToast(`Invalid difficulty: "${difficulty}". Please say easy, medium, or hard.`, 'error');
                }
            }
        },
        {
            command: ['add * questions', 'select * questions', 'include * questions'],
            callback: (typeStr: string) => {
                const { valid: typesToAdd, invalid } = parseQuestionTypes(typeStr);
                if (invalid.length > 0) {
                    addToast(`Could not recognize question type(s): ${invalid.join(', ')}.`, 'error');
                }
                if (typesToAdd.length > 0) {
                    addToast(`Adding question type(s): ${typesToAdd.join(', ')}`);
                    setFormDataQuiz(prev => {
                        const newTypes = new Set([...prev.questionTypes, ...typesToAdd]);
                        return {...prev, questionTypes: Array.from(newTypes)};
                    });
                }
            }
        },
        {
            command: ['remove * questions', 'unselect * questions', 'exclude * questions'],
            callback: (typeStr: string) => {
                const { valid: typesToRemove, invalid } = parseQuestionTypes(typeStr);
                 if (invalid.length > 0) {
                    addToast(`Could not recognize question type(s): ${invalid.join(', ')}.`, 'error');
                }
                if (typesToRemove.length > 0) {
                    addToast(`Removing question type(s): ${typesToRemove.join(', ')}`);
                    setFormDataQuiz(prev => {
                        const typesToRemoveSet = new Set(typesToRemove);
                        const newTypes = prev.questionTypes.filter(t => !typesToRemoveSet.has(t));
                        return {...prev, questionTypes: newTypes};
                    });
                }
            }
        },
        {
            command: ['clear question types', 'reset question types'],
            callback: () => {
                addToast('Clearing all selected question types.');
                setFormDataQuiz(prev => ({...prev, questionTypes: []}));
            }
        },
        {
            command: 'set source text to *',
            callback: (text: string) => {
                addToast(`Setting source text.`);
                setFormDataQuiz(prev => ({...prev, sourceText: text}));
            }
        },
        {
            command: 'clear source text',
            callback: () => {
                addToast(`Clearing source text.`);
                setFormDataQuiz(prev => ({...prev, sourceText: ''}));
            }
        },
        {
            command: 'set explanation guidelines to *',
            callback: (text: string) => {
                addToast(`Setting explanation guidelines.`);
                setFormDataQuiz(prev => ({...prev, explanationGuidelines: text}));
            }
        },
        {
            command: 'clear explanation guidelines',
            callback: () => {
                addToast(`Clearing explanation guidelines.`);
                setFormDataQuiz(prev => ({...prev, explanationGuidelines: ''}));
            }
        }
    ], [navigateTo, setFormDataQuiz, handleGenerateQuiz, addToast]);

    const { isListening, startListening, stopListening } = useVoiceCommands(commands);

    const toggleListening = () => {
        if (isListening) {
            stopListening();
            addToast('Voice control deactivated.', 'info');
        } else {
            startListening();
            addToast('Voice control activated!', 'success');
        }
    };
    
    return (
        <button
            onClick={toggleListening}
            className={`fixed bottom-6 left-6 w-16 h-16 rounded-full text-white flex items-center justify-center shadow-lg transform transition-all hover:scale-110 z-50 ${
                isListening 
                ? 'bg-gradient-to-br from-red-500 to-red-700 animate-pulse' 
                : 'bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)]'}`}
            aria-label={isListening ? 'Stop voice commands' : 'Start voice commands'}
        >
            <i className="fas fa-microphone-alt text-2xl"></i>
        </button>
    );
};

export default VoiceControl;