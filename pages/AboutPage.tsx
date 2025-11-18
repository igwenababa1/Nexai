
import React from 'react';

const AboutPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30">
                <h2 className="text-4xl font-bold font-display text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">About NexusLearn AI</h2>
                <p className="text-center text-lg text-[var(--text-muted-color)] mb-10">
                    Our mission is to democratize education through AI-powered tools that make learning personalized, engaging, and accessible to everyone.
                </p>

                <div className="space-y-8">
                    <p>
                        NexusLearn AI combines cutting-edge artificial intelligence with pedagogical best practices to create dynamic learning experiences. Our platform, powered by Google's Gemini models, adapts to each learner's needs, providing customized content, assessments, and feedback to accelerate understanding and retention.
                    </p>

                    <div className="bg-black/20 p-6 rounded-lg border border-[var(--border-color)]">
                        <h3 className="text-2xl font-bold font-display mb-4">Our Founder</h3>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <img 
                                src="https://picsum.photos/seed/founder/150/150" 
                                alt="Founder" 
                                className="w-28 h-28 rounded-full border-4 border-[var(--primary-color)] object-cover"
                            />
                            <div>
                                <h4 className="text-xl font-bold">Dr. Alex Johnson</h4>
                                <p className="text-[var(--secondary-color)] font-semibold">AI Education Specialist</p>
                                <p className="text-sm mt-2 text-[var(--text-muted-color)]">
                                    With over 15 years in educational technology and AI research, Dr. Johnson founded NexusLearn AI to bridge the gap between cutting-edge AI and practical learning applications.
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-2xl font-bold font-display mb-4 text-center">What Our Users Say</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-black/20 p-6 rounded-lg border-l-4 border-[var(--primary-color)]">
                                <p className="italic">"NexusLearn AI has transformed how I study. The personalized quizzes help me focus on exactly what I need to learn."</p>
                                <p className="text-right font-semibold mt-2">- Sarah M., College Student</p>
                            </div>
                             <div className="bg-black/20 p-6 rounded-lg border-l-4 border-[var(--secondary-color)]">
                                <p className="italic">"As a teacher, I use this to create engaging assessments. It saves me hours of prep time and the students love it!"</p>
                                <p className="text-right font-semibold mt-2">- Michael T., High School Teacher</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
