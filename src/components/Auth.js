import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

let globalUserId = null; // Глобальная переменная для хранения user_id

export const getGlobalUserId = () => globalUserId; // Экспортируем функцию для доступа к user_id

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [activeFlag, setActiveFlag] = useState(false);
  const [badFlag, setBadFlag] = useState(false);
  const [message, setMessage] = useState('');

  const fetchUserId = async (userLogin) => {
    try {
      const response = await axios.post('https://api.dvoich.ru/get-user-id', { login: userLogin });
      const { user_id } = response.data;
      globalUserId = user_id; // Сохраняем user_id в глобальной переменной
      localStorage.setItem('user_id', user_id); // Сохраняем user_id в localStorage
      console.log(`User ID: ${user_id}`);
    } catch (error) {
      console.error('Ошибка при получении user_id:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin ? 'https://api.dvoich.ru/login' : 'https://api.dvoich.ru/register';
    const data = { login, password };

    try {
      const response = await axios.post(url, data);
      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('login', login);
        setToken(response.data.token);
        await fetchUserId(login); // Получаем user_id
        setMessage('Успешный вход!');
      } else {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
        await fetchUserId(login); // Получаем user_id
        setMessage('Пользователь успешно зарегистрирован!');
      }
      setActiveFlag(true);
      setTimeout(() => {
        setActiveFlag(false);
      }, 4000);
    } catch (error) {
      console.error(error);
      setMessage(error.response ? error.response.data.message : 'Ошибка сервера');
      setBadFlag(true);
      setTimeout(() => {
        setBadFlag(false);
      }, 4000);
    }
  };

  return (
    <div className="auth_container">
      <h2>{isLogin ? 'Вход' : 'Регистрация'}</h2>
      <form onSubmit={handleSubmit}>
        <div className='auth_container_input'>
          <label>Логин</label>
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
        </div>
        <div className='auth_container_input'>
          <label>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className='auth_login_button' type="submit">{isLogin ? 'Войти' : 'Зарегистрироваться'}</button>
      </form>

      <div className={`flag ${activeFlag ? 'active' : ''}`}>
        <p>{message}</p>
      </div>

      <div className={`bad_flag ${badFlag ? 'active' : ''}`}>
        <p>{message}</p>
      </div>

      <div className="auth-container">
        <p>{isLogin ? 'Нет аккаунта?' : 'Есть аккаунт?'}</p>
        <button className='change_form_to_login' onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Зарегистрироваться' : 'Войти'}
        </button>
      </div>
    </div>
  );
};

export default Auth;
