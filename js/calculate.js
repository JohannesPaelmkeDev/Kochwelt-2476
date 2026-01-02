let startamount;
let indigredientsamount;
let anzahl;
let mengenangaben = [];
let naehrwerte = [];

function initCalculator() {
    startamount = document.getElementById("portionInput").value;
    indigredientsamount = document.querySelectorAll('.ingredients li');
    anzahl = indigredientsamount.length;
    mengenangaben = [];
    naehrwerte = [];
    getAmounts();
    getNutritionValues();
    updateNutritionTitle();
}

function updateNutritionTitle() {
    let amount = document.getElementById("portionInput").value;
    let unit = document.getElementById("updatePortions").innerText;
    let nutritionAmount = document.getElementById("nutritionAmount");
    if (nutritionAmount) {
        nutritionAmount.innerText = `für ${amount} ${unit}`;
    }
}

function getAmounts() {
    for (let i = 0; i < anzahl; i++) {
        let ingredient = document.querySelectorAll('.ingredients li')[i];
        const treffer = ingredient.innerHTML.match(/^\d+([,\.]\d+)?/);
        let zahl;
        if (treffer) {
            const gefundenerString = treffer[0];
            const normalisiert = gefundenerString.replace(',', '.');
            zahl = parseFloat(normalisiert);
            mengenangaben.push(zahl);
        } else {
            console.log("Keine Zahl am Anfang gefunden.");
        }
    }
}

function getNutritionValues() {
    let nutritionItems = document.querySelectorAll('.nutrition li');
    for (let i = 0; i < nutritionItems.length; i++) {
        let item = nutritionItems[i];
        const treffer = item.innerHTML.match(/:\s*([\d.,]+)/);
        if (treffer) {
            const gefundenerString = treffer[1];
            // Punkt als Tausendertrennzeichen entfernen, Komma durch Punkt ersetzen
            const normalisiert = gefundenerString.replace(/\./g, '').replace(',', '.');
            let wert = parseFloat(normalisiert);
            naehrwerte.push({
                original: gefundenerString,
                value: wert,
                hasDecimal: gefundenerString.includes(',')
            });
        } else {
            naehrwerte.push(null);
        }
    }
}

function formatNumber(num, hasDecimal) {
    if (hasDecimal) {
        return (Math.round(num * 10) / 10).toString().replace('.', ',');
    } else if (num >= 1000) {
        return Math.round(num).toLocaleString('de-DE');
    } else {
        return Math.round(num).toString();
    }
}

function calculateAmounts() {
    if (mengenangaben.length > 0) {
        let newValue = parseFloat(document.getElementById("portionInput").value);
        let factor = newValue / parseFloat(startamount);
        
        for (let i = 0; i < anzahl; i++) {
            let originalAmount = mengenangaben[i];
            let calculatedAmount = originalAmount * factor;
            let newamount;
            if (Number.isInteger(originalAmount)) {
                newamount = Math.round(calculatedAmount);
            } else {
                newamount = Math.round(calculatedAmount * 10) / 10;
            }
            let ingredient = document.querySelectorAll('.ingredients li')[i];
            let oldText = ingredient.innerHTML;
            let newText = oldText.replace(/^\d+([,\.]\d+)?/, newamount);
            ingredient.innerHTML = newText;
        }
        
        // Nährwerte berechnen
        if (naehrwerte.length > 0) {
            let nutritionItems = document.querySelectorAll('.nutrition li');
            for (let i = 0; i < naehrwerte.length; i++) {
                if (naehrwerte[i] !== null) {
                    let originalValue = naehrwerte[i].value;
                    let hasDecimal = naehrwerte[i].hasDecimal;
                    let calculatedValue = originalValue * factor;
                    let formattedValue = formatNumber(calculatedValue, hasDecimal);
                    
                    let item = nutritionItems[i];
                    let oldText = item.innerHTML;
                    let newText = oldText.replace(/:\s*[\d.,]+/, ': ' + formattedValue);
                    item.innerHTML = newText;
                }
            }
        }
        
        // Nährwerte-Titel aktualisieren
        updateNutritionTitle();
    }
}