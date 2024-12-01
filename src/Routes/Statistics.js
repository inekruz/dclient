import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth';

const Statistics = () => {
  const [categories, setCategories] = useState(['всё']); // Категории (по умолчанию "всё")
  const [selectedCategory, setSelectedCategory] = useState('всё'); // Выбранная категория
  const [selectedSrok, setSelectedSrok] = useState('всё время'); // Выбранный срок
  const [transactions, setTransactions] = useState([]); // Транзакции
  const [errorMessage, setErrorMessage] = useState(''); // Сообщение об ошибке
  const [loading, setLoading] = useState(false); // Статус загрузки

  // Загрузка категорий
  useEffect(() => {
    const fetchCategories = async () => {
      const userId = getGlobalUserId();
      if (!userId) {
        setErrorMessage('Пользователь не авторизован.');
        return;
      }

      try {
        const response = await axios.post('https://api.dvoich.ru/get-categories', { user_id: userId });
        const uniqueCategories = ['всё', ...new Set(response.data.categories.map(category => category.name))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
        setErrorMessage('Ошибка при загрузке категорий.');
      }
    };

    fetchCategories();
  }, []); // Только при монтировании компонента

  // Загрузка транзакций
  const fetchTransactions = useCallback(async () => {
    setLoading(true); // Начало загрузки
    const userId = getGlobalUserId();
    if (!userId) {
      setErrorMessage('Пользователь не авторизован.');
      setLoading(false); // Завершение загрузки
      return;
    }

    try {
      const response = await axios.post('https://api.dvoich.ru/getTransactions', {
        user_id: userId,
        category: selectedCategory,
        srok: selectedSrok,
      });
      setTransactions(response.data);
      setErrorMessage(''); // Очистка ошибки
    } catch (error) {
      console.error('Ошибка при получении транзакций:', error);
      setErrorMessage('Ошибка при загрузке транзакций.');
    }
    setLoading(false); // Завершение загрузки
  }, [selectedCategory, selectedSrok]); // Зависимости от фильтров

  useEffect(() => {
    fetchTransactions(); // Загружаем данные при изменении фильтров
  }, [fetchTransactions]); // Массив зависимостей

  return (
    <div className="Statistics">
      <h2>Статистика</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}

      {!errorMessage && (
        <>
          <div className="filters">
            <div className="filter">
              <label htmlFor="categories">Категория:</label>
              <select
                id="categories"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter">
              <label htmlFor="srok">Срок:</label>
              <select
                id="srok"
                value={selectedSrok}
                onChange={(e) => setSelectedSrok(e.target.value)}
              >
                <option value="всё время">Всё время</option>
                <option value="месяц">Месяц</option>
                <option value="три месяца">Три месяца</option>
                <option value="год">Год</option>
              </select>
            </div>
          </div>

          <div className="transactions">
            <h3>Транзакции</h3>

            {loading && <p>Загрузка...</p>}

            {transactions.length === 0 && !loading ? (
              <p>Данных нет</p>
            ) : (
              <ul>
                {transactions.map((transaction, index) => (
                  <li key={index}>
                    <strong>{transaction.category_name || 'Без категории'}</strong>: {transaction.amount} руб.
                    <br />
                    {transaction.description} ({new Date(transaction.date).toLocaleDateString()})
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Statistics;
