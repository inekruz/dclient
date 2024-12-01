import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

const Auth = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true); // Переключение между формой входа и регистрации
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [activeFlag, setActiveFlag] = useState(false); // Для успешного флага
  const [badFlag, setBadFlag] = useState(false); // Для флага с ошибкой
  const [message, setMessage] = useState('');

  // Функция для обработки формы регистрации или входа
  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin ? 'https://api.dvoich.ru/login' : 'https://api.dvoich.ru/register';
    const data = { login, password };

    try {
      const response = await axios.post(url, data);
      if (isLogin) {
        // Если вход успешен, сохраняем токен в localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('login', response.data.login);
        setLogin(response.data.login);
        setToken(response.data.token); // Передаем токен в родительский компонент
        setMessage('Успешный вход!');
        setActiveFlag(true); // Показываем успешный флаг
        setTimeout(() => {
          setActiveFlag(false); // Скрываем флаг через 4 секунды
        }, 4000);
      } else {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token); // Передаем токен в родительский компонент
        setMessage('Пользователь успешно зарегистрирован!');
        setActiveFlag(true); // Показываем успешный флаг
        setTimeout(() => {
          setActiveFlag(false); // Скрываем флаг через 4 секунды
        }, 4000);
      }
    } catch (error) {
      console.error(error);
      setMessage(error.response ? error.response.data.message : 'Ошибка сервера');
      setBadFlag(true); // Показываем флаг с ошибкой
      setTimeout(() => {
        setBadFlag(false); // Скрываем флаг через 4 секунды
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