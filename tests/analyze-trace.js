const fs = require('fs');

// Charger le fichier trace.json
const traceData = JSON.parse(fs.readFileSync('trace.json', 'utf8'));

// Filtrer les événements liés à la mémoire
const memoryEvents = traceData.traceEvents.filter(event =>
    event.cat.includes('devtools.timeline.memory') || event.cat.includes('v8.gc')
);

// Afficher les informations sur la mémoire
memoryEvents.forEach(event => {
    console.log(`Nom de l'événement : ${event.name}`);
    console.log(`Durée : ${event.dur || 'Non spécifiée'} µs`);
    console.log(`Mémoire utilisée avant : ${event.args?.usedHeapSizeBefore || 'N/A'}`);
    console.log(`Mémoire utilisée après : ${event.args?.usedHeapSizeAfter || 'N/A'}`);
    console.log('----------------------------');
});
