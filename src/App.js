import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import './App.css';
import Main from './Routes/Main';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token')); // Храним токен в state
  const [activeFlag, setActiveFlag] = useState(false); // Состояние для управления классом active

  const [activeProfile, setActiveProfile] = useState(false);

  // Проверяем, если токен уже в localStorage, восстанавливаем его в state
  useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
      const showFlagTimer = setTimeout(() => {
        setActiveFlag(true);
      }, 500);

      const hideFlagTimer = setTimeout(() => {
        setActiveFlag(false);
      }, 2000);

      return () => {
        clearTimeout(showFlagTimer);
        clearTimeout(hideFlagTimer);
      };
    }
  }, [token]); // Зависимость от токена

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  if (!token) {
    return (
      <div className='authorisation'>
        <div>
        <Auth setToken={setToken} />
        </div>
      </div>
      
    );
  } else {
    return (
      <div className="App">
        <div className='menu_login' onClick={setActiveProfile}>
          <p>maximloh@gmail.com</p>
          <span className='selector_icon' />
          <button className='logout_button' onClick={logout}>Выйти</button>
        </div>
        
        <Main />
            
        <div className='flag_container'>
          <div className={`flag ${activeFlag ? 'active' : ''}`}>
            <h1>Успешный вход!</h1>
          </div>
        </div>
      </div>
    );
  }
};

export default App;