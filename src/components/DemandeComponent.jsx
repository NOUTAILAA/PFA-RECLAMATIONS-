import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './DemandsTable.css'; // Assurez-vous d'importer le fichier CSS

const DemandsTable = () => {
    const [demands, setDemands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        const fetchDemands = async () => {
            try {
                const response = await axios.get(`http://localhost:8061/demands?userId=${userId}`);
                setDemands(response.data);
            } catch (error) {
                console.error('Error fetching demands:', error);
            }
        };

        fetchDemands();
    }, []);

    const handleAddDemand = () => {
        navigate('/demandForm');
    };

    const handleViewMore = (demandId) => {
        navigate(`/demand/${demandId}`);
    };

    const handleViewProfile = () => {
        const userId = localStorage.getItem('userId');
        navigate(`/profile/${userId}`);
    };

    const filteredDemands = demands.filter(demand =>
        demand.sujet.toLowerCase().includes(searchTerm.toLowerCase()) ||
        demand.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="demands-table-container">
            <h2>Demands List</h2>
            <div className="button-group">
                <button onClick={handleAddDemand} className="action-button">Add Demand</button>
                <button onClick={handleViewProfile} className="action-button">Voir Profil</button>
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Rechercher par sujet ou description"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <table className="demands-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Subject</th>
                        <th>Description</th>
                        <th>State</th>
                        <th>Username</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredDemands.map((demand) => (
                        <tr key={demand.id}>
                            <td>{demand.id}</td>
                            <td>{demand.sujet}</td>
                            <td>{demand.description}</td>
                            <td>{demand.etat}</td>
                            <td>{demand.user?.username}</td>
                            <td>
                                {demand.etat === 'Demande rejetée' && (
                                    <button onClick={() => handleViewMore(demand.id)} className="btn btn-outline-danger">Voir plus</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DemandsTable;
