import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth';

const Statistics = () => {
  const [categories, setCategories] = useState(['всё']);
  const [selectedCategory, setSelectedCategory] = useState('всё');
  const [selectedSrok, setSelectedSrok] = useState('всё время');
  const [transactions, setTransactions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

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
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    const userId = getGlobalUserId();
    if (!userId) {
      setErrorMessage('Пользователь не авторизован.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://api.dvoich.ru/getTransactions', {
        user_id: userId,
        category: selectedCategory,
        srok: selectedSrok,
      });
      setTransactions(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Ошибка при получении транзакций:', error);
      setErrorMessage('Ошибка при загрузке транзакций.');
    }
    setLoading(false);
  }, [selectedCategory, selectedSrok]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(amount);
  };

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
                    <strong>{transaction.category_name || 'Без категории'}</strong>: {formatAmount(transaction.amount)}
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
