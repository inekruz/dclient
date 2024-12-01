import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth';

export default function Statistics() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

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
        setCategories(response.data.categories); // Сохраняем категории в state
      } catch (error) {
        console.error('Ошибка при получении категорий:', error);
      }
    };

    fetchCategories(); // Загружаем категории при открытии компонента
  }, []);

  // Обработчик изменения выбранной категории
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  return (
    <div className="statistics-container">
      <h2>Статистика</h2>
      <label htmlFor="category">Выберите категорию</label>
      <select id="category" value={selectedCategory} onChange={handleCategoryChange}>
        <option value="">--Выберите категорию--</option>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
