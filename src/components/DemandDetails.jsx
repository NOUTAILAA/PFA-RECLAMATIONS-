import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DemandDetails.css'; // Assurez-vous d'importer le fichier CSS

const DemandDetails = () => {
    const { id } = useParams();
    const [demand, setDemand] = useState(null);

    useEffect(() => {
        const fetchDemand = async () => {
            try {
                const response = await axios.get(`http://localhost:8061/demands/${id}`);
                setDemand(response.data);
            } catch (error) {
                console.error('Error fetching demand details:', error);
            }
        };

        fetchDemand();
    }, [id]);

    if (!demand) {
        return <p>Loading...</p>;
    }

    return (
        <div className="demand-details-container">
            <h2>Demand Details</h2>
            <div className="demand-details">
                <p><strong>ID:</strong> {demand.id}</p>
                <p><strong>Subject:</strong> {demand.sujet}</p>
                <p><strong>Description:</strong> {demand.description}</p>
                <p><strong>Date:</strong> {new Date(demand.date).toLocaleString()}</p>
                <p><strong>Status:</strong> {demand.etat}</p>
                {demand.etat === 'Demande rejetée' && (
                    <p><strong>Rejection Reason:</strong> {demand.rejectionReason}</p>
                )}
            </div>
        </div>
    );
};

export default DemandDetails;
