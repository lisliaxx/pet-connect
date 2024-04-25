import React, { createContext, useContext, useState } from 'react';
import petImages from '../images/golden.jpg';
import petImages2 from '../images/lab.jpg';
import petImages3 from '../images/poodle.jpeg';
import petImages4 from '../images/shiba.jpeg';
import petImages5 from '../images/german.jpeg';

const RecommendationsContext = createContext();

export function useRecommendations() {
    return useContext(RecommendationsContext);
}

export const RecommendationsProvider = ({ children }) => {
    const [recommendations, setRecommendations] = useState([
        { id: 1, name: 'Buddy', breed: 'Golden Retriever', age: 3, gender: 'Male', photoUrl: petImages },
        { id: 2, name: 'Max', breed: 'Labrador', age: 4, gender: 'Male', photoUrl: petImages2 },
        { id: 3, name: 'Bella', breed: 'Poodle', age: 2, gender: 'Female', photoUrl: petImages3 },
        { id: 4, name: 'Lily', breed: 'Shiba Inu', age: 3, gender: 'Female', photoUrl: petImages4 },
        { id: 5, name: 'Wolfy', breed: 'German Shepherd', age: 8, gender: 'Male', photoUrl: petImages5 }
    ]);
    const [currentRecommendationIndex, setCurrentRecommendationIndex] = useState(0);

    const value = {
        recommendations,
        setRecommendations,
        currentRecommendationIndex,
        setCurrentRecommendationIndex
    };

    return (
        <RecommendationsContext.Provider value={value}>
            {children}
        </RecommendationsContext.Provider>
    );
};
