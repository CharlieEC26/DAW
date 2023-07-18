import React, { useState } from 'react';
import '../DietList.css'; // Archivo de estilos CSS

const DietList = () => {
  const [diets, setDiets] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  //handle para agregar las dietas
  const handleAddDiets = () => {
    if (inputValue.trim() !== '') {
      const newDiet = {
        id: Date.now(),
        text: inputValue,
      };
      setDiets([...diets, newDiet]);
      setInputValue('');
    }
  };
  //handle para editar las dietas
  const handleEditDiets = (id, newText) => {
    const updatedDiets = diets.map((diet) =>
    diet.id === id ? { ...diet, text: newText } : diet
    );
    setDiets(updatedDiets);
  };
  //handle para eliminar las dietas
  const handleDeleteDiets = (id) => {
    const updatedDiets = diets.filter((diet) => diet.id !== id);
    setDiets(updatedDiets);
  };

  return (
    <div className="diet-container">
      <h1>Dietas</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digita la nueva dieta"
        />
        <button onClick={handleAddDiets}>Agregar</button>
      </div>
      <ul className="todo-list">
        {diets.map((diet) => (
          <li key={diet.id}>
            <input
              type="text"
              value={diet.text}
              onChange={(e) => handleEditDiets(diet.id, e.target.value)}
            />
            <button onClick={() => handleDeleteDiets(diet.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DietList;