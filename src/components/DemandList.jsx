import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DemandsList.css'; // Import the CSS file for styling

const DemandsList = () => {
  const [demands, setDemands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDemands, setFilteredDemands] = useState([]);
  const [showAccepted, setShowAccepted] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', name: '', email: '', mdp: '', tel: '' });
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    const fetchDemands = async () => {
      try {
        const response = await axios.get('http://localhost:8061/demands');
        setDemands(response.data);
        setFilteredDemands(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDemands();
  }, []);

  const handleSearch = () => {
    const filtered = demands.filter(demand =>
      demand.sujet.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDemands(filtered);
  };

  const handleAccept = async (id) => {
    try {
      await axios.put(`http://localhost:8061/demands/${id}/accept`);
      setFilteredDemands((prevDemands) =>
        prevDemands.map((demand) =>
          demand.id === id ? { ...demand, etat: 'Demande acceptée' } : demand
        )
      );
    } catch (error) {
      console.error('Failed to accept the demand:', error);
    }
  };

  const handleReject = async (id) => {
    const rejectionReason = prompt("Enter rejection reason:");
    if (!rejectionReason) return; // Handle if user cancels input
    
    try {
        await axios.put(`http://localhost:8061/demands/${id}/reject`, { rejectionReason });
        setFilteredDemands((prevDemands) =>
            prevDemands.map((demand) =>
                demand.id === id ? { ...demand, etat: 'Demande rejetée', rejectionReason: rejectionReason } : demand
            )
        );
    } catch (error) {
        console.error('Failed to reject the demand:', error);
    }
  };

  const handleShowAccepted = () => {
    const acceptedDemands = demands.filter(demand => demand.etat === 'Demande acceptée');
    setFilteredDemands(acceptedDemands);
    setShowAccepted(true);
    setShowRejected(false);
  };

  const handleShowRejected = () => {
    const rejectedDemands = demands.filter(demand => demand.etat === 'Demande rejetée');
    setFilteredDemands(rejectedDemands);
    setShowAccepted(false);
    setShowRejected(true);
  };

  const handleShowAll = () => {
    setFilteredDemands(demands);
    setShowAccepted(false);
    setShowRejected(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8061/users');
      const filteredUsers = response.data.filter(user => user.username !== 'admin');
      setUsers(filteredUsers);
      setShowUsers(true);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const handleShowUsers = () => {
    if (!showUsers) {
      fetchUsers();
    } else {
      setShowUsers(false);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
  };

  const handleSaveUser = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:8061/user/${editUser.id}`, editUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editUser.id ? editUser : user
        )
      );
      setEditUser(null);
    } catch (err) {
      console.error('Failed to save user:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8061/user', newUser);
      setUsers((prevUsers) => [...prevUsers, response.data]);
      setNewUser({ username: '', name: '', email: '', mdp: '', tel: '' });
      setShowAddUserForm(false);
    } catch (err) {
      console.error('Failed to add user:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="demands-list-container">
      <h2>All Demands</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Rechercher par sujet"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button className="btn btn-outline-dark" onClick={handleSearch}>Rechercher</button>
        <button className="btn btn-outline-primary" onClick={showAccepted ? handleShowAll : handleShowAccepted}>
          {showAccepted ? 'Afficher Tout' : 'Afficher Acceptés Seulement'}
        </button>
        <button className="btn btn-outline-danger" onClick={showRejected ? handleShowAll : handleShowRejected}>
          {showRejected ? 'Afficher Tout' : 'Afficher Refusés Seulement'}
        </button>
        <button className="btn btn-outline-info" onClick={handleShowUsers}>
          {showUsers ? 'Cacher Utilisateurs' : 'Afficher Utilisateurs'}
        </button>
      </div>
      {showUsers ? (
        <div>
          <h3>Utilisateurs</h3>
          <button className="btn btn-outline-success" onClick={() => setShowAddUserForm(true)}>Add User</button>
          {showAddUserForm && (
            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-group">
                <label>Username:</label>
                <input type="text" name="username" value={newUser.username} onChange={handleNewUserChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" value={newUser.name} onChange={handleNewUserChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={newUser.email} onChange={handleNewUserChange} className="form-control" />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input type="password" name="mdp" value={newUser.mdp} onChange={handleNewUserChange} className="form-control" />
              </div>
              
              <div className="form-group">
                <label>Tel:</label>
                <input type="tel" name="tel" value={newUser.tel} onChange={handleNewUserChange} className="form-control" />
              </div>
              <div className="form-actions">
                <button className="btn btn-outline-success" type="submit">Add</button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => setShowAddUserForm(false)}>Cancel</button>
              </div>
            </form>
          )}
          {editUser ? (
            <form onSubmit={handleSaveUser} className="edit-user-form">
              <div className="form-group">
                <label>Username:</label>
                <input type="text" name="username" value={editUser.username} onChange={handleChange} className="form-control"/>
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input type="text" name="name" value={editUser.name} onChange={handleChange} className="form-control"/>
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" name="email" value={editUser.email} onChange={handleChange} className="form-control"/>
              </div>
              <div className="form-group">
                <label>Tel:</label>
                <input type="tel" name="tel" value={editUser.tel} onChange={handleChange} className="form-control"/>
              </div>
              <div className="form-actions">
                <button className="btn btn-outline-success" type="submit">Save</button>
                <button className="btn btn-outline-secondary" type="button" onClick={() => setEditUser(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Tel</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.tel}</td>
                    <td>
                      <button className="btn btn-outline-warning" onClick={() => handleEditUser(user)}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div>
          <table className="demands-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Subject</th>
                <th>Description</th>
                <th>Status</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemands.map((demand) => (
                <tr key={demand.id}>
                  <td>{demand.id}</td>
                  <td>{demand.sujet}</td>
                  <td>{demand.description}</td>
                  <td>{demand.etat}</td>
                  <td>{demand.user ? demand.user.username : 'Unknown User'}</td>
                  <td>
                    <button className="btn btn-outline-success" onClick={() => handleAccept(demand.id)}>Accepter</button>
                    <button className="btn btn-outline-danger" onClick={() => handleReject(demand.id)}>Rejeter</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DemandsList;
