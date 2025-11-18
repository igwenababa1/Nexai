
import { GoogleGenAI, Type, Chat, Modality } from "@google/genai";
import type { QuizData, QuestionType, ChatMessage, Question, GuideDepth, GuideFormat, StudyGuideData } from '../types.ts';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

// Create a new GoogleGenAI instance on-demand to ensure the latest API key is used,
// especially after user selection for features like Veo.
const getAiInstance = () => new GoogleGenAI({ apiKey: process.env.API_KEY });


const quizSchema = {
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "The title of the quiz." },
        topic: { type: Type.STRING, description: "The topic the quiz is about." },
        difficulty: { type: Type.STRING, description: "The difficulty level of the quiz." },
        numQuestions: { type: Type.INTEGER, description: "The number of questions in the quiz." },
        questions: {
            type: Type.ARRAY,
            description: "An array of quiz questions.",
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER, description: "A unique ID for the question." },
                    type: { type: Type.STRING, description: "The type of question (e.g., 'multiple-choice', 'matching')." },
                    question: { type: Type.STRING, description: "The question text itself or the instruction." },
                    options: {
                        type: Type.ARRAY,
                        description: "An array of possible answers for multiple-choice questions. Should be null for other types.",
                        items: { type: Type.STRING }
                    },
                    stems: {
                        type: Type.ARRAY,
                        description: "For matching questions, an array of stems/prompts. Null for other types.",
                        items: { type: Type.STRING }
                    },
                    responses: {
                        type: Type.ARRAY,
                        description: "For matching questions, an array of responses/options. Null for other types.",
                        items: { type: Type.STRING }
                    },
                    items: {
                        type: Type.ARRAY,
                        description: "For ordering questions, an array of items to be ordered. Null for other types.",
                        items: { type: Type.STRING }
                    },
                    answer: { type: Type.STRING, description: "The correct answer. For matching, describe pairings. For ordering, list items in correct order." },
                    explanation: { type: Type.STRING, description: "A brief explanation for the correct answer." }
                },
                required: ['id', 'type', 'question', 'answer', 'explanation']
            }
        }
    },
    required: ['title', 'topic', 'difficulty', 'numQuestions', 'questions']
};

export const generateQuiz = async (
    topic: string,
    difficulty: string,
    questionTypes: QuestionType[],
    numQuestions: number,
    sourceText?: string,
    explanationGuidelines?: string
): Promise<QuizData> => {
    const contextPrompt = sourceText
        ? `Use the following text as the ONLY source for all questions, answers, and explanations: """${sourceText}"""`
        : `The quiz should be about general knowledge on the given topic.`;
    
    const explanationPrompt = explanationGuidelines
        ? `The explanation for each question must follow these guidelines: "${explanationGuidelines}"`
        : `Each explanation should be helpful and clear.`;

    const prompt = `
        Generate a quiz on the topic of '${topic}'.
        ${contextPrompt}
        The difficulty level should be '${difficulty}'.
        It must contain exactly ${numQuestions} questions.
        The question types should be a mix of the following: ${questionTypes.join(', ')}.
        Your response must be a valid JSON object that strictly adheres to the provided schema.
        - For 'multiple-choice' questions, provide an 'options' array.
        - For 'matching' questions, provide 'stems' and 'responses' arrays of equal length. The 'answer' should clearly describe the correct pairings (e.g., 'Stem 1 - Response C, Stem 2 - Response A').
        - For 'ordering' questions, provide an 'items' array. The 'answer' should be a string listing the items in the correct order.
        - For all other question types ('true-false', 'fill-blank'), the 'options', 'stems', 'responses', and 'items' fields must be null.
        Ensure every question has a clear question, a correct answer, and a helpful explanation derived from the provided context if available.
        ${explanationPrompt}
    `;

    try {
        const ai = getAiInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
            },
        });
        const jsonText = response.text.trim();
        const quizData = JSON.parse(jsonText);
        return quizData as QuizData;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz. The model may have returned an invalid format.");
    }
};

export const generateStudyGuide = async (
    topic: string,
    depth: GuideDepth,
    format: GuideFormat
): Promise<StudyGuideData> => {
    const prompt = `
        Generate a comprehensive study guide on the topic of '${topic}'.
        The first line of your response must be the main title of the study guide, prefixed with "# ".
        The desired depth is '${depth}'. 
        The format should be a '${format}' style.

        Instructions for each format:
        - For 'key-points', use nested bullet points (using '-') with bolded terms to create a clear hierarchy of information.
        - For 'q-and-a', provide a series of questions prefixed with "## " followed by detailed answers.
        - For 'concept-map', describe the relationships between key concepts in a structured, hierarchical way. Use markdown headings ('##' for main concepts, '###' for sub-concepts) and bullet points to represent this structure.

        Your entire response must be well-structured, informative, and formatted using Markdown. Do not use any format other than Markdown.
    `;

    try {
         const ai = getAiInstance();
         const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        const fullText = response.text;
        const lines = fullText.split('\n');
        const title = lines.length > 0 ? lines[0].replace('#', '').trim() : `Study Guide: ${topic}`;
        const content = lines.slice(1).join('\n');

        return {
            title,
            topic,
            depth,
            format,
            content,
        };

    } catch (error) {
        console.error("Error generating study guide:", error);
        throw new Error("Failed to generate study guide. Please try again.");
    }
};

export const generateVisualExplanation = async (question: Question): Promise<string> => {
    const prompt = `
        Create a simple, clear, conceptual, monochrome pencil sketch style diagram. The drawing should visually explain the core concept from the following quiz question and answer. Do not include any text in the image itself.

        Question: "${question.question}"
        Correct Answer: "${question.answer}"
        Explanation: "${question.explanation}"
    `;

    try {
        const ai = getAiInstance();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error("No image data found in the response.");

    } catch (error) {
        console.error("Error generating visual explanation:", error);
        throw new Error("Failed to generate visual explanation image.");
    }
};

export const generateQuizArt = async (topic: string): Promise<string> => {
    const ai = getAiInstance();
    const prompt = `A creative, artistic, and abstract representation of the topic: '${topic}'. High quality, cinematic lighting, detailed, digital art style. Ensure the image is suitable for a quiz cover or background.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("No image generated.");
    } catch (error) {
        console.error("Error generating quiz art:", error);
        throw new Error("Failed to generate art. Please try again.");
    }
};

export const generateVideoSummary = async (topic: string, onProgress: (message: string) => void): Promise<string> => {
    onProgress("Initializing video generation...");
    const ai = getAiInstance();
    const prompt = `A short, visually engaging summary of ${topic}. Cinematic, educational, and abstract.`;

    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '16:9'
            }
        });

        onProgress("AI is processing the request...");

        while (!operation.done) {
            onProgress("AI is generating the video frames...");
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        
        onProgress("Finalizing video...");
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

        if (!downloadLink) {
            throw new Error("Video generation completed, but no download link was found.");
        }

        // Return the URL with the key appended, so the UI doesn't need to access process.env
        return `${downloadLink}&key=${process.env.API_KEY}`;
    } catch (error: any) {
        console.error("Error generating video summary:", error);
        // Check for specific API key error message
        if (error.message && error.message.includes("Requested entity was not found")) {
            throw new Error("Invalid API key. Please select a valid key and try again.");
        }
        throw new Error("Failed to generate video. Please try again later.");
    }
};


let assistantChat: Chat | null = null;
let tutorChat: Chat | null = null;

const createChatSession = (persona: 'assistant' | 'tutor'): Chat => {
    const ai = getAiInstance();
    const systemInstructions = {
        assistant: "You are Nexus, a friendly and knowledgeable AI learning assistant for the NexusLearn platform. Your goal is to help users with their studies. Be encouraging, clear, and concise. Format your answers with markdown for readability.",
        tutor: "You are a world-class AI Tutor on the NexusLearn platform. Your purpose is to guide students to a deeper understanding of topics using the Socratic method. Do not simply give answers. Instead, ask probing questions, break down complex concepts into smaller pieces, use analogies, and frequently check for understanding. Your tone should be patient, encouraging, and highly educational. Lead the student to their own discovery. Format your dialogue with markdown.",
    };

    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: systemInstructions[persona],
        },
    });
};

export const streamChatResponse = async (newMessage: string) => {
    if (!assistantChat) {
        assistantChat = createChatSession('assistant');
    }
    const responseStream = await assistantChat.sendMessageStream({ message: newMessage });
    return responseStream;
};

export const streamTutorResponse = async (newMessage: string) => {
    if (!tutorChat) {
        tutorChat = createChatSession('tutor');
    }
    const responseStream = await tutorChat.sendMessageStream({ message: newMessage });
    return responseStream;
};
