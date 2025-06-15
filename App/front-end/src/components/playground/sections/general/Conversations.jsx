import React, { useState, useEffect } from 'react';
import '../../../../style/conversations.css';
import Conversation from './Conversation';
import axiosInstance from '../../../../api/api';
import { useAuth } from '../../../../context/AuthContext';

const Conversations = () => {
    const [threads, setThreads] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedThreadId, setSelectedThreadId] = useState(null);
    const [selectedThreadUsername, setSelectedThreadUsername] = useState(null);

    const { user } = useAuth();

    const fetchConversations = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get('/api/conversations', { withCredentials: true });
            setThreads(res.data);
        } catch (err) {
            console.error('Fetch Conversations Error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleNewThread = async (e) => {
        e.preventDefault();
        if (!newTitle.trim() || !newDescription.trim()) return;

        try {
            await axiosInstance.post(
                '/api/create-conversation',
                { title: newTitle, description: newDescription },
                { withCredentials: true }
            );
            setNewTitle('');
            setNewDescription('');
            fetchConversations();
        } catch (err) {
            console.error('Create Conversation Error:', err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this conversation?')) return;
        try {
            await axiosInstance.delete(`/api/delete-conversation/${id}`, { withCredentials: true });
            setThreads((prev) => prev.filter((t) => t._id !== id));
        } catch (err) {
            console.error('Delete Conversation Error:', err);
        }
    };

    const handleClose = async (id) => {
        try {
            await axiosInstance.patch(`/api/close-conversation/${id}`, {}, { withCredentials: true });
            setThreads((prev) =>
                prev.map((t) => (t._id === id ? { ...t, isClosed: true } : t))
            );
        } catch (err) {
            console.error('Close Conversation Error:', err);
        }
    };

    const onThreadClick = (id, username) => {
        setSelectedThreadId(id);
        setSelectedThreadUsername(username);
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    const onBackFromConversation = () => {
        setSelectedThreadId(null);
        fetchConversations();
    };

    if (selectedThreadId) {
        return (
            <Conversation
                threadId={selectedThreadId}
                onBack={onBackFromConversation}
                username={selectedThreadUsername}
            />
        );
    }

    return (
        <div className="conversations container">
            <h1>💬 Student Conversations</h1>
            <p>Start discussions, ask questions, and share ideas with your classmates.</p>

            {user?.role === 'teacher' && (
                <section className="conversations-section">
                    <h2>Start a New Thread ✍️</h2>
                    <form className="new-thread-form" onSubmit={handleNewThread}>
                        <input
                            type="text"
                            placeholder="🎯 Thread Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                        />
                        <textarea
                            placeholder="📝 Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            rows={4}
                            style={{ resize: 'none' }}
                        />
                        <button type="submit" className="primary-btn">Post Thread ➕</button>
                    </form>
                </section>
            )}


            <h2 className="sticky-thread-title">🧵 Recent Threads</h2>

            <section className="scrollable-thread-list">
                {loading ? (
                    <p>Loading conversations...</p>
                ) : threads.length === 0 ? (
                    <div className="no-threads">
                        <p>🪹 No threads yet. Start the first conversation! ✨</p>
                    </div>
                ) : (
                    <div className="thread-list">
                        {threads.map((thread) => (
                            <div
                                className={`thread-card ${thread.isClosed ? 'closed' : ''}`}
                                key={thread._id}
                                onClick={() => onThreadClick(thread?._id, thread?.createdBy?.username)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h3>{thread.title}</h3>
                                <p>{thread.description}</p>
                                <p className="created-by">🧑‍🎓 By: {thread.createdBy?.username || 'Unknown'}</p>

                                <div className="comments">
                                    <p>💬 {thread.comments?.length || 0} comment{thread.comments?.length === 1 ? '' : 's'}</p>
                                </div>

                                {user?._id === thread?.createdBy?._id && (
                                    <div className="thread-actions" onClick={(e) => e.stopPropagation()}>
                                        {!thread.isClosed && (
                                            <button className="secondary-btn" onClick={() => handleClose(thread._id)}>
                                                Close 🛑
                                            </button>
                                        )}
                                        <button className="danger-btn" onClick={() => handleDelete(thread._id)}>
                                            Delete 🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Conversations;
