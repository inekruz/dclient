import React, { useState, useEffect } from 'react';
import Auth from './components/Auth';
import './App.css';
import Main from './Routes/Main';
import { Route, Routes, Link, useLocation } from 'react-router-dom';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [activeFlag, setActiveFlag] = useState(false);
  // const [login, setLogin] = useState(localStorage.getItem('login'));
  const location = useLocation(); // Получаем текущий путь

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
  }, [token]);

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
        <header className='app_header'>
          <ul className='nav_list'>
            <Link to='/' className={`nav_list_item ${location.pathname === '/' ? 'active' : ''}`}>
              <li>
                <p className='transaction'>Транзакции</p>
              </li>
            </Link>
            
            <Link to='/statistics' className={`nav_list_item ${location.pathname === '/statistics' ? 'active' : ''}`}>
              <li className='nav_list_item'>
                <p className='transaction'>Статистика</p>
              </li>
            </Link>

            <Link to='/accounts' className={`nav_list_item ${location.pathname === '/accounts' ? 'active' : ''}`}>
              <li className='nav_list_item'>
                <p className='transaction'>Счета</p>
              </li>
            </Link>
          </ul>

          <div className='menu_login'>
            <p>Artem</p>
            <span className='selector_icon' />
            <button className='logout_button' onClick={logout}>Выйти</button>
          </div>
        </header>
          
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/statistics' element={<Main />} />
          <Route path='/accounts' element={<Main />} />
        </Routes>
        
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