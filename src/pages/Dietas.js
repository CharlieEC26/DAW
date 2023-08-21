import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import useAuth from '../hooks/useAuth'; 
import '../DietList.css'; 

const DietList = () => {
  const [diets, setDiets] = useState([]);
  const [newDietName, setNewDietName] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const unsubscribe = db.collection('diets').onSnapshot((snapshot) => {
      const dietsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiets(dietsData);
    });

    return () => unsubscribe();
  }, []);

  const handleAddDiet = () => {
    if (newDietName) {
      db.collection('diets').add({ name: newDietName }).catch((error) => {
        console.error('Error, no se pudo agregar la dieta: ', error);
      });
      setNewDietName('');
    }
  };

  const renderAdminControls = () => {
    if (user && (user.role === 'Admin' || user.role === 'Instructor')) {
      return (
        <div>
          <h2>Agregar Nueva Dieta</h2>
          <input
            type="text"
            value={newDietName}
            onChange={(e) => setNewDietName(e.target.value)}
          />
          <button onClick={handleAddDiet}>Agregar</button>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2>Dietas Disponibles</h2>
      <ul>
        {diets.map((diet) => (
          <li key={diet.id}>{diet.name}</li>
        ))}
      </ul>
      {renderAdminControls()}
    </div>
  );
};
export default DietList;