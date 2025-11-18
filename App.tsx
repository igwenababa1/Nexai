
import React from 'react';
import { AppProvider } from './context/AppContext.tsx';
import Header from './components/Header.tsx';
import Footer from './components/Footer.tsx';
import ChatbotFab from './components/Chatbot.tsx';
import PageRenderer from './components/PageRenderer.tsx';
import VoiceControl from './components/VoiceControl.tsx';
import { ToastContainer } from './components/Toast.tsx';


const App: React.FC = () => {
    return (
        <AppProvider>
            <div className="flex flex-col min-h-screen bg-transparent">
                <Header />
                <main className="flex-grow container mx-auto px-4 py-8">
                    <div className="animate-fade-in">
                        <PageRenderer />
                    </div>
                </main>
                <Footer />
                <ChatbotFab />
                <VoiceControl />
                <ToastContainer />
            </div>
        </AppProvider>
    );
};

export default App;