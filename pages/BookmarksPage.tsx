
import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext.tsx';

const BookmarksPage: React.FC = () => {
    const { bookmarks, loadBookmark, removeBookmark } = useContext(AppContext);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-[var(--surface-color)]/80 backdrop-blur-sm p-8 md:p-12 rounded-xl border border-[var(--border-color)] shadow-2xl shadow-black/30">
                <h2 className="text-4xl font-bold font-display text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">
                    Bookmarked Quizzes
                </h2>
                <p className="text-center text-lg text-[var(--text-muted-color)] mb-10">
                    Load a previously saved quiz configuration to generate it again.
                </p>

                {bookmarks.length > 0 ? (
                    <div className="space-y-4">
                        {bookmarks.map(bookmark => (
                            <div key={bookmark.id} className="bg-black/20 p-4 rounded-lg border border-[var(--border-color)] flex items-center justify-between transition-all hover:border-[var(--primary-color)]">
                                <div>
                                    <h3 className="font-bold text-lg text-[var(--text-color)]">{bookmark.name}</h3>
                                    <p className="text-xs text-[var(--text-muted-color)] capitalize">
                                        {bookmark.config.difficulty} | {bookmark.config.numQuestions} Questions | {bookmark.config.questionTypes.length} Type(s)
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => loadBookmark(bookmark.id)}
                                        className="px-4 py-2 text-sm font-semibold rounded-md bg-blue-500/20 text-blue-300 hover:bg-blue-500/40 transition-colors"
                                        title="Load Quiz Configuration"
                                    >
                                        <i className="fas fa-upload mr-2"></i>
                                        Load
                                    </button>
                                    <button 
                                        onClick={() => removeBookmark(bookmark.id)}
                                        className="px-4 py-2 text-sm font-semibold rounded-md bg-red-500/20 text-red-300 hover:bg-red-500/40 transition-colors"
                                        title="Delete Bookmark"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-bookmark text-6xl text-[var(--text-muted-color)] mb-4"></i>
                        <h3 className="text-xl font-bold">No Bookmarks Yet</h3>
                        <p className="text-[var(--text-muted-color)]">
                            After generating a quiz, click the 'Bookmark' button to save its configuration here.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BookmarksPage;