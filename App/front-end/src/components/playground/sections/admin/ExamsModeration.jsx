import { useState, useEffect } from "react";
import "../../../../style/usersModeration.css";
import axiosInstance from '../../../../api/api';

const ExamsModeration = () => {
    const [exams, setExams] = useState([]);

    useEffect(() => {
        axiosInstance.get('/api/admin/get-exams', { withCredentials: true })
            .then(res => setExams(res.data))
            .catch(err => console.error("Error loading exams:", err));
    }, []);

    const handleApprove = (examId) => {
        axiosInstance.put(`/api/admin/approve-exam/${examId}`, {}, { withCredentials: true })
            .then(res => {
                const updated = exams.map(exam =>
                    exam._id === examId ? res.data : exam
                );
                setExams(updated);
            })
            .catch(err => {
                console.error("Error approving exam:", err);
            });
    };

    const handleDelete = (examId) => {
        axiosInstance.delete(`/api/admin/delete-exam/${examId}`, { withCredentials: true })
            .then(() => {
                const filtered = exams.filter(exam => exam._id !== examId);
                setExams(filtered);
            })
            .catch(err => {
                console.error("Error deleting exam:", err);
            });
    };

    return (
        <div className="users-moderation">
            <h2 className="section-title">📝 Exam Management</h2>

            <div className="card-section">
                <h3 className="card-title">📚 Exams List</h3>
                <div className="table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Subject</th>
                                <th>Questions</th>
                                <th>Approved</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exams?.map((exam, i) => (
                                <tr key={exam._id || i}>
                                    <td>{exam.title}</td>
                                    <td>{exam.subject}</td>
                                    <td>{exam.questions.length}</td>
                                    <td>{exam.isApproved ? "✅" : "❌"}</td>
                                    <td>
                                        {!exam.isApproved && (
                                            <button
                                                className="action-btn approve"
                                                onClick={() => handleApprove(exam._id)}
                                            >
                                                ✅ Approve
                                            </button>
                                        )}
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDelete(exam._id)}
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

export default ExamsModeration;
