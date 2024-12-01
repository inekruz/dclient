import React, { useState, useEffect } from 'react';
import './Routes.css';
import { getGlobalUserId } from '../components/Auth';
import axios from 'axios';
import { Line } from 'react-chartjs-2';  // Для графика
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Регистрация необходимых компонентов для работы с chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Statistics = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('всё');
    const [selectedPeriod, setSelectedPeriod] = useState('all_time');
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [chartData, setChartData] = useState({});

    const periods = [
        { label: 'Месяц', value: 'month' },
        { label: 'Три месяца', value: 'three_months' },
        { label: 'Год', value: 'year' },
        { label: 'Всё время', value: 'all_time' },
    ];

    const userId = getGlobalUserId();

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
                    setCategories(data);
                } else {
                    console.error('Ошибка при загрузке категорий:', data.message);
                }
            } catch (err) {
                console.error('Ошибка запроса:', err);
            }
        };

        fetchCategories();
    }, [userId]);

    const handleGetStatistics = async () => {
        if (selectedCategory === null || selectedCategory === '') {
            setError('Категория не выбрана!');
            return;
        }

        try {
            const categoryId = selectedCategory === 'всё' ? 'всё' : categories[selectedCategory].id;
            const response = await axios.post('https://api.dvoich.ru/getTransactions', {
                user_id: userId,
                category: categoryId,
                srok: selectedPeriod,
            });

            const transactionsData = response.data;
            setTransactions(transactionsData);
            setError('');

            // Подготовим данные для графика
            const groupedData = groupTransactionsByDate(transactionsData);
            setChartData(generateChartData(groupedData));

        } catch (err) {
            console.error('Ошибка при получении статистики:', err);
            setError('Ошибка при получении статистики');
        }
    };

    const groupTransactionsByDate = (transactions) => {
        const grouped = {};
        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const month = date.toLocaleString('ru-RU', { month: 'long' }) + ' ' + date.getFullYear();
            if (!grouped[month]) {
                grouped[month] = 0;
            }
            grouped[month] += transaction.amount;
        });
        return grouped;
    };

    const generateChartData = (groupedData) => {
        const labels = Object.keys(groupedData);
        const data = Object.values(groupedData);

        return {
            labels: labels,
            datasets: [
                {
                    label: 'Сумма транзакций по месяцам',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                },
            ],
        };
    };

    return (
        <div className="Statistics">
            <h1>Статистика</h1>
            <div>
                <label>Категория:</label>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
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

            {/* График */}
            {Object.keys(chartData).length > 0 && (
                <div style={{ width: '600px', height: '400px' }}>
                    <Line data={chartData} />
                </div>
            )}
        </div>
    );
};

export default Statistics;
