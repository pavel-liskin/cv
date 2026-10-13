window.addEventListener('load', () => {
    const budgetRange = document.getElementById('budgetRange');
    const conversionRange = document.getElementById('conversionRange');
    
    const budgetTxt = document.getElementById('budgetTxt');
    const conversionTxt = document.getElementById('conversionTxt');

    const funnelMql = document.getElementById('funnel-mql');
    const funnelSql = document.getElementById('funnel-sql');
    const funnelDeals = document.getElementById('funnel-deals');

    const funnelSqlBlock = document.getElementById('funnel-sql-block');
    const funnelDealsBlock = document.getElementById('funnel-deals-block');

    const kpiRevenue = document.getElementById('kpi-revenue');
    const kpiProfit = document.getElementById('kpi-profit');
    const kpiRoas = document.getElementById('kpi-roas');

    const canvasElement = document.getElementById('dashboardRevenueChart');
    if (!canvasElement) return;

    const ctx = canvasElement.getContext('2d');
    let revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт'],
            datasets: [{
                label: 'Выручка по месяцам',
                data: [],
                borderColor: '#3b82f6',
                borderWidth: 3,
                pointBackgroundColor: '#ffffff',
                pointBorderColor: '#3b82f6',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    border: { display: false },
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        color: '#94a3b8',
                        callback: val => val >= 1000 ? (val / 1000) + 'k' : val
                    }
                },
                x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
            }
        }
    });

    function updateSliderFill(slider) {
        const percentage = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
    }

    function recalculate() {
        const budget = parseInt(budgetRange.value, 10);
        const conversion = parseFloat(conversionRange.value) / 100;

        // Внутренние коэффициенты под юнит-экономику резюме
        const costPerMql = 145; // Условная стоимость одного привлеченного MQL
        const mqlToSqlCr = 0.40; // 40% лидов переходят из MQL в квалифицированные SQL
        const avgCheck = 4500;   // Средний чек закрытой сделки

        // Расчет этапов воронки
        const mql = Math.round(budget / costPerMql);
        const sql = Math.round(mql * mqlToSqlCr);
        const deals = Math.round(sql * (conversion * 4)); // Адаптация под ползунок конверсии

        // Расчет главных KPI
        const revenue = deals * avgCheck;
        const profit = revenue - budget;
        const roas = budget > 0 ? Math.round((revenue / budget) * 100) : 0;

        // Вывод текстов над ползунками
        budgetTxt.innerText = budget.toLocaleString('ru-RU');
        conversionTxt.innerText = conversionRange.value;

        // Вывод текстов внутрь плашек воронки
        funnelMql.innerText = mql.toLocaleString('ru-RU');
        funnelSql.innerText = sql.toLocaleString('ru-RU');
        funnelDeals.innerText = deals.toLocaleString('ru-RU');

        // Вывод финансовых KPI
        kpiRevenue.innerText = `${revenue.toLocaleString('ru-RU')} ₽`;
        kpiRoas.innerText = `${roas}%`;

        // Подсветка прибыли/убытка
        if (profit >= 0) {
            kpiProfit.innerText = `+${profit.toLocaleString('ru-RU')} ₽`;
            kpiProfit.style.color = '#10b981';
        } else {
            kpiProfit.innerText = `${profit.toLocaleString('ru-RU')} ₽`;
            kpiProfit.style.color = '#ef4444';
        }

        // Динамическое сужение прямоугольников SQL и Сделок относительно главного MQL (100%)
        const sqlWidth = Math.max(30, Math.min(90, (sql / mql) * 100 * 1.8)); 
        const dealsWidth = Math.max(15, Math.min(80, (deals / mql) * 100 * 6));

        funnelSqlBlock.style.width = `${sqlWidth}%`;
        funnelDealsBlock.style.width = `${dealsWidth}%`;

        // Моделирование тренда на графике
        const baseTrend = [0.85, 1, 1.25, 1.1, 0.96, 1.32];
        const newGraphData = baseTrend.map(factor => Math.round(revenue * factor * 0.8));
        
        revenueChart.data.datasets[0].data = newGraphData;
        revenueChart.update();

        // Заполнение полосы слайдеров синим цветом
        updateSliderFill(budgetRange);
        updateSliderFill(conversionRange);
    }

    budgetRange.addEventListener('input', recalculate);
    conversionRange.addEventListener('input', recalculate);

    // Стартовый расчет
    recalculate();
});
