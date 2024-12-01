import React, { useState, useEffect } from 'react';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth'; // Импортируем функцию для получения глобального user_id
import axios from 'axios'; // Импортируем axios для отправки запросов

const Statistics = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('всё'); // Устанавливаем 'всё' как значение по умолчанию
    const [selectedPeriod, setSelectedPeriod] = useState('all_time');
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');

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

    // Функция для получения статистики с сервера
    const handleGetStatistics = async () => {
        if (selectedCategory === null || selectedCategory === '') {
            setError('Категория не выбрана!');
            return;
        }

        try {
            // Если категория не выбрана, передаем 'всё'
            const categoryId = selectedCategory === 'всё' ? 'всё' : categories[selectedCategory].id;

            // Отправляем запрос на сервер
            const response = await axios.post('https://api.dvoich.ru/getTransactions', {
                user_id: userId,
                category: categoryId,
                srok: selectedPeriod,
            });

            // Обрабатываем данные транзакций
            setTransactions(response.data);
            setError('');
        } catch (err) {
            console.error('Ошибка при получении статистики:', err);
            setError('Ошибка при получении статистики');
        }
    };

    return (
        <div className="Statistics">
            <h1>Статистика</h1>
            <div>
                <label>Категория:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)} // Меняем логику изменения категории
                >
                    <option value="всё">Все категории</option>
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

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Отображаем транзакции */}
            {transactions.length > 0 && (
                <div>
                    <h3>Транзакции:</h3>
                    <ul>
                        {transactions.map((transaction, index) => (
                            <li key={index}>
                                {transaction.category_name}: {transaction.amount} ({transaction.date})
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Statistics;
