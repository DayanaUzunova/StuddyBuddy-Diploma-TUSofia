import React, { useEffect, useState } from 'react';
import '../../../../style/conversation.css';
import axiosInstance from '../../../../api/api';

const Conversation = ({ threadId, onBack, username }) => {
    const [thread, setThread] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const fetchThread = async () => {
        try {
            setLoading(true);
            const res = await axiosInstance.get(`/api/conversations/${threadId}`, { withCredentials: true });
            setThread(res.data[0]);
        } catch (err) {
            console.error('Error fetching thread:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            setSubmitting(true);
            await axiosInstance.post(
                `/api/conversations/${threadId}/comment`,
                { text: newComment },
                { withCredentials: true }
            );
            setNewComment('');
            fetchThread();
        } catch (err) {
            console.error('Error posting comment:', err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchThread();
    }, [threadId]);

    if (loading || !thread) {
        return <div className="conversation container">🔄 Loading conversation...</div>;
    }

    return (
        <div className="conversation container">
            <button className="secondary-btn" onClick={onBack}>🔙 Back to Threads</button>

            <h1>🧵 {thread.title}</h1>
            <p className="thread-description">📝 {thread.description}</p>
            <p className="thread-meta">👤 By: {username || 'Unknown'}</p>

            {thread.isClosed && (
                <div className="thread-status">🚫 This conversation is closed</div>
            )}

            <section className="comments-section">
                <h2>💬 Comments</h2>
                {thread.comments?.length > 0 ? (
                    <ul className="comment-list">
                        {thread.comments.map((comment, idx) => (
                            <li key={comment._id || idx} className="comment-item">
                                <p className="comment-text">💡 {comment.text}</p>
                                <span className="comment-author">— 👤 {comment?.username || 'Anonymous'}</span>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>🕳️ No comments yet. Be the first to reply! 💬</p>
                )}
            </section>

            {!thread.isClosed && (
                <form className="comment-form" onSubmit={handleSubmitComment}>
                    <textarea
                        placeholder="✍️ Write your comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        rows={4}
                        style={{ resize: 'none' }}
                    />
                    <button type="submit" className="primary-btn" disabled={submitting}>
                        {submitting ? '📤 Posting...' : '🚀 Post Comment'}
                    </button>
                </form>
            )}
        </div>
    );
};

export default Conversation;
