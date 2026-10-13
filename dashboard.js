// Ждем полной загрузки страницы и библиотеки Chart
window.addEventListener('DOMContentLoaded', () => {
    const canvasElement = document.getElementById('metricsChart');
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    
    // Вшитые жесткие массивы данных
    const dataTemplates = {
        leads: {
            label: 'Новые лиды (SQL)',
            data: [450, 1120, 2180, 3326],
            labels: ['Квартал 1', 'Квартал 2', 'Квартал 3', 'Квартал 4 (Итого: 3326 SQL)'],
            color: '#3b82f6'
        },
        romi: {
            label: 'Уровень ROMI (%)',
            data: [120, 185, 230, 283.6],
            labels: ['2021 г.', '2022 г.', '2023 г.', '2024 г. (Пик: 283.6%)'],
            color: '#10b981'
        },
        revenue: {
            label: 'Выручка вертикалей (\$ млн)',
            data: [4.2, 11.5, 21.0, 30.0],
            labels: ['Этап 1', 'Этап 2', 'Этап 3', 'Финал (> \$30M)'],
            color: '#a855f7'
        }
    };

    let currentMetric = 'leads';
    let scaleFactor = 1;
    let myChart;

    function initChart() {
        const template = dataTemplates[currentMetric];
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: template.labels,
                datasets: [{
                    label: template.label,
                    data: template.data,
                    borderColor: template.color,
                    backgroundColor: template.color + '15',
                    fill: true,
                    tension: 0.3,
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: template.color
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#9ca3af', font: { family: '-apple-system', size: 12 } } }
                },
                scales: {
                    y: {
                        grid: { color: '#1f2937' },
                        ticks: { color: '#9ca3af' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#9ca3af' }
                    }
                }
            }
        });
    }

    function updateChart() {
        const template = dataTemplates[currentMetric];
        myChart.data.labels = template.labels;
        myChart.data.datasets[0].label = template.label;
        myChart.data.datasets[0].borderColor = template.color;
        myChart.data.datasets[0].pointBackgroundColor = template.color;
        myChart.data.datasets[0].backgroundColor = template.color + '15';
        myChart.data.datasets[0].data = template.data.map(val => Number((val * scaleFactor).toFixed(1)));
        myChart.update();
    }

    // Инициализация
    initChart();

    // Слушатели кнопок управления
    document.getElementById('metricSelect').addEventListener('change', (e) => {
        currentMetric = e.target.value;
        updateChart();
    });

    document.getElementById('budgetSlider').addEventListener('input', (e) => {
        const val = e.target.value;
        scaleFactor = val / 100;
        document.getElementById('sliderVal').innerText = `Эффективность масштабирования: ${val}%`;
        updateChart();
    });
});
