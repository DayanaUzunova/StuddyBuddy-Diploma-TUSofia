import { useState, useEffect } from "react";
import "../../../../style/usersModeration.css";
import axiosInstance from '../../../../api/api';

const GamesModeration = () => {
    const [games, setGames] = useState([]);
    const [form, setForm] = useState({
        title: "",
        subject: "Math",
        type: "card",
        description: ""
    });
    const [error, setError] = useState("");

    const allowedSubjects = [
        "Math", "Science", "History", "Geography",
        "Language", "Art", "Music", "Technology"
    ];

    const allowedGameTypes = ["card", "quiz"];

    useEffect(() => {
        axiosInstance.get('/api/admin/get-games', { withCredentials: true })
            .then(res => setGames(res.data))
            .catch(err => console.error("Error loading games:", err));
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = () => {
        const { title, subject, type } = form;

        if (!title || !subject || !type) {
            setError("Title, subject, and type are required.");
            return;
        };

        setGames([...games, { ...form, id: Date.now() }]);

        setForm({
            title: "",
            subject: "Math",
            type: "card",
            description: ""
        });

        setError("");
    };

    const handleApprove = (gameId) => {
        axiosInstance.put(`/api/admin/approve-game/${gameId}`, {}, { withCredentials: true })
            .then(res => {
                const updatedGames = games.map(game =>
                    game._id === gameId ? res.data : game
                );
                setGames(updatedGames);
            })
            .catch(err => {
                console.error("Error approving game:", err);
            });
    };

    const handleDelete = (gameId) => {
        axiosInstance.delete(`/api/admin/delete-game/${gameId}`, { withCredentials: true })
            .then(res => {
                setGames(games.filter(game => game._id !== gameId));
            })
            .catch(err => {
                console.error("Error deleting game:", err);
            });
    };

    return (
        <div className="users-moderation">
            <h2 className="section-title">🎮 Game Management</h2>

            <div className="card-section">
                <h3 className="card-title">📋 Games List</h3>
                <div className="table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Subject</th>
                                <th>Type</th>
                                <th>Approved</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {games?.map((g, i) => (
                                <tr key={g._id || i}>
                                    <td>{g.title}</td>
                                    <td>{g.subject}</td>
                                    <td>{g.type}</td>
                                    <td>{g.isApproved ? "✅" : "❌"}</td>
                                    <td>
                                        {!g.isApproved && (
                                            <button
                                                className="action-btn approve"
                                                onClick={() => handleApprove(g._id)}
                                            >
                                                ✅ Approve
                                            </button>
                                        )}
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(g._id)}
                                        >
                                            🗑️ Delete
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default GamesModeration;
