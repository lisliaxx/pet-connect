import React, { useState, useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import '../style/profile.css';

function Profile() {
  const { user, getAccessTokenSilently } = useAuth0();
  const [petId, setPetId] = useState('');
  const [pet, setPet] = useState({ name: '', gender: '', age: '', breed: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const petId = 1;
    if (!petId) return;
    const fetchPet = async () => {
      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`http://localhost:8000/pets/${petId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setPet(data);
        } else {
          throw new Error('Failed to fetch pet data');
        }
      } catch (err) {
        console.error('Error fetching pet details:', err);
        alert(err.message);
      }
    };

    fetchPet();
  }, [petId, getAccessTokenSilently]);

  const handleEdit = (e) => {
    e.preventDefault(); 
    setEditing(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPet(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!editing) return;

    try {
      const petId = 1;
      const token = await getAccessTokenSilently();
      const response = await fetch(`http://localhost:8000/pets/${petId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(pet),
      });

      if (response.ok) {
        setEditing(false);
      } else {
        throw new Error('Failed to update pet profile');
      }
    } catch (err) {
      console.error('Error updating pet details:', err);
      alert(err.message);
    }
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <img src={user.picture} alt={user.name} className="profile-picture" />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <div className="pet-info">
        <h2>Pet's Info</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" value={pet.name} onChange={handleChange} disabled={!editing} placeholder="Pet's Name" />
          <input type="text" name="gender" value={pet.gender} onChange={handleChange} disabled={!editing} placeholder="Gender" />
          <input type="number" name="age" value={pet.age} onChange={handleChange} disabled={!editing} placeholder="Age" />
          <input type="text" name="breed" value={pet.breed} onChange={handleChange} disabled={!editing} placeholder="Breed" />
          {editing ? (
            <button type="submit">Save Changes</button>
          ) : (
            <button onClick={handleEdit}>Edit</button>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
