window.addEventListener('load', () => {
    const ctx = document.getElementById('metricsChart').getContext('2d');
    let myChart;

    // Шаблоны данных под каналы
    const channelPresets = {
        context: { budget: 150000, cpc: 45, cr: 8.5, retention: 65 },
        target: { budget: 120000, cpc: 35, cr: 6.0, retention: 50 },
        seo: { budget: 200000, cpc: 60, cr: 10.0, retention: 80 }
    };

    function calculateMetrics() {
        const budget = parseFloat(document.getElementById('budgetSlider').value);
        const cpc = parseFloat(document.getElementById('cpcSlider').value);
        const cr = parseFloat(document.getElementById('crSlider').value) / 100;
        const retention = parseFloat(document.getElementById('retentionSlider').value) / 100;

        // Математика расчетов
        const traffic = Math.round(budget / cpc);
        const mql = Math.round(traffic * cr);
        const sql = Math.round(mql * 0.4); // Допустим 40% из MQL в SQL
        const deals = Math.round(sql * 0.25); // Конверсия в сделку 25%
        
        const avgCheck = 15000; // Средний чек сделки
        const revenue = deals * avgCheck * (1 + retention);
        const romi = ((revenue - budget) / budget * 100).toFixed(1);

        // Обновляем текстовые элементы на странице
        document.getElementById('funnel-traffic').innerText = traffic.toLocaleString();
        document.getElementById('funnel-mql').innerText = mql.toLocaleString();
        document.getElementById('funnel-sql').innerText = sql.toLocaleString();
        document.getElementById('funnel-deals').innerText = deals.toLocaleString();
        
        document.getElementById('kpi-revenue').innerText = Math.round(revenue).toLocaleString();
        document.getElementById('kpi-romi').innerText = romi;
        document.getElementById('kpi-sql').innerText = sql;

        return [traffic * 0.1, mql * 0.3, sql * 0.6, deals * 2, deals * 3, deals * 4, deals * 3.8, deals * 4.2]; 
        // Имитируем тренд для графика по месяцам (Янв-Авг)
    }

    function initChart() {
        const initialData = calculateMetrics();
        myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг'],
                datasets: [{
                    label: 'Выручка по месяцам',
                    data: initialData,
                    borderColor: '#10b981',
                    tension: 0.4,
                    fill: false
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }

    function updateAll() {
        const newData = calculateMetrics();
        myChart.data.datasets[0].data = newData;
        myChart.update();
    }

    // Слушатели ползунков
    document.querySelectorAll('input[type="range"]').forEach(slider => {
        slider.addEventListener('input', (e) => {
            document.getElementById(e.target.id.replace('Slider', 'Val')).innerText = e.target.value;
            updateAll();
        });
    });

    // Изменение пресета канала
    document.getElementById('channelSelect').addEventListener('change', (e) => {
        const preset = channelPresets[e.target.value];
        for (let key in preset) {
            document.getElementById(`${key}Slider`).value = preset[key];
            document.getElementById(`${key}Val`).innerText = preset[key];
        }
        updateAll();
    });

    initChart();
});
