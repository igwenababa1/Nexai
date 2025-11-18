import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';

// New FeatureCard component for the modernized links
const FeatureCard: React.FC<{
    icon: string;
    title: string;
    description: string;
    onClick: () => void;
    disabled: boolean;
}> = ({ icon, title, description, onClick, disabled }) => {
    return (
        <div className="relative group"> {/* Wrapper for tooltip */}
            <button
                onClick={onClick}
                disabled={disabled}
                className={`
                    w-full h-full p-4 rounded-lg bg-black/20 border border-[var(--border-color)] 
                    flex flex-col items-start text-left space-y-2 transition-all duration-300
                    ${disabled 
                        ? 'opacity-60 cursor-not-allowed' 
                        : 'hover:bg-white/10 hover:border-[var(--primary-color)] hover:-translate-y-1'
                    }
                `}
            >
                <i className={`${icon} text-2xl text-[var(--primary-color)] mb-1`}></i>
                <h4 className="font-bold font-display text-[var(--text-color)]">{title}</h4>
                <p className="text-xs text-[var(--text-muted-color)] leading-snug">{description}</p>
            </button>
            {disabled && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 
                               bg-gray-900 text-white text-xs rounded-lg shadow-lg 
                               opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    Coming Soon
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div> {/* Tooltip arrow */}
                </div>
            )}
        </div>
    );
};

const SocialLinkWithTooltip: React.FC<{ href: string; icon: string; name: string }> = ({ href, icon, name }) => {
    return (
        <div className="relative group">
            <a href={href} className="hover:text-[var(--primary-color)] transition-colors">
                <i className={`${icon} text-xl`}></i>
            </a>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                {name}
                <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-gray-900"></div>
            </div>
        </div>
    );
};


const Footer: React.FC = () => {
    const { navigateTo } = useContext(AppContext);
    
    // Feature list combining Quick Links and Resources
    const features = [
        {
            icon: 'fas fa-pen-ruler',
            title: 'Quiz Generator',
            description: 'Create custom quizzes on any topic instantly.',
            action: () => navigateTo('home'),
            disabled: false,
        },
        {
            icon: 'fas fa-graduation-cap',
            title: 'AI Tutor',
            description: 'Get personalized help from our AI assistant.',
            action: () => navigateTo('tutor'), 
            disabled: false,
        },
        {
            icon: 'fas fa-book-open',
            title: 'Study Guides',
            description: 'Generate comprehensive study materials.',
            action: () => navigateTo('guides'),
            disabled: false,
        },
        {
            icon: 'fas fa-headset',
            title: 'Support',
            description: 'Contact us for help and feedback.',
            action: () => navigateTo('contact'),
            disabled: false,
        }
    ];

    return (
        <footer className="bg-[var(--surface-color)]/80 text-[var(--text-muted-color)] mt-12 border-t border-[var(--border-color)]">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                             <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-full">
                                <i className="fas fa-brain text-xl text-white"></i>
                            </div>
                            <h2 className="text-2xl font-bold font-display text-[var(--text-color)]">NexusLearn AI</h2>
                        </div>
                        <p className="text-sm">Empowering learners with AI-driven educational tools and personalized learning experiences.</p>
                        <div className="flex space-x-4">
                            <SocialLinkWithTooltip href="#" icon="fab fa-twitter" name="Twitter" />
                            <SocialLinkWithTooltip href="#" icon="fab fa-linkedin" name="LinkedIn" />
                            <SocialLinkWithTooltip href="#" icon="fab fa-github" name="GitHub" />
                            <SocialLinkWithTooltip href="#" icon="fab fa-youtube" name="YouTube" />
                        </div>
                    </div>

                    {/* Modernized "Explore" Section */}
                    <div className="lg:col-span-2">
                        <h3 className="text-lg font-semibold font-display text-[var(--text-color)] mb-4">Explore</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {features.map((feature, index) => (
                                <FeatureCard 
                                    key={index} 
                                    {...feature} 
                                    onClick={feature.action} 
                                />
                            ))}
                        </div>
                    </div>
                    
                    {/* Contact Info */}
                     <div>
                        <h3 className="text-lg font-semibold font-display text-[var(--text-color)] mb-4">Contact Info</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <i className="fas fa-envelope text-[var(--primary-color)]"></i> 
                                <a href="mailto:info@nexuslearn.ai" className="hover:text-[var(--primary-color)] transition-colors">info@nexuslearn.ai</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <i className="fas fa-phone text-[var(--primary-color)]"></i> 
                                <a href="tel:+15551234567" className="hover:text-[var(--primary-color)] transition-colors">+1 (555) 123-4567</a>
                            </li>
                            <li className="flex items-center gap-3"><i className="fas fa-map-marker-alt text-[var(--primary-color)]"></i> San Francisco, CA</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="bg-black/20 py-4 text-center text-xs">
                © {new Date().getFullYear()} NexusLearn AI. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;