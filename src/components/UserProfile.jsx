import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './UserProfile.css'; // Import the CSS file
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        email: '',
        mdp: '',
        role: '',
        tel: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://localhost:8061/users/${userId}`);
                setUser(response.data);
                setFormData({
                    username: response.data.username,
                    name: response.data.name,
                    email: response.data.email,
                    mdp: response.data.mdp,
                    role: response.data.role,
                    tel: response.data.tel,
                });
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchUser();
    }, [userId]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:8061/user/${userId}`, formData);
            setUser({
                ...user,
                ...formData,
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="user-profile-container">
            <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPqyKSgl0SqQ6kxcklpXJgijs3B_E212kVuvKxG-OeGQ&s"
                alt="Profile"
                className="profile-image"
            />
            <h2>User Profile</h2>
            {!isEditing ? (
                <>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Username:</strong> {user.username}</p>
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Telephone:</strong> {user.tel}</p>
                    <button onClick={() => setIsEditing(true)}>Modifier</button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username: </label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Name: </label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Email: </label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div>
                        <label>Password: </label>
                        <input type="text" name="mdp" value={formData.mdp} onChange={handleChange} />
                    </div>
                    
                    <div>
                        <label>Telephone: </label>
                        <input type="text" name="tel" value={formData.tel} onChange={handleChange} />
                    </div>
                    <div className="button-group">
                        <button type="submit" className="btn btn-outline-success" >Enregistrer</button>
                        <button type="button" className="btn btn-outline-danger" onClick={() => setIsEditing(false)}>Annuler</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UserProfile;
