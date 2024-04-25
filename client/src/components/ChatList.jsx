import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../style/likedProfiles.css'; 
import { useAuthToken } from '../AuthTokenContext';

function LikedProfiles() {
  const [profiles, setProfiles] = useState([]);
  const token = useAuthToken(); 

  useEffect(() => {
    const fetchLikedProfiles = async () => {
      const response = await fetch('http://localhost:8000/pet-interactions', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const likedProfiles = await response.json();
        setProfiles(likedProfiles.map(profile => ({
          id: profile.id,
          name: profile.name,
          photoUrl: profile.photoUrl || 'default-image-path.jpg', 
        })));
      } else {
        console.error('Failed to fetch liked profiles');
      }
    };

    fetchLikedProfiles();
  }, [token]);

  return (
    <div className="liked-profiles-container">
      <h2>Chat</h2>
      <ul className="profile-list">
        {profiles.length > 0 ? profiles.map(profile => (
          <li key={profile.id} className="profile-item">
            <img src={profile.photoUrl} alt={profile.name} className="profile-photo" />
            <div className="profile-info">
              <h3>{profile.name}</h3>
              <Link to={`/chat/${profile.id}`}>Chat</Link>
            </div>
          </li>
        )) : <p>No chat history available right now.</p>}
      </ul>
    </div>
  );
}

export default LikedProfiles;
