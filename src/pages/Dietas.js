import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import useAuth from '../hooks/useAuth';
import { collection, onSnapshot, addDoc, doc, updateDoc, deleteDoc, query, where, getDocs  } from 'firebase/firestore';
import '../DietLists.css';

const DietList = () => {
  const [diets, setDiets] = useState([]);
  const [newDietName, setNewDietName] = useState('');
  const [dietName, setDietName] = useState('');
  const [user, setUser] = useState(null);
  const [editingDietId, setEditingDietId] = useState(null);
  const [isAdminOrInstructor, setIsAdminOrInstructor] = useState(false);

  const [authUser, setAuthUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);


const getAuthenticatedUserInfo = () => {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email,

    };
  } else {
    return null;
  }
};

 
  const verifyUserRoleAndFetchDiets = async () => {
    if (authUser && authUser.email) {
      const dbUserInfo = await searchUserByEmail(authUser.email);
      if (dbUserInfo && dbUserInfo.email === authUser.email) {
        setIsAdminOrInstructor(dbUserInfo.role === 'Admin' || dbUserInfo.role === 'Instructor');
      }
    }
  };

  useEffect(() => {
    const fetchAndVerify = async () => {
      await fetchAuthenticatedUserInfo();
      verifyUserRoleAndFetchDiets();
    };

    fetchAndVerify();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'diets'), (snapshot) => {
      const dietsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDiets(dietsData);
    });

    return () => {
      unsubscribe();
    };
  }, [isAdminOrInstructor]);

  // ...

 

const fetchAuthenticatedUserInfo = async () => {
  const userInfo = getAuthenticatedUserInfo();
  setAuthUser(userInfo);

  if (userInfo && userInfo.email) {
    const dbUserInfo = await searchUserByEmail(userInfo.email);
    if (dbUserInfo && dbUserInfo.email === userInfo.email) {
      setAuthUser(dbUserInfo);
      setIsAdminOrInstructor(dbUserInfo.role === 'Admin' || dbUserInfo.role === 'Instructor');
      verifyUserRoleAndFetchDiets();
    }
  }
};

  const searchUserByEmail = async (email) => {
    try {
      const usersCollection = collection(db, 'users');
      const q = query(usersCollection, where('email', '==', email));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        return { id: userDoc.id, ...userDoc.data() };
        
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      return null;
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

  const handleAddDiet = async () => {
    if (dietName) {
      try {
        if (editingDietId) {
          await updateDiet(editingDietId, dietName);
          setEditingDietId(null);
        } else {
          await addDiet(dietName);
        }
        setDietName('');
      } catch (error) {
        console.error('Error al agregar/actualizar la dieta:', error);
      }
    }
  };
  const addDiet = async (name) => {
    await addDoc(collection(db, 'diets'), { name });
    console.log('Dieta agregada exitosamente');
  };

  const updateDiet = async (id, name) => {
    const dietRef = doc(db, 'diets', id);
    await updateDoc(dietRef, { name });
    console.log('Dieta actualizada exitosamente');
  };

  const handleEditDiet = (dietId, dietName) => {
    setEditingDietId(dietId);
    setDietName(dietName);
  };

  const handleDeleteDiet = async (dietId) => {
    try {
      const dietRef = doc(db, 'diets', dietId);
      await deleteDoc(dietRef);
      console.log('Dieta eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar la dieta:', error);
    }
  };
  return (
    <div>
      <h1>Gestión de Dietas</h1>
      
      
      {isAdminOrInstructor && (
        <div>
          <h2>Agregar/Editar Dieta</h2>
          <input
            className="add-diet-input"
            type="text"
            value={dietName}
            onChange={(e) => setDietName(e.target.value)}
            placeholder="Nombre de la dieta"
          />
          <button className="button button-primary" onClick={handleAddDiet}>
            {editingDietId ? 'Actualizar Dieta' : 'Agregar Dieta'}
          </button>
        </div>
      )}
      
      <h2>Lista de Dietas</h2>
      <ul className="diet-list">
        {diets.map((diet) => (
          <li key={diet.id} className="diet-item">
            {diet.name}
            {isAdminOrInstructor && (
              <div className="diet-actions">
                <button
                  className="button button-primary"
                  onClick={() => handleEditDiet(diet.id, diet.name)}
                >
                  Editar
                </button>
                <button
                  className="button button-danger"
                  onClick={() => handleDeleteDiet(diet.id)}
                >
                  Eliminar
                </button>
              </div>
            )}
            
            {dbUser && dbUser.role === 'Usuario' && (
              <div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default DietList;