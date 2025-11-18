
import React, { useState } from 'react';

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setSubmitted(true);
    };

    return (
        <div className="max-w-4xl mx-auto">
             <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30">
                <h2 className="text-4xl font-bold font-display text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">Contact Us</h2>
                <p className="text-center text-lg text-[var(--text-muted-color)] mb-10">
                    Have questions, feedback, or need support? We'd love to hear from you!
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold font-display">Get In Touch</h3>
                        <p className="text-[var(--text-muted-color)]">We typically respond within 24 hours during business days.</p>
                        <div className="space-y-3">
                           <div className="flex items-center gap-4"><i className="fas fa-envelope text-xl text-[var(--primary-color)]"></i><span>info@nexuslearn.ai</span></div>
                           <div className="flex items-center gap-4"><i className="fas fa-phone text-xl text-[var(--primary-color)]"></i><span>+1 (555) 123-4567</span></div>
                           <div className="flex items-center gap-4"><i className="fas fa-map-marker-alt text-xl text-[var(--primary-color)]"></i><span>San Francisco, CA</span></div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    {submitted ? (
                        <div className="flex flex-col items-center justify-center bg-black/20 p-8 rounded-lg text-center">
                            <i className="fas fa-check-circle text-5xl text-green-400 mb-4"></i>
                            <h3 className="text-xl font-bold">Thank You!</h3>
                            <p className="text-[var(--text-muted-color)]">Your message has been sent. We'll get back to you soon.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="sr-only">Name</label>
                                <input type="text" name="name" id="name" placeholder="Your Name" required value={formData.name} onChange={handleInputChange} className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all" />
                            </div>
                             <div>
                                <label htmlFor="email" className="sr-only">Email</label>
                                <input type="email" name="email" id="email" placeholder="Your Email" required value={formData.email} onChange={handleInputChange} className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all" />
                            </div>
                             <div>
                                <label htmlFor="subject" className="sr-only">Subject</label>
                                <input type="text" name="subject" id="subject" placeholder="Subject" required value={formData.subject} onChange={handleInputChange} className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all" />
                            </div>
                            <div>
                                <label htmlFor="message" className="sr-only">Message</label>
                                <textarea name="message" id="message" placeholder="Your Message" required rows={4} value={formData.message} onChange={handleInputChange} className="w-full bg-black/20 p-3 rounded-md border border-[var(--border-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:outline-none transition-all"></textarea>
                            </div>
                            <button type="submit" className="w-full text-lg font-bold p-3 rounded-lg bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white transition-transform hover:scale-105 active:scale-100">
                                Send Message
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
