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

        // Démarrer la capture de trace mémoire
        await page.tracing.start({
            path: 'trace.json',
            categories: [
                'devtools.timeline',
                'disabled-by-default-devtools.timeline.memory',
                'disabled-by-default-v8.runtime_stats',
                'disabled-by-default-v8.cpu_profiler',
                'disabled-by-default-v8.gc'
            ],
        });

        // Simulez vos interactions avec le plugin
        for (let i = 0; i < 10; i++) {
            await page.evaluate((cycle) => {
                const inputElement = $('#codeInputInteger');
                const codeInput = inputElement.codeInputBuilder({
                    type: 'integer',
                    numInputs: 5,
                    values: [1, 2, 3, 4, 5],
                });

                // Détruisez le plugin après usage
                if (typeof codeInput.destroy === 'function') {
                    codeInput.destroy();
                }

                console.log(`Cycle ${cycle + 1} complété.`);
            }, i);

            // Forcer le garbage collector (si activé)
            if (typeof global.gc === 'function') {
                await page.evaluate(() => {
                    if (window.gc) {
                        window.gc();
                    }
                });
            }
        }

        // Arrêter la capture de trace
        await page.tracing.stop();

        console.log('Trace mémoire capturée dans le fichier trace.json.');

    } catch (error) {
        console.error('Erreur lors du chargement ou de l\'exécution :', error);
    }

    await browser.close();
})();
