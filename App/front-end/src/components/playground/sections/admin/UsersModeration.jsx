import { useState, useEffect } from "react";
import "../../../../style/usersModeration.css";
import axiosInstance from '../../../../api/api';

const UsersModeration = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axiosInstance.get('/api/admin/get-users', { withCredentials: true })
            .then(res => setUsers(res.data))
            .catch(err => console.error("Error loading users:", err));
    }, []);

    const handleUserChange = (index, field, value) => {
        const updatedUsers = [...users];
        updatedUsers[index] = { ...updatedUsers[index], [field]: value };
        setUsers(updatedUsers);
    };

    const handleSave = (user) => {
        axiosInstance.put(`/api/admin/update-user/${user.id}`, {
            username: user.username,
            role: user.role
        }, { withCredentials: true })
            .then(res => {
                console.log("User updated:", res.data);
            })
            .catch(err => {
                console.error("Error updating user:", err);
            });
    };


    const handleDelete = (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        axiosInstance.delete(`/api/admin/delete-user/${userId}`, { withCredentials: true })
            .then(() => {
                setUsers(prev => prev.filter(user => user.id !== userId));
            })
            .catch(err => {
                console.error("Error deleting user:", err);
            });
    };


    return (
        <div className="users-moderation">
            <h2 className="section-title">👥 User Management</h2>

            <div className="card-section">
                <h3 className="card-title">📋 Users List</h3>
                <div className="table-wrapper">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, index) => (
                                <tr key={u.id}>
                                    <td>
                                        <input
                                            type="text"
                                            value={u.username}
                                            onChange={(e) => handleUserChange(index, 'username', e.target.value)}
                                        />
                                    </td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select
                                            value={u.role}
                                            onChange={(e) => handleUserChange(index, 'role', e.target.value)}
                                        >
                                            <option value="student">Student</option>
                                            <option value="teacher">Teacher</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="action-buttons" style={{ display: "flex", gap: "8px" }}>
                                            <button className="action-btn save" onClick={() => handleSave(u)}>💾 Save</button>
                                            <button className="action-btn delete" onClick={() => handleDelete(u.id)}>🗑️ Delete</button>
                                        </div>
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

export default UsersModeration;
