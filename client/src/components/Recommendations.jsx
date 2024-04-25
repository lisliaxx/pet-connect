import React, { useState } from 'react';
import { useAuthToken } from '../AuthTokenContext.js';
import { useRecommendations } from '../context/RecommendationsContext.js';
import '../style/recommendation.css';
import '../style/navBar.css'
import petImages from '../images/golden.jpg';
import petImages2 from '../images/lab.jpg';
import petImages3 from '../images/poodle.jpeg';

function Recommendations() {
  const { recommendations, setRecommendations
    , currentRecommendationIndex, setCurrentRecommendationIndex } = useRecommendations();

  const token = useAuthToken(); // Assume this hook provides the necessary Auth0 token

  const handleLikeDislike = async (liked) => {
    const currentPet = recommendations[currentRecommendationIndex];
    console.log(liked ? 'Liked' : 'Disliked', currentPet);

    // Send like/dislike information to the backend
    const response = await fetch('http://localhost:8000/pet-interactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        liked,
        name: currentPet.name,
        age: currentPet.age,
        gender: currentPet.gender,
        breed: currentPet.breed,
      }),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
    } else {
      const errorResponse = await response.json();
      console.error('Error:', errorResponse.message);
      alert(`Failed to record interaction: ${errorResponse.message}`);
    }

    const updatedRecommendations = recommendations.filter(pet => pet.id !== currentPet.id);
    setRecommendations(updatedRecommendations);
    setCurrentRecommendationIndex(currentRecommendationIndex >= updatedRecommendations.length ? 0 : currentRecommendationIndex);

    if (currentRecommendationIndex >= updatedRecommendations.length) {
      setCurrentRecommendationIndex(0);  
    }
  };

  return (
    <div className="recommendations-container">
      {recommendations.length > 0 ? (
        <div className="recommendation">
          <img src={recommendations[currentRecommendationIndex].photoUrl} alt="Pet" className="pet-photo" />
          <div className="pet-info">
            <h3>{recommendations[currentRecommendationIndex].name}</h3>
            <p>Breed: {recommendations[currentRecommendationIndex].breed}</p>
            <p>Age: {recommendations[currentRecommendationIndex].age} years</p>
            <p>Gender: {recommendations[currentRecommendationIndex].gender}</p>
          </div>
          <div className="actions">
            <button onClick={() => handleLikeDislike(false)} className="dislike-btn">💔</button>
            <button onClick={() => handleLikeDislike(true)} className="like-btn">💗</button>
          </div>
        </div>
      ) : (
        <p>No recommendations available right now.</p>
      )}
    </div>
  );
}

export default Recommendations;
