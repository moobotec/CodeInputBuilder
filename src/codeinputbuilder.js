/*
Plugin: Code Input Builder
Version: 0.0.6
Author: Daumand David
Website: https://www.timecaps.io
Contact: daumanddavid@gmail.com
Description: Un plugin jQuery pour générer des champs d'input configurables pour saisir des codes numériques ou flottants.

Options disponibles:
    - `type`: (string) Définit le type de valeur acceptée par les inputs.
        * Valeurs possibles : 'integer' ou 'float'.
        * Par défaut : 'integer'.

    - `numInputs`: (integer) Nombre total d'inputs affichés.
        * Par défaut : 1.

    - `minValues`: (array) Valeurs minimales pour chaque input. Le tableau doit contenir autant de valeurs que `numInputs`.
        * Par défaut : [] (pas de minimum spécifique pour chaque input).

    - `maxValues`: (array) Valeurs maximales pour chaque input. Utiliser autant de valeurs que `numInputs`.
        * Par défaut : [] (pas de maximum spécifique pour chaque input).

    - `values`: (array) Valeurs initiales pour chaque input. Utiliser autant de valeurs que `numInputs`.
        * Par défaut : [].

    - `defaultValue`: (integer ou float) Valeur par défaut à afficher si aucune valeur initiale n’est définie.
        * Par défaut : 0.

    - `gap`: (string) Espace entre les inputs, spécifié en pixels (ex. '10px').
        * Par défaut : '10px'.

    - `allowSign`: (boolean) Permet d'ajouter un signe (+ ou -) devant la valeur.
        * Par défaut : false.

    - `defaultSign`: (string) Signe par défaut si `allowSign` est activé.
        * Valeurs possibles : '+' ou '-'.
        * Par défaut : '+'.

    - `decimalPosition`: (integer) Position du séparateur décimal dans le cas d’un `type` float.
        * Par défaut : 1.

    - `separator`: (string) Caractère à utiliser comme séparateur pour les décimales (ex. '.').
        * Par défaut : '.'.

    - `totalMax`: (number) Valeur maximale autorisée pour la somme de tous les inputs.
        * Par défaut : null (pas de limite).

    - `totalMin`: (number) Valeur minimale autorisée pour la somme de tous les inputs.
        * Par défaut : null (pas de limite).

    - `onValueChange`: (function) Fonction callback exécutée lorsque la valeur change. Reçoit deux paramètres : `$input` (l'élément input) et `newValue` (la nouvelle valeur).
        * Par défaut : null.

    - `allowScroll`: (boolean) Active ou désactive la fonctionnalité de défilement pour ajuster les valeurs des inputs.
        * Par défaut : true.

    - `scrollSensitivity`: (integer) Définit la sensibilité du défilement, en pixels. Plus la valeur est faible, plus le défilement sera réactif.
        * Par défaut : 50.

    - `requireKeyForScroll`: (string) Touche à enfoncer (par exemple 'Control' ou 'Shift') pour activer le défilement sur les inputs.
        * Valeurs possibles : 'Control', 'Shift', 'Alt', 'Meta'.
        * Par défaut : null (aucune touche requise).
        
    - `autoFocusNextInput`: (boolean) Active le décalage automatique du focus vers l'input suivant lors de la saisie.
        * Par défaut : false.

    - `autoFocusNextInputDirection`: (string) Détermine la direction du décalage automatique du focus.
        * Valeurs possibles : 'forward', 'right', 'backward', 'left'.
        * Par défaut : null.

Usage:
    // Initialisation de base
    $('#element').codeInputBuilder({
        type: 'float',
        numInputs: 4,
        minValues: [0, 0, 1, 2],
        maxValues: [9, 9, 9, 5],
        defaultSign: '-',
        allowSign: true,
        totalMax: 100,
        allowScroll: true,
        scrollSensitivity: 30,
        requireKeyForScroll: 'Control'
    });

Méthodes:
    - `getCompleteValue()`: Récupère la valeur complète entrée par l'utilisateur sous forme de chaîne ou nombre.
    - `setCompleteValue(value, onchange = false)`: Définit une nouvelle valeur complète et met à jour les inputs.

*/

if (typeof jQuery === 'undefined') {
    throw new Error("La bibliothèque jQuery est requise pour que CodeInputBuilder fonctionne. Veuillez inclure jQuery avant de charger cette bibliothèque.");
}

(function ($) {
    
        // Fonction de validation des options
    function initCodeInputBuilderOptions(options) {
        const defaultOptions = {
            type: 'integer',
            numInputs: 1,
            minValues: [],
            maxValues: [],
            values: [],
            defaultValue: 0,
            allowSign: false,
            defaultSign: '+',
            decimalPosition: 1,
            separator: '.',
            totalMax: null,
            totalMin: null,
            onValueChange: null,
            allowScroll: true,
            scrollSensitivity: 50,
            requireKeyForScroll: null,
            autoFocusNextInput: false,
            autoFocusNextInputDirection: null,
            gap: '10px'
        };

        const settings = $.extend({}, defaultOptions, options);

        function validateOptions() {
            if (!['integer', 'float', 'text'].includes(settings.type)) {
                throw new Error("Option 'type' invalide. Valeurs autorisées : 'integer', 'float', 'text'.");
            }
            if (typeof settings.numInputs !== 'number' || settings.numInputs < 1) {
                throw new Error("Option 'numInputs' doit être un entier positif.");
            }
            if (settings.type !== 'text' && Array.isArray(settings.minValues) && settings.minValues.length !== settings.numInputs) {
                throw new Error("'minValues' doit contenir autant d'éléments que 'numInputs'.");
            }
            if (settings.type !== 'text' && Array.isArray(settings.maxValues) && settings.maxValues.length !== settings.numInputs) {
                throw new Error("'maxValues' doit contenir autant d'éléments que 'numInputs'.");
            }
            if (settings.type === 'float' && (typeof settings.decimalPosition !== 'number' || settings.decimalPosition < 1)) {
                throw new Error("Option 'decimalPosition' doit être un entier positif pour les types flottants.");
            }
            if (typeof settings.defaultValue !== 'number' && typeof settings.defaultValue !== 'string') {
                throw new Error("Option 'defaultValue' doit être un nombre ou une chaîne.");
            }
            if (settings.totalMin !== null && typeof settings.totalMin !== 'number') {
                throw new Error("Option 'totalMin' doit être un nombre ou null.");
            }
            if (settings.totalMax !== null && typeof settings.totalMax !== 'number') {
                throw new Error("Option 'totalMax' doit être un nombre ou null.");
            }
            if (settings.onValueChange !== null && typeof settings.onValueChange !== 'function') {
                throw new Error("Option 'onValueChange' doit être une fonction ou null.");
            }
            if (typeof settings.allowScroll !== 'boolean') {
                throw new Error("Option 'allowScroll' doit être un booléen.");
            }
            if (typeof settings.autoFocusNextInput !== 'boolean') {
                throw new Error("Option 'autoFocusNextInput' doit être un booléen.");
            }
            if (settings.autoFocusNextInputDirection && !['Forward', 'Backward', 'Right', 'Left'].includes(settings.autoFocusNextInputDirection)) {
                throw new Error("Option 'autoFocusNextInputDirection' doit être 'Forward', 'Backward', 'Right', 'Left' ou null.");
            }
            if (typeof settings.scrollSensitivity !== 'number' || settings.scrollSensitivity <= 0) {
                throw new Error("Option 'scrollSensitivity' doit être un entier positif.");
            }
            if (settings.requireKeyForScroll && !['Control', 'Shift', 'Alt', 'Meta'].includes(settings.requireKeyForScroll)) {
                throw new Error("Option 'requireKeyForScroll' doit être 'Control', 'Shift', 'Alt', 'Meta' ou null.");
            }
        }

        validateOptions();

        return settings;
    }


   $.fn.codeInputBuilder = function (options) {

        // Options par défaut
        const settings = initCodeInputBuilderOptions(options);

        let gIdHover = null;
        // decimal ( 0,1,2,3,4,5,6,7,8,9) - Chiffres (numériques)
        let digitMin = 0;
        let digitMax = 9;
        // hexadecimal ( 0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f ) - Lettres (alphabétiques)
        let digitHexaMin = 0x30; // 0
        let digitHexaMax = 0x66; // f
        // Lettres alphabétiques ( a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z ) - Lettres (alphabétiques)
        let digiLetterMin = 0x61; // a minuscule
        let digitLetterMax = 0x7A; // z minuscule

        let currentValues = {
            value : '',
            digits: new Array(settings.numInputs).fill(0), // Tableau pour n digits
            sign: settings.allowSign ? settings.defaultSign : null, // Valeur pour sign
            indexList: -1 
        };

        let limitDigitMin = ( settings.totalMin !== undefined && settings.totalMin != null ) ? numberToDigitsArray(settings.totalMin) : null;
        let limitDigitMax = ( settings.totalMax !== undefined && settings.totalMax != null ) ? numberToDigitsArray(settings.totalMax) : null;
        let uniqueTypeShort = settings.type + '_' + uuidShort();
        
        // Fonction pour mettre à jour les valeurs en fonction de l'index
        function updateCurrentValues(index, value) {
            if (index === "sign") {
                currentValues.sign = value;
            } else if (index === "list") {
                currentValues.indexList = value;
            } else if (index === "current") {
                currentValues.value = value;
            } else if (index === "fillDigits") {
                currentValues.digits.fill(value);
            } else if (!isNaN(index)) { // Si l'index est un nombre, on l'utilise pour mettre à jour le digit
                currentValues.digits[index] = value;
            } else {
                throw new Error("Index invalide :", index);
            }
        }

        function getCurrentValueByIndex(index) {
            if (index === "sign") {
                return currentValues.sign;
            } else if (index === "list") {
                return currentValues.indexList;
            } else if (index === "current") {
                return currentValues.value;
            } else if (index === "digits") {
                return currentValues.digits;
            } else if (!isNaN(index)) { // Si l'index est un nombre, on l'utilise pour mettre à jour le digit
                return currentValues.digits[index];
            } 
            return null;
        }

        function findPosition(array, element) {
            return array.indexOf(element);
        }

        function uuidShort() {
            return 'xxxxxxxx'.replace(/[x]/g, function () {
                const r = Math.random() * 16 | 0;
                return r.toString(16);
            });
        }

        function convertCodeToChar(codeTouche) {
            return String.fromCharCode(codeTouche);
        }

        function getValueLimits(inputElement) {
            const valueMin = parseInt($(inputElement).attr('data-min'), 10);
            const valueMax = parseInt($(inputElement).attr('data-max'), 10);
            return { valueMin, valueMax };
        }

        function fillDigits(number, type) {
            if (isNaN(number)) {
                return;
            }
            // Ajuste `number` selon les limites `totalMin` et `totalMax`
            let baseValue = number;

            if (typeof settings.totalMin === 'number' && settings.totalMin !== null && baseValue < settings.totalMin) {
                baseValue = settings.totalMin;
            }
            if (typeof settings.totalMax === 'number' && settings.totalMax !== null && baseValue > settings.totalMax) {
                baseValue = settings.totalMax;
            }

            // Gère le signe si `allowSign` est activé
            if (settings.allowSign) {
                $(`[id^="sign_${type}_input"]`).val((baseValue < 0) ? '-' : '+');
            }
        
            let numericValue = Math.abs(baseValue).toString();
            let integerPart, decimalPart;
        
            if (settings.type === 'float') {
                // Sépare la partie entière et la partie décimale pour les floats
                [integerPart, decimalPart] = numericValue.split('.');
                integerPart = integerPart.padStart(settings.decimalPosition, '0'); 
                const maxDecimalLength = settings.numInputs - settings.decimalPosition;
                decimalPart = (decimalPart || '').slice(0, maxDecimalLength).padEnd(maxDecimalLength, '0');
            } else if (settings.type === 'integer') {
                // Pour les integers, utilise toute la valeur en entier
                integerPart = numericValue;
                decimalPart = ''; // Pas de partie décimale pour un integer
            } else {
                throw new Error("Type non supporté dans la fonction fillDigits.");
            }
        
            const digitInputs = $(`[id^="digits_${type}_input_"]`).get();
            let index = digitInputs.length - 1;
        
            // Réinitialise les valeurs des inputs à zéro
            digitInputs.forEach(input => $(input).val(0));
        
            // Parcourt les chiffres et les assigne aux inputs en respectant les min/max
            for (let digit of (integerPart + decimalPart).split('').reverse()) {
                const { value } = getAdjustedValueSettings(index, digit, settings, digitMin, digitMax);
                $(digitInputs[index]).val(value);
                updateCurrentValues(index,value);
                index--;
            }
        }

        function computeValueFromInputs(type) 
        {
            let numberString = computeDigitToValue(type);
            numberString = addSignToValue(numberString,type);
            // Conversion en nombre selon le type spécifié dans les paramètres
            return settings.type === 'float' ? parseFloat(numberString) : parseInt(numberString, 10);
        }

        function computeDigitToValue(type) 
        {
            let numberString = '';
            // Récupération des digits pour les types 'float' et 'integer'
            $('input[id^=digits_'+type+'_input]').each(function(index) {
                // Ajouter un point décimal si le type est 'float' et on atteint la position décimale
                if (settings.type === 'float' && index === settings.decimalPosition) {
                    numberString += '.';
                }
                numberString += $(this).val();
            });
            return numberString;
        }

        function addSignToValue(value, type) {
            if (!settings.allowSign) return value; // Retourne la valeur sans modification si `allowSign` est désactivé
        
            // Récupère le signe (+ ou -) pour le type spécifié
            const signInput =  $('input[id^=sign_'+type+'_input]');
            const sign = signInput.length ? signInput.val() : '+';
        
            // Applique le signe en fonction du type de la valeur (chaîne ou nombre)
            if (typeof value === 'string') {
                return sign === '-' ? '-' + value : value;
            } else if (typeof value === 'number') {
                return sign === '-' ? -value : value;
            }
            return value; // Retourne la valeur originale si elle n'est ni chaîne ni nombre
        }
        
        function updateFinalValue($input, newValue, type, onchange = true) {
            // Calcul de la valeur finale selon le type de données
            let finalValue = settings.type === 'text' ? newValue : computeValueFromInputs(type);
        
            // Met à jour la valeur 'current' dans currentValues
            updateCurrentValues('current', finalValue);
        
            // Gestion des valeurs minimales et maximales pour les types numériques
            if (settings.type === 'integer' || settings.type === 'float') {
                const { totalMin, totalMax } = settings;
        
                // Applique les limites définies pour finalValue
                if (totalMin !== undefined && totalMin !== null && finalValue <= totalMin) {
                    updateCurrentValues('current', totalMin);
                } else if (totalMax !== undefined && totalMax !== null && finalValue >= totalMax) {
                    updateCurrentValues('current', totalMax);
                }
        
                // Met à jour les digits si la valeur finale a changé
                if (finalValue !== getCurrentValueByIndex('current')) {
                    fillDigits(getCurrentValueByIndex('current'), type);
                }
            }
        
            // Appel de la fonction de rappel `onValueChange` si `onchange` est vrai
            if (onchange && typeof settings.onValueChange === 'function') {
                settings.onValueChange($input, getCurrentValueByIndex('current'));
            }
        }
        
        /* Changement de l'effet de persitance des valeur 
        possible en haut et en bas */
        function updatePeripheralDigit(type,id,showTop,showBottom,valueTop,valueBottom) {

            $('.cla-input-wrapper .top-text-'+type+'-'+id).css("visibility","hidden");
            $('.cla-input-wrapper .bottom-text-'+type+'-'+id).css("visibility","hidden");
            $('.cla-input-wrapper .top-text-'+type+'-'+id).css("opacity","0"); 
            $('.cla-input-wrapper .bottom-text-'+type+'-'+id).css("opacity","0"); 

            if (showTop)
            {
                $('.cla-input-wrapper .top-text-'+type+'-'+id).css("visibility","visible");
                $('.cla-input-wrapper .top-text-'+type+'-'+id).html(valueTop);
                $('.cla-input-wrapper .top-text-'+type+'-'+id).css("opacity","1"); 
            }
            
            if (showBottom)
            {
                $('.cla-input-wrapper .bottom-text-'+type+'-'+id).css("visibility","visible");
                $('.cla-input-wrapper .bottom-text-'+type+'-'+id).html(valueBottom);
                $('.cla-input-wrapper .bottom-text-'+type+'-'+id).css("opacity","1");
            }
        }

        function numberToDigitsArray(number) {
            // Convertir le nombre en chaîne de caractères, supprimer le point décimal pour les floats
            const numberStr = number.toString().replace('.', '');

            // Initialiser le tableau de chiffres en extrayant chaque chiffre
            let digitsArray = Array.from(numberStr, char => parseInt(char, 10));

            // Compléter avec des zéros si nécessaire
            while (digitsArray.length < settings.numInputs) {
                digitsArray.push(0);
            }

            // Limiter le tableau à la taille numInputs, au cas où il y aurait trop de chiffres
            return digitsArray.slice(0, settings.numInputs);
        }
        
        function digitsArrayToNumber(digitsArray, isFloat = false, decimalPosition = 0) {
        // Convertir chaque chiffre en chaîne de caractères
          let numberStr = digitsArray.map(digit => digit.toString()).join('');
          
          // Si un index de décimale est fourni, insérer le point décimal
          if (isFloat == true && decimalPosition < digitsArray.length) {
            numberStr = numberStr.slice(0, decimalPosition) + '.' + numberStr.slice(decimalPosition);
          }
          
          // Convertir la chaîne résultante en nombre (float ou integer selon la présence du point)
          return parseFloat(numberStr);
        }

        function calculatePeripheralDisplay(prefix, id, value, inputElement, hover) {
            // Vérification initiale pour le hover
            if (hover !== gIdHover) {
                return { index: -1, showTop: false, showBottom: false, adjustedValueTop: 0, adjustedValueBottom: 0 };
            }
        
            // Dictionnaire d'actions pour chaque type de `prefix`
            const actions = {
                "digits": () => {
                    const newValue = digitsArrayToNumber(getCurrentValueByIndex(prefix), settings.type === 'float', settings.decimalPosition);
                    const valueLimits = calculateValueLimits(inputElement, id, newValue, limitDigitMin, limitDigitMax);
                    return {
                        index: id,
                        showTop: valueLimits.showTop,
                        showBottom: valueLimits.showBottom,
                        adjustedValueTop: valueLimits.valueTop,
                        adjustedValueBottom: valueLimits.valueBottom
                    };
                },
                "sign": () => {
                    return {
                        index: prefix,
                        showTop: value === "-",
                        showBottom: value === "+",
                        adjustedValueTop: "+",
                        adjustedValueBottom: "-"
                    };
                },
                "list": () => {
                    const { valueTop, valueBottom } = calculateAdjacentValues(value);
                    const { valueMin, valueMax } = getValueLimits(inputElement);
                    const valueLimits = calculateVisibilityAndAdjustLimits(valueTop, valueBottom, valueMin, valueMax);
                    return {
                        index: prefix,
                        showTop: valueLimits.showTop,
                        showBottom: valueLimits.showBottom,
                        adjustedValueTop: settings.values[valueLimits.adjustedValueTop],
                        adjustedValueBottom: settings.values[valueLimits.adjustedValueBottom]
                    };
                }
            };
        
            // Exécution de l'action correspondante au `prefix`, sinon retour par défaut
            return actions[prefix] ? actions[prefix]() : { index: -1, showTop: false, showBottom: false, adjustedValueTop: 0, adjustedValueBottom: 0 };
        }
        
        function setValueInput(inputElement, value, prefix, type) {
            // Déterminer l'ID pour les types `digit` et `list`
            const id = prefix === "digits" ? $(inputElement).attr('id').replace(`${prefix}_${type}_input_`, '') : prefix;
            const hover = type + (prefix === "digits" ? id : prefix);
        
            // Dictionnaire des actions pour définir `newValue` et mettre à jour `currentValues`
            const actions = {
                "digits": () => {
                    updateCurrentValues((id - 1), value);
                    return value;
                },
                "sign": () => {
                    updateCurrentValues("sign", value);
                    return value;
                },
                "list": () => {
                    const listValue = settings.values[value];
                    updateCurrentValues("list", listValue);
                    return listValue;
                }
            };
        
            // Exécute l'action correspondant au `prefix` pour définir `newValue`
            const newValue = actions[prefix] ? actions[prefix]() : "";
        
            // Met à jour la valeur de l'input et appelle les fonctions d'actualisation
            inputElement.value = newValue;
            updateFinalValue($(inputElement), newValue, type);
        
            // Calcul des informations pour l'affichage périphérique
            const displayData = calculatePeripheralDisplay(prefix, id, value, inputElement, hover);
        
            // Mise à jour de l'affichage périphérique avec les données calculées
            updatePeripheralDigit(type, displayData.index, displayData.showTop, displayData.showBottom, displayData.adjustedValueTop, displayData.adjustedValueBottom);
        }
   
        function calculateNextIndex(id, settings) {
            let index = id;
        
            if (settings.autoFocusNextInput === true && settings.autoFocusNextInputDirection !== null) {
                switch (settings.autoFocusNextInputDirection) {
                    case "Forward":
                    case "Right":
                        index += 1;
                        break;
                    case "Backward":
                    case "Left":
                        index -= 1;
                        break;
                    default:
                        console.warn(`Direction "${settings.autoFocusNextInputDirection}" non reconnue. L'index reste inchangé.`);
                }
            }
        
            return index;
        }
        
        function applyInput(inputElement, codeTouche, event, prefix, type, id = null, numInputs = null) {
            const isPasteCode = event.ctrlKey && event.key === 'paste';
        
            // Récupérer les limites pour `digit`
            const { valueMin, valueMax } = getValueLimits(inputElement);
        
            // Gestion des touches de contrôle (Copier, Coller)
            if ((event.ctrlKey && (event.key === 'c' || codeTouche === 67)) ||
                (event.ctrlKey && (event.key === 'v' || codeTouche === 86)) ||
                (!event.ctrlKey && codeTouche === 17)) {
                event.preventDefault();
                return;
            }
        
            // Détermine l'action en fonction du `prefix`
            if (prefix === "digits") {
                // Vérifier si la touche est valide pour un chiffre
                if ((codeTouche >= 48 && codeTouche <= (48 + valueMax)) || // Chiffres (0-9)
                    (codeTouche >= 96 && codeTouche <= (96 + valueMax) && !isPasteCode) || // Pavé numérique (0-9)
                    codeTouche === 8 || // Retour arrière
                    codeTouche === 9 || // Tabulation
                    codeTouche === 46) { // Supprimer
                    if (codeTouche === 8) {
                        // Gestion du retour arrière
                        setValueInput(inputElement, valueMin, prefix, type);
                        if ((id-1) === 0) id = numInputs + 1;
                        $("#" + prefix + "_" + type + "_input_" + (id-1)).focus();

                    } else if (codeTouche === 46) {
                        // Gestion de la touche Supprimer
                        setValueInput(inputElement, valueMin, prefix, type);
                        if ((id + 1) === numInputs + 1) id = 0;
                        $("#" + prefix + "_" + type + "_input_" + (id+1)).focus();
                    } else if (codeTouche !== 9) {
                        // Gestion des chiffres
                        const lastChar = inputElement.value.slice(-1);
                        const regex = /^[0-9]$/;
                        if (!regex.test(lastChar)) {
                            // Supprimer la dernière entrée si elle n'est pas valide
                            setValueInput(inputElement, inputElement.value.slice(0, -1), prefix, type);
                        } else {
                            let key = event.key;
                            if (isPasteCode) key = convertCodeToChar(codeTouche);
                            
                            setValueInput(inputElement, key, prefix, type);

                            $("#" + prefix + "_" + type + "_input_" + calculateNextIndex(id,settings)).focus();
                        }
                    }
                } else {
                    // Valeur non valide pour un digit
                    setValueInput(inputElement, valueMin, prefix, type);
                    event.preventDefault();
                }
            } else if (prefix === "sign") {
                // Gestion des signes
                if (event.key === '+' || event.key === '-') {
                    setValueInput(inputElement, event.key, prefix, type);
                } else if (codeTouche !== 9) {
                    // Valeur non valide pour un signe
                    setValueInput(inputElement, "+", prefix, type);
                    event.preventDefault();
                }
            }
        }
        
        function handleTouchInput(inputElement, event, prefix, type, id = null, numInputs = null) {
            const originalEvent = event.originalEvent || event;
        
            // Récupérer le code de la touche appuyée
            const codeTouche = originalEvent.keyCode || originalEvent.which;
        
            // Vérifie si la touche "Maj" (Shift) n'est pas enfoncée
            if (codeTouche !== 16) {
                applyInput(inputElement, codeTouche, originalEvent, prefix, type, id, numInputs);
            }
        }

        /* Gestionnaire de modification de la mollette de la souris */
        function adjustOnScroll(event, inputElement,prefix,type) 
        {
            if (!settings.allowScroll) return;

            const originalEvent = event.originalEvent || event;

            originalEvent.preventDefault();

            // Vérifie si une touche est nécessaire pour le scroll
            if (settings.requireKeyForScroll) {
                const keyRequired = settings.requireKeyForScroll.toLowerCase();
                // Vérifie si la touche requise est enfoncée
                    if ((keyRequired === 'control' && !event.ctrlKey) ||
                    (keyRequired === 'shift' && !event.shiftKey) ||
                    (keyRequired === 'alt' && !event.altKey) ||
                    (keyRequired === 'meta' && !event.metaKey)) {
                    return; // Sort de la fonction si la touche n'est pas enfoncée
                }
            }

            const delta = originalEvent.deltaY !== undefined 
                ? originalEvent.deltaY 
                : (originalEvent.wheelDelta ? -originalEvent.wheelDelta : 0);

            if (Math.abs(delta) < settings.scrollSensitivity) {
                return; // Ignore les petits défilements
            }

            if (prefix == "digits")
            {
                let currentValue = parseInt(inputElement.value, 10);
                if (currentValue != -1)
                {
                    // Incrémenter ou décrémenter la valeur en fonction de la direction du scroll
                    currentValue += delta < 0 ? -1 : 1;
                    const { valueMin, valueMax } = getValueLimits(inputElement);
                    const {adjustedValue} = adjustLimits(currentValue,null,null,valueMin,valueMax);
                    currentValue = adjustedValue;
                    setValueInput(inputElement,currentValue,prefix,type);
                }
            } 
            else if (prefix == "sign")
            {
                let currentValue = -1;

                if (inputElement.value == "-") currentValue = 0;
                if (inputElement.value == "+") currentValue = 1;

                if (currentValue != -1)
                {
                    // Incrémenter ou décrémenter la valeur en fonction de la direction du scroll
                    currentValue += delta < 0 ? -1 : 1;
                    // Contrôler les limites de la valeur
                    if (currentValue < 0) setValueInput(inputElement,"+",prefix,type);
                    if (currentValue > 1) setValueInput(inputElement,"-",prefix,type);
                }
            }
            else if (prefix == "list")
            {
                let currentValue = findPosition(settings.values,inputElement.value);
                if (currentValue != -1)
                {
                    // Incrémenter ou décrémenter la valeur en fonction de la direction du scroll
                    currentValue += delta < 0 ? -1 : 1;
                    const { valueMin, valueMax } = getValueLimits(inputElement);
                    const {adjustedValue} = adjustLimits(currentValue,null,null,valueMin,valueMax);
                    currentValue = adjustedValue;

                    setValueInput(inputElement,currentValue,prefix,type);
                }
            }
        }

        function calculateAdjacentValues(value) 
        {
            const currentValue = parseInt(value, 10);
            const valueTop = currentValue - 1;
            const valueBottom = currentValue + 1;
            return { valueTop, valueBottom };
        }

        function calculateValueLimits(inputElement, id, currentValue, limitDigitMin, limitDigitMax) 
        {
            let {valueTop,valueBottom} = calculateAdjacentValues($(inputElement).val());
       
            // Ajuster les valeurs top et bottom en fonction des limites globales
            if (settings.totalMax !== undefined && settings.totalMax !== null && currentValue >= settings.totalMax) {
                valueTop = parseInt(limitDigitMax[id - 1]) - 1;
            }
            if (settings.totalMin !== undefined && settings.totalMin !== null && currentValue <= settings.totalMin) {
                valueBottom = parseInt(limitDigitMin[id - 1]) + 1;
            }

            let { valueMin, valueMax } = getValueLimits(inputElement);

            // Récupérer les limites spécifiques de l'élément
            valueMin = Math.max(valueMin, settings.totalMin ?? -Infinity);
            valueMax = Math.min(valueMax, settings.totalMax ?? Infinity);
        
            // Ajuster les valeurs min et max en fonction des limites de digits
            if (settings.totalMin !== undefined && settings.totalMin !== null && currentValue <= settings.totalMin) {
                valueMin = Math.max(valueMin, limitDigitMin[id - 1]);
            }
            if (settings.totalMax !== undefined && settings.totalMax !== null && currentValue >= settings.totalMax) {
                valueMax = Math.min(valueMax, limitDigitMax[id - 1]);
            }
        
            // Calculer les indicateurs de visibilité pour top et bottom
            const showTop = (valueTop >= valueMin);
            const showBottom = (valueBottom <= valueMax);
        
            return { valueTop, valueBottom, valueMin, valueMax, showTop, showBottom };
        }

        function adjustLimits(value, valueTop = null, valueBottom = null, valueMin, valueMax) {
            // Si seule la valeur unique est fournie, ajuster selon les limites min/max
            if (valueTop === null && valueBottom === null) {
                const adjustedValue = Math.max(valueMin, Math.min(value, valueMax));
                return { adjustedValue };
            }
            
            // Ajuster les valeurs si elles sont en dehors des limites
            const adjustedValueTop = valueTop !== null ? Math.max(valueTop, valueMin) : null;
            const adjustedValueBottom = valueBottom !== null ? Math.min(valueBottom, valueMax) : null;
        
            // Retourner en fonction des valeurs fournies
            if (valueTop !== null && valueBottom === null) {
                return { adjustedValueTop };
            } else if (valueBottom !== null && valueTop === null) {
                return { adjustedValueBottom };
            }
            
            // Si les deux valeurs sont fournies, renvoyer l'objet complet
            return {
                adjustedValueTop,
                adjustedValueBottom
            };
        }

        function calculateVisibilityAndAdjustLimits(valueTop, valueBottom, valueMin, valueMax) {
            // Calculer la visibilité en fonction des valeurs et des limites
            const showTop = valueTop >= valueMin;
            const showBottom = valueBottom <= valueMax;
        
            // Ajuster les valeurs si elles sont en dehors des limites
            const {adjustedValueTop,adjustedValueBottom} = adjustLimits(null,valueTop,valueBottom,valueMin,valueMax);
        
            return {
                showTop,
                showBottom,
                adjustedValueTop,
                adjustedValueBottom
            };
        }
        
        function hoverMouseEnter(inputElement,prefix,type) 
        {
            let id = parseInt($(inputElement).attr('id').replace(prefix+'_'+type+'_input_', ''));
           
            if (prefix == "digits")
            {
                gIdHover = type + id;
                let valueLimites = calculateValueLimits(inputElement,id, getCurrentValueByIndex('current'),limitDigitMin,limitDigitMax);
                updatePeripheralDigit(type,id, valueLimites.showTop, valueLimites.showBottom, valueLimites.valueTop, valueLimites.valueBottom);
            }
            else if (prefix == "sign")
            {
                gIdHover = type + prefix;
                let showTop = ($(inputElement).val() == "-");
                let showBottom = ($(inputElement).val() == "+");

                updatePeripheralDigit(type,prefix,showTop,showBottom,"+","-");
            }
            else if (prefix == "list")
            {
                gIdHover = type + prefix;
                let currentValue = findPosition(settings.values,inputElement.value);

                console.log(currentValue);

                if (currentValue != -1)
                {
                    const valueTop = parseInt(currentValue) - 1;
                    const valueBottom =  parseInt(currentValue) + 1;
        
                    const { valueMin, valueMax } = getValueLimits(inputElement);
                    
                    let valueLimites = calculateVisibilityAndAdjustLimits(valueTop,valueBottom,valueMin,valueMax);

                    updatePeripheralDigit(type,prefix,valueLimites.showTop,valueLimites.showBottom,settings.values[valueLimites.adjustedValueTop],settings.values[valueLimites.adjustedValueBottom]);
                }
            }
        }

        function hoverMouseLeave(inputElement,prefix,type) 
        {
            if (prefix == "digits")
            {
                let id = $(inputElement).attr('id').replace(prefix+'_'+type+'_input_', '');
                updatePeripheralDigit(type,id, false, false, 0 ,0);
            }
            else if (prefix == "sign" || prefix == "list")
            {
                updatePeripheralDigit(type,prefix,false, false, 0 ,0);
            }
            gIdHover = null;
        }

        function toggleHoverEffect(element, prefix, type, isMouseEnter) {
            const suffix = $(element).attr('id').replace(`${prefix}_${type}_div_`, '');
            const position = suffix.includes('top') ? 'top' : 'bottom';
            const id = suffix.replace(`${position}_`, '');
            const selector = `.cla-input-wrapper .${position}-text-${type}-${id}`;
        
            $(selector).css({
                visibility: isMouseEnter ? "visible" : "hidden",
                opacity: isMouseEnter ? "1" : "0"
            });
        }

        function handleTextDivClick(element, prefix, type) {
            
            let suffix = $(element).attr('id').replace(prefix+'_' + type + '_div_', '');
            let id, value,valueTop, valueBottom, valueLimites;
        
            if (prefix == "digits")
            {
                if (suffix.includes('top')) {
                    id = suffix.replace('top_', '');
                    const { valueMin } = getValueLimits( "#"+prefix+"_" + type + "_input_" + id );
                    value = parseInt($(element).html());
                    $("#"+prefix+"_" + type + "_input_" + id).val(value);
                    updateFinalValue($("#"+prefix+"_" + type + "_input_" + id), value, type);
                    gIdHover = type + id;
                    valueTop = value - 1;
                    valueLimites = calculateValueLimits($("#"+prefix+"_" + type + "_input_" + id),id,valueTop,limitDigitMin, limitDigitMax);
                    updatePeripheralDigit(type, id, valueLimites.showTop, false, valueLimites.valueTop, 0);
                    gIdHover = null;
                } else {
                    id = suffix.replace('bottom_', '');
                    value = parseInt($(element).html());
                    $("#"+prefix+"_" + type + "_input_" + id).val(value);
                    updateFinalValue($("#"+prefix+"_" + type + "_input_" + id), value, type);
                    gIdHover = type + id;
                    valueBottom = value + 1;
                    valueLimites = calculateValueLimits($("#"+prefix+"_" + type + "_input_" + id),id,valueBottom,limitDigitMin, limitDigitMax);
                    updatePeripheralDigit(type, id, false, valueLimites.showBottom, 0, valueLimites.valueBottom);
                    gIdHover = null;
                }
            }
            else if ( prefix == "sign" )
            {
                $("#"+prefix+"_" + type + "_input_"+prefix).val($(element).html());
                updateFinalValue($("#"+prefix+"_" + type + "_input_"+prefix),$(element).html(), type);
                gIdHover = type + prefix;
                updatePeripheralDigit(type,prefix, false, false, 0 ,0);
                gIdHover = null;
            }
            else if ( prefix == "list" )
            {
                const { valueMin,valueMax } = getValueLimits( "#"+prefix+"_" + type + "_input_"+prefix );
                $("#"+prefix+"_" + type + "_input_"+prefix).val($(element).html());
                updateFinalValue($("#"+prefix+"_" + type + "_input_"+prefix),$(element).html(), type);
                gIdHover = type + prefix;
                let currentValue = findPosition(settings.values,$(element).html());
                if (suffix.includes('top')) {

                    valueTop = currentValue - 1;
                    valueLimites = calculateVisibilityAndAdjustLimits(valueTop,0,valueMin,0);
                    updatePeripheralDigit(type, prefix, valueLimites.showTop, false, settings.values[valueLimites.adjustedValueTop], "...");
                } else {

                    valueBottom = currentValue + 1;
                    valueLimites = calculateVisibilityAndAdjustLimits(0,valueBottom,0,valueMax);
                    updatePeripheralDigit(type, prefix, false, valueLimites.showBottom, "...", settings.values[valueLimites.adjustedValueBottom]);
                }
                gIdHover = null;
            }
        }

        function getAdjustedValueSettings(index, inputValue = null, settings, digitMin, digitMax) {
            const min = settings.minValues[index] !== undefined 
                ? Math.max(digitMin, Math.min(settings.minValues[index], digitMax)) 
                : digitMin;
        
            const max = settings.maxValues[index] !== undefined 
                ? Math.max(digitMin, Math.min(settings.maxValues[index], digitMax)) 
                : digitMax;
        
            let value = (inputValue != null) ? inputValue : ( settings.values[index] !== undefined 
                ? settings.values[index] 
                : settings.defaultValue);
    
            // Ajuster `value` pour qu'il soit compris entre `min` et `max`
            value = Math.max(min, Math.min(value, max));

            return { min, max, value };
        }

        function handlePasteEvent(element, event, uniqueTypeShort, prefix) 
        {
            const originalEvent = event.originalEvent || event;

            originalEvent.preventDefault();
            let pasteText = originalEvent.clipboardData.getData('text');
            if (pasteText.length > 1) pasteText = pasteText.substring(0, 1); // Limiter à un caractère
            let codeTouche = pasteText.charCodeAt(0);
            originalEvent.ctrlKey = true;
            originalEvent.key = 'paste';
            
            let id = $(element).attr('id').replace(`${prefix}_${uniqueTypeShort}_input_` , '');
            applyCode(element, codeTouche, originalEvent, prefix, uniqueTypeShort, id, settings.numInputs);
        }

        function createTextElement(prefix, uniqueTypeShort, id, position, text) {
            return $('<div>', {
                class:  (id != null) ? `cla-hover-text ${position}-text-${uniqueTypeShort}-${id}` : `cla-hover-text ${position}-text-${uniqueTypeShort}` ,
                id: (id != null) ? `${prefix}_${uniqueTypeShort}_div_${position}_${id}` : `${prefix}_${uniqueTypeShort}_div_${position}`,
                text: text
            }).hover(
                function() { toggleHoverEffect(this, prefix, uniqueTypeShort, true); },
                function() { toggleHoverEffect(this, prefix, uniqueTypeShort, false); }
            ).on('click', function () { handleTextDivClick(this, prefix, uniqueTypeShort); });
        }

        function createInputElement(prefix, uniqueTypeShort, id, min, max, value , maxLength = '1' , isDisabled = false) {
            const $input = $('<input>', {
                type: 'text',
                class: `form-control form-control-lg text-center cla-h2-like ${prefix}-input`,
                maxLength: maxLength,
                id: ( (id != null) ? `${prefix}_${uniqueTypeShort}_input_${id}` : `${prefix}_${uniqueTypeShort}_input` ) ,
                name: (id != null) ? `${prefix}${id}` : `${prefix}` ,
                autocomplete: 'off',
                value: value,
                'data-min': min,
                'data-max': max,
                disabled: isDisabled ? 'disabled' : null
            });

            // Ajouter les événements
            $input.on('keyup', (event) => handleTouchInput(event.currentTarget, event, prefix, uniqueTypeShort, id , settings.numInputs))
                .on('wheel', (event) => adjustOnScroll(event, event.currentTarget, prefix, uniqueTypeShort))
                .hover(
                    function () { hoverMouseEnter(this, prefix, uniqueTypeShort); },
                    function () { hoverMouseLeave(this, prefix, uniqueTypeShort); }
                )
                .on('paste', (event) => handlePasteEvent(this, event, uniqueTypeShort, prefix))
                .on('copy', (event) => {
                    event.preventDefault();
                    navigator.clipboard.writeText($(this).val());
                });

            return $input;
        }

        // Fonction pour ajouter un élément d'entrée complet (texte supérieur, champ d'entrée, texte inférieur)
      
        // Création des inputs dans chaque élément sélectionné
        this.each(function () {
            const $container = $(this);

            // Création d'un div parent avec la classe `cla-input-container` pour appliquer le `gap`
            const $inputContainer = $('<div>', {
                class: 'cla-input-container',
                css: { display: 'flex', 'justify-content': 'center', 'align-items' : 'center' , gap: settings.gap } // Appliquer le gap défini dans les settings
            });

            function addInputElement(prefix, id, min, max, value, maxLength = '1', isDisabled = false) {
                const $wrapperDiv = $('<div>', { class: 'text-center cla-input-wrapper', css: { position: 'relative' } });
                $wrapperDiv.append(createTextElement(prefix, uniqueTypeShort, id, "top", min ?? "..."));
                $wrapperDiv.append(createInputElement(prefix, uniqueTypeShort, id, min, max, value, maxLength, isDisabled));
                $wrapperDiv.append(createTextElement(prefix, uniqueTypeShort, id, "bottom", min ?? "..."));
                $inputContainer.append($wrapperDiv);
            }
    
            if (settings.type === "integer" || settings.type === "float" ) 
            { 
                if (settings.allowSign) {
                    addInputElement("sign", "sign", null, null, getCurrentValueByIndex("sign"));
                }

                for (let i = 1; i <= settings.numInputs; i++) {
                    if (settings.type === 'float' && (i - 1) === settings.decimalPosition) {
                        $inputContainer.append($('<div>', { class: 'col-1', html: `<div><h2 class="my-5">${settings.separator}</h2></div>` }));
                    }
                    const { min, max, value } = getAdjustedValueSettings(i - 1, null, settings, digitMin, digitMax);
                    addInputElement("digits", i, min, max, value);
                    updateCurrentValues(i - 1, value);
                }

                $container.append($inputContainer);
                
                for (let i = 1; i <= settings.numInputs; i++) {
                    const prefix = "digits";
                    const { value } = getAdjustedValueSettings(i - 1, null, settings, digitMin, digitMax);
                    updateFinalValue($("#"+prefix+"_" + uniqueTypeShort + "_input_" + i), value, uniqueTypeShort , false);
                }
            }
            else if (settings.type === "text" )
            {
                addInputElement("list", "list", 0, settings.values.length - 1, settings.values[settings.defaultValue], '30', true);
                $container.append($inputContainer);
                updateCurrentValues('current',settings.values[settings.defaultValue]);
            } 
        });
       
        // Méthode pour récupérer la valeur complète
        this.getCompleteValue = function() {
            return getCurrentValueByIndex('current');
        };
        
        // Méthode pour récupérer un chiffre spécifique à un index donné
        this.getDigitAt = function(index) {
            if (settings.type === "integer" || settings.type === "float" ) 
            { 
                // Vérifie si l'index est dans la plage de currentValue
                if (index >= 0 && index < currentDigit.length) {
                    const digit = getCurrentValueByIndex(index);
                    return parseInt(digit, 10); // Ignorer le point décimal
                } else {
                    throw new Error("L'index est en dehors de la plage");
                }
            }
            else{
                throw new Error("settings.type non disponible avec la fonction getDigitAt");
            }
        };

       // Fonction pour définir la valeur complète en répartissant les caractères dans les inputs
       this.setCompleteValue = function(value, onchange = false) 
       { 
            const isNumber = (val) => /^[-+]?\d+(\.\d+)?$/.test(val); // Vérifie si la valeur est un float ou un integer
        
            // Vérifie si le type est bien défini dans settings
            if (settings.type === "integer" || settings.type === "float") {
                
                // Vérifie que la valeur est un nombre valide
                if (isNumber(value)) {

                    updateCurrentValues("fillDigits",0);

                    fillDigits(value,uniqueTypeShort);
   
                    let newValue = digitsArrayToNumber(getCurrentValueByIndex('digits'), settings.type === 'float', settings.decimalPosition);
                    newValue = addSignToValue(newValue,uniqueTypeShort);

                    updateCurrentValues('current',newValue);

                    // Déclenche le callback onValueChange si demandé
                    if (onchange && typeof settings.onValueChange === 'function') {
                        settings.onValueChange(null, getCurrentValueByIndex('current'));
                    }
                } else {
                    throw new Error("La valeur doit être un nombre flottant ou un entier.");
                }
            } 
            else if (settings.type === "text") {
                // Vérifie si la valeur existe dans settings.values
                let index = findPosition(settings.values, value);
                if (index !== -1) {
                    $("#list_" + uniqueTypeShort + "_input").val(value);
                    
                    updateCurrentValues('current',value);
                          
                    // Déclenche le callback onValueChange si demandé
                    if (onchange && typeof settings.onValueChange === 'function') {
                        settings.onValueChange(null, getCurrentValueByIndex('current'));
                    }
                } else {
                    throw new Error("Le texte n'est pas reconnu dans les valeurs disponibles.");
                }
            } 
            else {
                throw new Error("Le type spécifié dans settings n'est pas compatible avec setCompleteValue.");
            }
        };

        return this;
    };

    $.fn.codeInputBuilder.version = "0.0.6";
    $.fn.codeInputBuilder.title = "CodeInputBuilder";
    $.fn.codeInputBuilder.description = "Un plugin jQuery pour créer des champs d'input configurables pour des valeurs numériques ou flottantes et pour les textes.";

}(jQuery));

