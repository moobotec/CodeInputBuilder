const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const filePath = `file://${path.join(__dirname, 'test_memory.html')}`;
    console.log('Chemin du fichier HTML :', filePath);

    page.on('console', (msg) => console.log('PAGE LOG:', msg.text()));
    page.on('requestfailed', (request) =>
        console.error('FAILED:', request.url(), request.failure().errorText)
    );

    try {
        await page.goto(filePath);
        console.log('Page de test chargée.');

        const initialMetrics = await page.metrics();
        console.log('État initial de la mémoire :', {
            JSHeapUsedSize: initialMetrics.JSHeapUsedSize,
            JSHeapTotalSize: initialMetrics.JSHeapTotalSize,
        });

        let heapUsedDiffs = [];

        for (let v = 0; v < 5; v++) {

            for (let i = 0; i < 10; i++) {
                // Simulez une interaction avec le plugin
                await page.evaluate((cycle) => {
                    const inputElement = $('#codeInputInteger');
                    const codeInput = inputElement.codeInputBuilder({
                        type: 'integer',
                        numInputs: 5,
                        values: [1, 2, 3, 4, 5],
                        allowSign: true,
                        defaultSign: '+',
                    });

                    // Détruire le plugin (si une méthode destroy est disponible)
                    if (typeof codeInput.destroy === 'function') {
                        codeInput.destroy();
                    }
                    console.log(`Cycle ${cycle + 1} complété.`);
                }, i);

                // Forcer le garbage collector après chaque cycle (si activé)
                if (typeof global.gc === 'function') {
                    await page.evaluate(() => {
                        if (window.gc) {
                            console.log('Garbage Collector activé.');
                            window.gc();
                        }
                    });
                }

                const metrics = await page.metrics();
                console.log(`Cycle ${i + 1} :`, {
                    JSHeapUsedSize: metrics.JSHeapUsedSize,
                    JSHeapTotalSize: metrics.JSHeapTotalSize,
                });

            

            }

            const finalMetrics = await page.metrics();
            console.log('État final de la mémoire :', {
                JSHeapUsedSize: finalMetrics.JSHeapUsedSize,
                JSHeapTotalSize: finalMetrics.JSHeapTotalSize,
            });

            const memoryDiff = {
                heapUsedDiff: finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize,
                heapTotalDiff: finalMetrics.JSHeapTotalSize - initialMetrics.JSHeapTotalSize,
            };
            console.log('Différence totale de mémoire après 10 cycles :', memoryDiff);

            const diff = finalMetrics.JSHeapUsedSize - initialMetrics.JSHeapUsedSize;
            heapUsedDiffs.push(diff);

        }

        const avgHeapUsedDiff = heapUsedDiffs.reduce((a, b) => a + b, 0) / heapUsedDiffs.length;
        console.log('Différence moyenne de mémoire utilisée :', avgHeapUsedDiff);

    } catch (error) {
        console.error('Erreur lors du chargement ou de l\'exécution :', error);
    }

    await browser.close();
})();
