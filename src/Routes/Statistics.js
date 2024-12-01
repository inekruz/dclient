import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth';

export default function Statistics() {
  const [categories, setCategories] = useState([]); // Список категорий
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null); // Индекс выбранной категории
  const [selectedPeriod, setSelectedPeriod] = useState(''); // Выбранный период
  const [transactions, setTransactions] = useState([]); // Список транзакций
  const [loading, setLoading] = useState(false); // Флаг загрузки
  const [error, setError] = useState(''); // Сообщение об ошибке

  // Загрузка категорий при монтировании компонента
  useEffect(() => {
    const fetchCategories = async () => {
      const userId = getGlobalUserId();
      if (!userId) {
        console.error('User ID is not available');
        return;
      }

      try {
        const response = await axios.post('https://api.dvoich.ru/get-categories', { user_id: userId });
        const fetchedCategories = response.data.categories;

        if (Array.isArray(fetchedCategories)) {
          setCategories(fetchedCategories);
        } else {
          console.error('Некорректный формат данных категорий:', fetchedCategories);
        }
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };

    fetchCategories();
  }, []);

  // Обработчик изменения выбранной категории
  const handleCategoryChange = (e) => {
    const index = e.target.selectedIndex - 2; // -2 из-за "выберите категорию" и "всё"
    setSelectedCategoryIndex(index >= 0 ? index : null);
  };

  // Обработчик изменения выбранного периода
  const handlePeriodChange = (e) => {
    setSelectedPeriod(e.target.value);
  };

  // Функция для получения статистики
  const fetchStatistics = async () => {
    const userId = getGlobalUserId();
    if (!userId || selectedCategoryIndex === null || !selectedPeriod) {
      setError('Пожалуйста, выберите категорию и период.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const categoryId = selectedCategoryIndex === -1 ? null : categories[selectedCategoryIndex]?.category_id;
      const response = await axios.post('https://api.dvoich.ru/getTransactions', {
        user_id: userId,
        category: categoryId, // Передаём ID категории
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
      <select id="category" value={selectedCategoryIndex ?? ''} onChange={handleCategoryChange}>
        <option value="">--Выберите категорию--</option>
        <option value="всё">Всё</option>
        {categories.map((category, index) => (
          <option key={category.category_id} value={index}>
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
                  <td>{transaction.category_name || 'Неизвестно'}</td>
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
