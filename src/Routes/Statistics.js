import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth';

export default function Statistics() {
  const [categories, setCategories] = useState([]); // Список категорий
  const [selectedCategory, setSelectedCategory] = useState(''); // Выбранная категория (ID)
  const [selectedPeriod, setSelectedPeriod] = useState(''); // Выбранный период
  const [transactions, setTransactions] = useState([]); // Список транзакций
  const [loading, setLoading] = useState(false); // Флаг загрузки
  const [error, setError] = useState(''); // Сообщение об ошибке

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      const userId = getGlobalUserId(); // Получаем user_id из Auth.js
      if (!userId) {
        console.error('User ID is not available');
        return;
      }

      try {
        const response = await axios.post('https://api.dvoich.ru/get-categories', { user_id: userId });
        const fetchedCategories = response.data.categories;

        if (Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories); // Сохраняем категории
        } else {
          console.error('Некорректный формат данных категорий:', fetchedCategories);
        }
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };

    fetchCategories(); // Загружаем категории при открытии компонента
  }, []);

  // Обработчик изменения выбранной категории
  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId); // Сохраняем ID категории
  };

  // Обработчик изменения выбранного периода
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  // Функция для получения статистики
  const fetchStatistics = async () => {
    const userId = getGlobalUserId(); // Получаем user_id из Auth.js
    if (!userId || !selectedCategory || !selectedPeriod) {
      setError('Пожалуйста, выберите категорию и период.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('https://api.dvoich.ru/getTransactions', {
        user_id: userId,
        category: parseInt(selectedCategory, 10), // Передаём ID категории
        srok: selectedPeriod
      });
      setTransactions(response.data);
    } catch (error) {
      setError('Ошибка при получении статистики');
    }
    setLoading(false);
  };

  return (
    <div className="statistics-container">
      <h2>Статистика</h2>

      <label htmlFor="category">Выберите категорию</label>
      <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">--Выберите категорию--</option>
        {categories.map((category) => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      <label htmlFor="period">Выберите период</label>
      <select id="period" value={selectedPeriod} onChange={handlePeriodChange}>
        <option value="">--Выберите период--</option>
        <option value="месяц">Месяц</option>
        <option value="три месяца">Три месяца</option>
        <option value="год">Год</option>
        <option value="всё время">Всё время</option>
      </select>

      <button onClick={fetchStatistics} disabled={loading}>
        {loading ? 'Загрузка...' : 'Получить статистику'}
      </button>

      {error && <p className="error">{error}</p>}

      {transactions.length > 0 && (
        <div className="transactions-list">
          <h3>Транзакции:</h3>
          <table>
            <thead>
              <tr>
                <th>Категория</th>
                <th>Сумма</th>
                <th>Дата</th>
                <th>Описание</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.category_name}</td>
                  <td>{transaction.amount}</td>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
