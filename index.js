const url = process.argv[2];

if (!url) {
    console.log("Ошибка: укажите URL. Пример: node index.js https://speed.cloudflare.com/__down?bytes=10000000");
    process.exit(1);
}

(async () => {
    let totalTime = 0;
    let totalBytes = 0;
    const iterations = 10;

    console.log(`Замер для: ${url}\n`);

    for (let i = 1; i <= iterations; i++) {
        try {
            const start = Date.now();
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const buffer = await response.arrayBuffer(); 
            const timeSec = (Date.now() - start) / 1000;
            const bytes = buffer.byteLength;

            totalTime += timeSec;
            totalBytes += bytes;

            console.log(`Запрос ${i}: ${timeSec.toFixed(3)} сек, ${(bytes / 1024).toFixed(1)} КБ`);
        } catch (e) {
            console.error(`Ошибка при запросе ${i}:`, e.message);
            return;
        }
    }

    const avgTime = totalTime / iterations;
    const speedMbps = (totalBytes * 8) / totalTime / (1024 * 1024);

    console.log(`Среднее время запроса: ${avgTime.toFixed(3)} сек.`);
    console.log(`Общий объем скачанных данных: ${(totalBytes / (1024 * 1024)).toFixed(2)} МБ`);
    console.log(`Средняя скорость: ${speedMbps.toFixed(2)} Мбит/с`);
})();