import React, { useState } from 'react';
import '../providers/TodoList.css'; // Archivo de estilos CSS

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        id: Date.now(),
        text: inputValue,
      };
      setTodos([...todos, newTodo]);
      setInputValue('');
    }
  };

  const handleEditTodo = (id, newText) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <div className="todo-container">
      <h1>Dietas</h1>
      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Digita la nueva dieta"
        />
        <button onClick={handleAddTodo}>Agregar</button>
      </div>
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id}>
            <input
              type="text"
              value={todo.text}
              onChange={(e) => handleEditTodo(todo.id, e.target.value)}
            />
            <button onClick={() => handleDeleteTodo(todo.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;