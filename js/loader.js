// Rezeptseiten als Array zum Laden der Funktion initCalculator damit Nährwerte und Mengenanpassung nur auf Rezeptseiten initialisiert werden
const recipes = ['eggnog.html'];

function loadPage(pageUrl) {
    fetch(`sites/${pageUrl}`)
        .then(response => response.text())
        .then(html => {
            document.getElementById('content-container').innerHTML = html;
            // Initialisiere den Calculator nur für Rezeptseiten und auch nur wenn die Funktion definiert ist
            if (recipes.includes(pageUrl) && typeof initCalculator === 'function') {
                initCalculator();
            }
        })
        .catch(error => console.error('Fehler beim Laden der Seite:', error));
}
// Startseite laden nach dem Laden des Skripts
loadPage('home.html');