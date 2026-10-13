window.addEventListener('DOMContentLoaded', () => {
    // Получаем доступ к элементам ползунков
    const budgetSlider = document.getElementById('budgetSlider');
    const cpcSlider = document.getElementById('cpcSlider');
    const crSlider = document.getElementById('crSlider');
    const scaleSlider = document.getElementById('scaleSlider'); // Новый ползунок

    // Получаем доступ к элементам вывода текста значений
    const budgetVal = document.getElementById('budgetVal');
    const cpcVal = document.getElementById('cpcVal');
    const crVal = document.getElementById('crVal');
    const scaleVal = document.getElementById('scaleVal'); // Новый текст

    // Получаем доступ к этапам воронки
    const funnelTraffic = document.getElementById('funnel-traffic');
    const funnelMql = document.getElementById('funnel-mql');
    const funnelSql = document.getElementById('funnel-sql');
    const funnelDeals = document.getElementById('funnel-deals');

    function calculateFunnel() {
        // Получаем текущие значения с ползунков
        const budget = parseInt(budgetSlider.value, 10);
        const cpc = parseInt(cpcSlider.value, 10);
        const cr = parseFloat(crSlider.value) / 100;
        const scaleFactor = parseInt(scaleSlider.value, 10) / 100; // Переводим проценты эффективности в коэффициент (0.1 - 1.0)

        // Расчет юнит-экономики воронки с учетом фактора масштабирования
        const traffic = Math.round(budget / cpc);
        
        // Эффективность масштабирования снижает конверсию на следующих этапах воронки
        const mql = Math.round((traffic * cr) * scaleFactor);
        const sql = Math.round((mql * 0.40));   // Базовая конверсия MQL -> SQL (40%)
        const deals = Math.round((sql * 0.25)); // Базовая конверсия SQL -> Сделки (25%)

        // Обновляем числа над ползунками
        budgetVal.innerText = budget.toLocaleString('ru-RU');
        cpcVal.innerText = cpc;
        crVal.innerText = crSlider.value;
        scaleVal.innerText = scaleSlider.value; // Обновляем процент эффективности

        // Записываем обновленные результаты внутрь этапов воронки
        funnelTraffic.innerText = traffic.toLocaleString('ru-RU');
        funnelMql.innerText = mql.toLocaleString('ru-RU');
        funnelSql.innerText = sql.toLocaleString('ru-RU');
        funnelDeals.innerText = deals.toLocaleString('ru-RU');
    }

    // Вешаем отслеживание изменений на все четыре ползунка
    [budgetSlider, cpcSlider, crSlider, scaleSlider].forEach(slider => {
        slider.addEventListener('input', calculateFunnel);
    });

    // Первый запуск расчетов при загрузке страницы
    calculateFunnel();
});
