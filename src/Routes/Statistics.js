import React, { useState, useEffect } from 'react';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth'; // Импортируем функцию для получения глобального user_id

const Statistics = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState('all_time');

    const periods = [
        { label: 'Месяц', value: 'month' },
        { label: 'Три месяца', value: 'three_months' },
        { label: 'Год', value: 'year' },
        { label: 'Всё время', value: 'all_time' },
    ];

    // Получаем user_id через функцию getGlobalUserId
    const userId = getGlobalUserId();

    // Функция для загрузки категорий с сервера
    useEffect(() => {
        const fetchCategories = async () => {
            if (!userId) {
                console.error('User ID не найден!');
                return;
            }

            try {
                const response = await fetch(`https://api.dvoich.ru/categories?user_id=${userId}`);
                const data = await response.json();
                if (response.ok) {
                    setCategories(data); // Ожидается, что data — это массив с категориями
                } else {
                    console.error('Ошибка при загрузке категорий:', data.message);
                }
            } catch (err) {
                console.error('Ошибка запроса:', err);
            }
        };

        fetchCategories();
    }, [userId]);

    // Обработчик кнопки "Получить статистику"
    const handleGetStatistics = () => {
        if (selectedCategory === null) {
            console.error('Категория не выбрана!');
            return;
        }
        console.log(`Выбранная категория ID: ${categories[selectedCategory].id}`);
        console.log(`Выбранный период: ${selectedPeriod}`);
    };

    return (
        <div className="Statistics">
            <h1>Статистика</h1>
            <div>
                <label>Категория:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                >
                    <option value={null}>Выберите категорию</option>
                    {categories.map((category, index) => (
                        <option key={category.id} value={index}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label>Срок:</label>
                <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                >
                    {periods.map((period) => (
                        <option key={period.value} value={period.value}>
                            {period.label}
                        </option>
                    ))}
                </select>
            </div>
            <button onClick={handleGetStatistics}>Получить статистику</button>
        </div>
    );
};

export default Statistics;
