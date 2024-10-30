/*
Plugin: Code Input Builder
Version: 0.0.3
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

(function ($) {
        
   $.fn.codeInputBuilder = function (options) {
        // Options par défaut
        const settings = $.extend({
            type: 'integer', // integer ou float ou text
            numInputs: 1, // seulement pour integer et float
            minValues: [], // seulement pour integer et float
            maxValues: [], // seulement pour integer et float
            values: [], // seulement pour integer, float et text
            defaultValue: 0, // seulement pour integer et float ou index de values pour le type text
            allowSign: false, // Nouveau paramètre pour autoriser le signe , seulement pour integer et float
            defaultSign: '+', // Signe par défaut (peut être "+" ou "-") seulement pour integer et float
            decimalPosition : 1, // seulement pour integer et float
            separator : '.', // seulement pour integer et float
            totalMax: null, // Valeur maximale totale , seulement pour integer et float
            totalMin: null, // Valeur minimale totale , seulement pour integer et float
            allowScroll: true, // Active le défilement par défaut
            scrollSensitivity: 50, // Indique le niveau de sensibilité du défilement pour ajuster la valeur.
            requireKeyForScroll: null, // Par défaut, aucune touche n'est requise possibilité [control,shift,alt,meta]
            gap: '10px', // Espace entre les inputs
            onValueChange: null, // Fonction de surcharge pour les changements de valeur
        }, options);

        $.fn.codeInputBuilder.version = "0.0.3";
        $.fn.codeInputBuilder.title = "Code Input Builder";
        $.fn.codeInputBuilder.description = "Un plugin jQuery pour créer des champs d'input configurables pour des valeurs numériques ou flottantes et pour les textes.";

        let gIdHover = -1;
        // decimal ( 0,1,2,3,4,5,6,7,8,9) - Chiffres (numériques)
        let digitMin = 0;
        let digitMax = 9;
        // hexadecimal ( 0,1,2,3,4,5,6,7,8,9,a,b,c,d,e,f ) - Lettres (alphabétiques)
        let digitHexaMin = 0x30; // 0
        let digitHexaMax = 0x66; // f
        // Lettres alphabétiques ( a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z ) - Lettres (alphabétiques)
        let digiLetterMin = 0x61; // a minuscule
        let digitLetterMax = 0x7A; // z minuscule

        let currentDigitSign = (settings.allowSign) ?  settings.defaultSign : null;
        let currentDigit = new Array(settings.numInputs);
        let currentValue = ''; // Variable pour stocker la valeur complète des inputs
        let limitDigitMin = ( settings.totalMin !== undefined && settings.totalMin != null ) ? numberToDigitsArray(settings.totalMin) : null;
        let limitDigitMax = ( settings.totalMax !== undefined && settings.totalMax != null ) ? numberToDigitsArray(settings.totalMax) : null;
        let uniqueTypeShort = settings.type + '_' + uuidShort();
        
        function findPosition(array, element) {
            return array.indexOf(element);
        }

        function uuidShort() {
            return 'xxxxxxxx'.replace(/[x]/g, function () {
                const r = Math.random() * 16 | 0;
                return r.toString(16);
            });
        }
        
        function computeDigitToFloat(prefix,type) 
        {
            let numberString = '';
            let cntDigit = 0;
            $('input[id^='+prefix+'_'+type+'_input]').each(function() {
                if (cntDigit === settings.decimalPosition) numberString += '.';
                numberString += $(this).val(); 
                cntDigit++;
            });
            return `${numberString}`;
        }
        
        function computeDigitToInteger(prefix,type)
        {
            let cntDigit = 0;
            let numberString = '';
            $('input[id^='+prefix+'_'+type+'_input]').each(function() {
                numberString += $(this).val(); 
                cntDigit++;
            });
            return `${numberString}`;
        }
        
        function computeSign(prefix,type)
        {
            let sign = '+';
            if ($('#'+prefix+'_' + type + '_input').length)
            {
                sign = $('#'+prefix+'_'+type+'_input').val();
            }
            return `${sign}`;
        }

        function updateFinalValue($input, newValue, prefix, type, onchange = true) {

            let finalValue;
            
            if (settings.type === 'integer') 
            {
                let numberString = computeDigitToInteger('digit',type);
                finalValue = parseInt(numberString,10);
                if (settings.allowSign) {
                    let sign = computeSign('sign',type);
                    finalValue *= ((sign == '+')? 1 : -1 );
                }
            }
            else if (settings.type === 'float') 
            {
                let numberString = computeDigitToFloat('digit',type);
                finalValue = parseFloat(numberString,10);
                if (settings.allowSign) {
                    let sign = computeSign('sign',type);
                    finalValue *= ((sign == '+')? 1 : -1 );
                }
            }
            else if (settings.type === 'text') 
            {
                finalValue = newValue;
            }
           
            currentValue = finalValue;
           
            if (settings.type === 'integer' || settings.type === 'float' )
            {
                if( settings.totalMin !== undefined && settings.totalMin != null && currentValue <= settings.totalMin) currentValue = settings.totalMin;
                if( settings.totalMax !== undefined && settings.totalMax != null && currentValue >= settings.totalMax) currentValue = settings.totalMax;
                
                if (finalValue != currentValue)
                {
                    if (settings.type === 'float') // Sépare la partie entière et décimale
                    {                    
                    fillFloatDigits(currentValue);
                    }
                    else if (settings.type === 'integer')
                    {
                    fillIntegerDigits(currentValue);
                    }
                }
            }
            
            // Appel de onValueChange avec $input et newValue
            if (onchange == true && typeof settings.onValueChange === 'function') {
                settings.onValueChange($input, currentValue);
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

        /* Mise à jour de la valeur de l'input passe en paramètre , puis mise à jour de la valeur finale,
        puis mise à jour de l'affichage des chiffre périphèrique en haut 
        et en bas si la souris est dessus en survol sinon pas besoin  */
        function setValueInput(inputElement,value,prefix,type) 
        {
            let id = $(inputElement).attr('id').replace(prefix+'_'+type+'_input_', '');
            currentDigit[id-1] = value;
            inputElement.value = value;
            updateFinalValue($(inputElement), value, prefix , type);
            
            let newValue = digitsArrayToNumber(currentDigit,(settings.type === 'float'),settings.decimalPosition);
           
            let valueTop = parseInt(value) - 1;
            if( settings.totalMax !== undefined && settings.totalMax != null && newValue >= settings.totalMax )
            {
                valueTop =  parseInt(limitDigitMax[id-1]) - 1 ;
            }

            let valueBottom =  parseInt(value) + 1;
            if( settings.totalMin !== undefined && settings.totalMin != null && newValue <= settings.totalMin )
            {
                valueBottom =  parseInt(limitDigitMin[id-1]) + 1 ;
            }
            
            let valueMin =  parseInt($(inputElement).attr('data-min'));
            let valueMax =  parseInt($(inputElement).attr('data-max'));
            
            if( settings.totalMin !== undefined && settings.totalMin != null && newValue <= settings.totalMin )
            {
                valueMin = Math.max(valueMin, limitDigitMin[id-1]);
            }
            if( settings.totalMax !== undefined && settings.totalMax != null && newValue >= settings.totalMax )
            {
                valueMax = Math.min(valueMax, limitDigitMax[id-1]);
            }
            
            if (id == gIdHover)
            {
                let showTop = (valueTop >= valueMin);
                let showBottom = (valueBottom < (valueMax + 1));
                updatePeripheralDigit(type,id, showTop, showBottom, valueTop ,valueBottom);
            }
        }

        function convertCodeToChar(codeTouche) {
            return String.fromCharCode(codeTouche);
        }

        function applyCode(inputElement,codeTouche,event,prefix,type,id,numInputs) 
        {
            const isPasteCode = (event.ctrlKey && event.key === 'paste');
            let valueMin =  parseInt($(inputElement).attr('data-min'));
            let valueMax =  parseInt($(inputElement).attr('data-max'));

            // Vérifie si Ctrl+C est pressé, si oui, ignore le reste de la fonction
            if ((event.ctrlKey && (event.key === 'c' || codeTouche === 67 )) 
                    ||  (event.ctrlKey && (event.key === 'v' || codeTouche === 86 ) )
                    ||  (!event.ctrlKey && codeTouche === 17) ) {

                event.preventDefault(); // Empêcher l'action par défaut pour les autres touches
                return; // Quitte la fonction pour éviter de réinitialiser l'input
            }
            if ((codeTouche >= 48 && codeTouche <= (48 + valueMax)) || // Chiffres (0-9)
                (codeTouche >= 96 && codeTouche <= (96 + valueMax) && !isPasteCode) || // Pavé numerique (0-9)
                codeTouche === 8 || // Touche "Retour arrière" (Backspace)
                codeTouche === 9 || // Touche "Tabulation"
                codeTouche === 46) { // Touche "Supprimer" (Delete)
                if (codeTouche === 8)
                {
                    setValueInput(inputElement,valueMin,prefix,type);
                    if ((id-2) == 0) id = numInputs+2;
                    $("#"+prefix+"_"+type+"_input_"+(id-2)).focus();
                }
                else if (codeTouche === 46)
                {
                    setValueInput(inputElement,valueMin,prefix,type);
                    if ((id+1) == numInputs+2) id = 1;
                    $("#"+prefix+"_"+type+"_input_"+id).focus();
                }
                else if (codeTouche != 9)
                {
                    var lastChar = inputElement.value.slice(-1);
                    var regex = /^[0-9]$/;
                    if (!regex.test(lastChar)) {
                        // Supprimer la dernière touche entrée si elle n'est pas valide
                        setValueInput(inputElement,inputElement.value.slice(0, -1),prefix,type);
                    }
                    else
                    {
                        let key = event.key;
                        if (isPasteCode)
                            key = convertCodeToChar(codeTouche);
                        
                        setValueInput(inputElement,key,prefix,type);
                        $("#"+prefix+"_"+type+"_input_"+id).focus();
                    }
                }
            }
            else {
                setValueInput(inputElement,valueMin,prefix,type);
                event.preventDefault(); // Empêcher l'action par défaut pour les autres touches
            }
        }

        function setValueInputSign(inputElement,value,prefix,type) 
        {
            currentDigitSign = value;
            inputElement.value = value;
            updateFinalValue($(inputElement), value, prefix, type);

            let showTop = (value == "-");
            let showBottom = (value == "+");
            
            updatePeripheralDigit(type,prefix,showTop,showBottom,"+","-");
        }

        function setValueInputList(inputElement,value,prefix,type) 
        {
            inputElement.value = settings.values[value];
            updateFinalValue($(inputElement), settings.values[value], prefix, type);

            let valueTop = parseInt(value) - 1;
            let valueBottom =  parseInt(value) + 1;

            let valueMin =  parseInt($(inputElement).attr('data-min'));
            let valueMax =  parseInt($(inputElement).attr('data-max'));
            
            let showTop = (valueTop >= valueMin);
            let showBottom = (valueBottom < (valueMax + 1));
            
            if (valueTop < valueMin ) valueTop = valueMin;
            if (valueTop > valueMax ) valueBottom = valueMax;

            updatePeripheralDigit(type,prefix,showTop,showBottom,settings.values[valueTop],settings.values[valueBottom]);
        }

        function applySign(inputElement,codeTouche,event,prefix,type) 
        {
            
            if (event.key === '+' || event.key === '-') {
                setValueInputSign(inputElement,event.key,prefix,type);
            } 
            else if (codeTouche != 9)
            {
                setValueInputSign(inputElement,"+",prefix,type);
                event.preventDefault(); // Empêcher l'action par défaut pour les autres touches
            }
        }

        function touchCode(inputElement,event,prefix,type,id,numInputs) 
        {
            const originalEvent = event.originalEvent || event;

            // Récupérer le code de la touche appuyée
            var codeTouche = originalEvent.keyCode || originalEvent.which;
            if (codeTouche != 16) // Touche "Maj enfoncée"
            {
                applyCode(inputElement,codeTouche,originalEvent,prefix,type,id,numInputs);
            }
        }

        /* Gestionnaire d'appui sur les touche du clavier pour les touche + et - du clavier */
        function touchSign(inputElement, event, prefix, type) 
        {
            const originalEvent = event.originalEvent || event;

            var codeTouche = originalEvent.keyCode || originalEvent.which;
            if (codeTouche != 16) // Touche "Maj enfoncée"
            {
                applySign(inputElement,codeTouche,originalEvent,prefix,type);
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

            if (prefix == 'digit')
            {
                let currentValue = parseInt(inputElement.value, 10);

                // Incrémenter ou décrémenter la valeur en fonction de la direction du scroll
                currentValue += delta < 0 ? -1 : 1;

                let valueMin = parseInt($(inputElement).attr('data-min'));
                let valueMax = parseInt($(inputElement).attr('data-max'));

                // Contrôler les limites de la valeur
                if (currentValue < valueMin) currentValue = valueMin;
                if (currentValue > valueMax) currentValue = valueMax;

                setValueInput(inputElement,currentValue,prefix,type);
            } 
            else if (prefix == 'sign')
            {
                let currentValue = 0;

                if (inputElement.value == "-") currentValue = 0;
                if (inputElement.value == "+") currentValue = 1;

                // Incrémenter ou décrémenter la valeur en fonction de la direction du scroll
                currentValue += delta < 0 ? -1 : 1;

                // Contrôler les limites de la valeur
                if (currentValue < 0) setValueInputSign(inputElement,"+",prefix,type);
                if (currentValue > 1) setValueInputSign(inputElement,"-",prefix,type);
            }
            else if (prefix == 'list')
            {
                let currentValue = findPosition(settings.values,inputElement.value);
                if (currentValue != -1)
                {
                    // Incrémenter ou décrémenter la valeur en fonction de la direction du scroll
                    currentValue += delta < 0 ? -1 : 1;
                    
                    let valueMin = parseInt($(inputElement).attr('data-min'));
                    let valueMax = parseInt($(inputElement).attr('data-max'));
    
                    // Contrôler les limites de la valeur
                    if (currentValue < valueMin) currentValue = valueMin;
                    if (currentValue > valueMax) currentValue = valueMax;
                }
                setValueInputList(inputElement,currentValue,prefix,type);
            }
            
        }

        function hoverMouseEnter(inputElement,prefix,type) 
        {
            if (prefix == "digit")
            {
                let valueTop = parseInt($(inputElement).val()) - 1;
                let valueBottom =  parseInt($(inputElement).val()) + 1;
                let id = $(inputElement).attr('id').replace(prefix+'_'+type+'_input_', '');
                let valueMin = parseInt($(inputElement).attr('data-min'));
                let valueMax= parseInt($(inputElement).attr('data-max'));
                
                if( settings.totalMax !== undefined && settings.totalMax != null )
                {
                    valueMax = Math.min(valueMax, limitDigitMax[id-1]);
                }
                
                gIdHover = id;
                let showTop = (valueTop >= valueMin);
                let showBottom = (valueBottom < (valueMax + 1));
                updatePeripheralDigit(type,id, showTop, showBottom, valueTop ,valueBottom);
            }
            else if (prefix == "sign")
            {
                let showTop = ($(inputElement).val() == "-");
                let showBottom = ($(inputElement).val() == "+");
                gIdHover = prefix;
                updatePeripheralDigit(type,prefix,showTop,showBottom,"+","-");
            }
            else if (prefix == "list")
            {
                let currentValue = findPosition(settings.values,inputElement.value);
                if (currentValue != -1)
                {
                    gIdHover = prefix;

                    let valueTop = parseInt(currentValue) - 1;
                    let valueBottom =  parseInt(currentValue) + 1;
        
                    let valueMin =  parseInt($(inputElement).attr('data-min'));
                    let valueMax =  parseInt($(inputElement).attr('data-max'));
                    
                    let showTop = (valueTop >= valueMin);
                    let showBottom = (valueBottom < (valueMax + 1));
                    
                    if (valueTop < valueMin ) valueTop = valueMin;
                    if (valueTop > valueMax ) valueBottom = valueMax;
        
                    updatePeripheralDigit(type,prefix,showTop,showBottom,settings.values[valueTop],settings.values[valueBottom]);
                }
            }
        }

        function hoverMouseLeave(inputElement,prefix,type) 
        {
            if (prefix == "digit")
            {
                let id = $(inputElement).attr('id').replace(prefix+'_'+type+'_input_', '');
                updatePeripheralDigit(type,id, false, false, 0 ,0);
            }
            else if (prefix == "sign" || prefix == "list")
            {
                updatePeripheralDigit(type,prefix,false, false, 0 ,0);
            }
            gIdHover = 0;
        }

        function fillFloatDigits(number) 
        {
            if (isNaN(number)) {
                return;
            }
            
            let baseValue = number;
            
            if( settings.totalMin !== undefined && settings.totalMin != null && baseValue <= settings.totalMin) baseValue = settings.totalMin;
            if( settings.totalMax !== undefined && settings.totalMax != null && baseValue >= settings.totalMax) baseValue = settings.totalMax;

            if (settings.allowSign) {
                $(`[id^="sign_${uniqueTypeShort}_input"]`).val((baseValue < 0) ? '-' : '+');
            }

            let numericValue = Math.abs(baseValue);

            let [integerPart, decimalPart] = numericValue.toString().split('.');
                   
            const maxIntegerLength = settings.decimalPosition;
            if (integerPart.length > maxIntegerLength) {
                integerPart = integerPart.slice(1);
            }
            integerPart = integerPart.padStart(settings.decimalPosition, '0'); 
            
            const maxDecimalLength = settings.numInputs - settings.decimalPosition;
            decimalPart = (decimalPart || '').slice(0, maxDecimalLength).padEnd(maxDecimalLength, '0');
            
            const digitInputs = $(`[id^="digit_${uniqueTypeShort}_input_"]`).get();
            let index = digitInputs.length - 1;
            
            for (let pos = 0; pos < digitInputs.length; pos++) {
                $(digitInputs[pos]).val(0);
            }
            
            for (let digit of (integerPart + (decimalPart || '')).split('').reverse()) {
                
                const min = settings.minValues[index] !== undefined ? Math.max(digitMin, Math.min(settings.minValues[index], digitMax)) : digitMin;
                const max = settings.maxValues[index] !== undefined ? Math.max(digitMin, Math.min(settings.maxValues[index], digitMax)) : digitMax;

                let value = Math.max(min, Math.min(digit, max));
                
                $(digitInputs[index]).val(value);
                
                currentDigit[index] = value;
                
                index--;
            }
        }

        function fillIntegerDigits(number) 
        {
            if (isNaN(number)) {
                return;
            }
            
            let baseValue = number;
            
            if( settings.totalMin !== undefined && settings.totalMin != null && baseValue <= settings.totalMin) baseValue = settings.totalMin;
            if( settings.totalMax !== undefined && settings.totalMax != null && baseValue >= settings.totalMax) baseValue = settings.totalMax;

            if (settings.allowSign) {
                $(`[id^="sign_${uniqueTypeShort}_input"]`).val((baseValue < 0) ? '-' : '+');
            }

            let numericValue = Math.abs(baseValue);

            // Répartit les valeurs dans les inputs
            const digitInputs = $(`[id^="digit_${uniqueTypeShort}_input_"]`).get();
            let index = digitInputs.length - 1;

            for (let pos = 0; pos < digitInputs.length; pos++) {
                $(digitInputs[pos]).val(0);
            }
            
            for (let digit of numericValue.toString().split('').reverse() ) {
                
                const min = settings.minValues[index] !== undefined ? Math.max(digitMin, Math.min(settings.minValues[index], digitMax)) : digitMin;
                const max = settings.maxValues[index] !== undefined ? Math.max(digitMin, Math.min(settings.maxValues[index], digitMax)) : digitMax;

                let value = Math.max(min, Math.min(digit, max));
                
                $(digitInputs[index]).val(value);
                
                currentDigit[index] = value;
                
                index--;
            }
        }

        function toggleHoverEffect(element, prefix , type, isMouseEnter) {
            let suffix = $(element).attr('id').replace(prefix+'_' + type + '_div_', '');
            let id, selector;
   
            if (prefix == "digit")
            {
                if (suffix.includes('top')) {
                    id = suffix.replace('top_', '');
                    selector = `.cla-input-wrapper .top-text-${type}-${id}`;
                } else {
                    id = suffix.replace('bottom_', '');
                    selector = `.cla-input-wrapper .bottom-text-${type}-${id}`;
                }
            }
            else if ( prefix == "sign" || prefix == "list" )
            {
                selector = `.cla-input-wrapper .${suffix}-text-${type}-${prefix}`;
            }

            $(selector).css("visibility", isMouseEnter ? "visible" : "hidden");
            $(selector).css("opacity", isMouseEnter ? "1" : "0");
        }

        function handleTextDivClick(element, prefix, type) {
            
            let suffix = $(element).attr('id').replace(prefix+'_' + type + '_div_', '');
            let id, value,valueMin , valueMax, showTop, showBottom, valueTop, valueBottom;
        
            if (prefix == "digit")
            {
                if (suffix.includes('top')) {
                    id = suffix.replace('top_', '');
                    value = parseInt($(element).html());
                    $("#"+prefix+"_" + type + "_input_" + id).val(value);
                    updateFinalValue($("#"+prefix+"_" + type + "_input_" + id), value, prefix, type);

                    gIdHover = id;
                    valueMin = parseInt($("#"+prefix+"_" + type + "_input_" + id).attr('data-min'));
                    valueTop = value - 1;
                    showTop = (valueTop >= valueMin);
                    updatePeripheralDigit(type, id, showTop, false, valueTop, 0);
                    gIdHover = 0;
                } else {
                    id = suffix.replace('bottom_', '');
                    value = parseInt($(element).html());
                    $("#"+prefix+"_" + type + "_input_" + id).val(value);
                    updateFinalValue($("#"+prefix+"_" + type + "_input_" + id), value, prefix, type);

                    gIdHover = id;
                    valueMax = parseInt($("#"+prefix+"_"+ type + "_input_" + id).attr('data-max'));
                    valueBottom = value + 1;
                    showBottom = (valueBottom < (valueMax + 1));
                    updatePeripheralDigit(type, id, false, showBottom, 0, valueBottom);
                    gIdHover = 0;
                }
            }
            else if ( prefix == "sign" )
            {
                $("#"+prefix+"_" + type + "_input").val($(element).html());
                updateFinalValue($("#"+prefix+"_" + type + "_input"),$(element).html(),prefix, type);
                gIdHover = prefix;
                updatePeripheralDigit(type,prefix, false, false, 0 ,0);
                gIdHover = 0;
            }
            else if ( prefix == "list" )
            {
                $("#"+prefix+"_" + type + "_input").val($(element).html());
                updateFinalValue($("#"+prefix+"_" + type + "_input"),$(element).html(),prefix, type);
                gIdHover = prefix;

                let currentValue = findPosition(settings.values,$(element).html());

                if (suffix.includes('top')) {
                    valueMin = parseInt($("#"+prefix+"_" + type + "_input").attr('data-min'));
                    valueTop = currentValue - 1;
                    showTop = (valueTop >= valueMin);
                    if (valueTop <  valueMin)  valueTop = valueMin;
                    updatePeripheralDigit(type, prefix, showTop, false, settings.values[valueTop], "...");
                } else {
                    valueMax = parseInt($("#"+prefix+"_"+ type + "_input").attr('data-max'));
                    valueBottom = currentValue + 1;
                    showBottom = (valueBottom < (valueMax + 1));
                    if (valueTop > valueBottom)  valueBottom = valueMax
                    updatePeripheralDigit(type, prefix, false, showBottom, "...", settings.values[valueBottom]);
                }
                gIdHover = 0;
            }
        }

        function handlePasteEvent(element, event, type, prefix , basename) {

            const originalEvent = event.originalEvent || event;

            originalEvent.preventDefault();
            let pasteText = originalEvent.clipboardData.getData('text');
            if (pasteText.length > 1) pasteText = pasteText.substring(0, 1); // Limiter à un caractère
            let codeTouche = pasteText.charCodeAt(0);
            originalEvent.ctrlKey = true;
            originalEvent.key = 'paste';
            
            let id = $(element).attr('id').replace(basename + '_', '');
            applyCode(element, codeTouche, originalEvent, prefix,type , id, settings.numInputs);
        }

        // Création des inputs dans chaque élément sélectionné
        this.each(function () {
            const $container = $(this);

            // Création d'un div parent avec la classe `cla-input-container` pour appliquer le `gap`
            const $inputContainer = $('<div>', {
                class: 'cla-input-container',
                css: { display: 'flex', 'justify-content': 'center', 'align-items' : 'center' , gap: settings.gap } // Appliquer le gap défini dans les settings
            });

            if (settings.type === "integer" || settings.type === "float" ) 
            { 

                if (settings.allowSign) {
                    
                    const prefix = "sign";
                    
                    // Création du wrapper
                    const $wrapperDiv = $('<div>', {
                        class: 'text-center cla-input-wrapper',
                        css: { position: 'relative' }
                    });

                    // Élément texte supérieur
                    const $topTextDiv = $('<div>', {
                        class: `cla-hover-text top-text-${uniqueTypeShort}-${prefix}`,
                        id: `${prefix}_${uniqueTypeShort}_div_top`,
                        text: "0"
                    });
                    
                    $topTextDiv.hover(
                        function() { // mouseenter
                            toggleHoverEffect(this, prefix, uniqueTypeShort, true);
                        },
                        function() { // mouseleave
                            toggleHoverEffect(this, prefix, uniqueTypeShort, false);
                        }
                    );
                    
                    $topTextDiv.on('click', function(event) {
                        handleTextDivClick(this, prefix, uniqueTypeShort);
                    });
                    
                    $wrapperDiv.append($topTextDiv);

                    // Création de l'input avec onkeyup, onwheel, et onhover, et onpaste
                    const $input = $('<input>', {
                        type: 'text',
                        class: `form-control form-control-lg text-center cla-h2-like ${prefix}-input`,
                        maxLength: '1',
                        id: `${prefix}_${uniqueTypeShort}_input`,
                        name: `${prefix}${prefix}`,
                        autocomplete: 'off',
                        value: currentDigitSign
                    });

                    $input.on('keyup', function(event) {
                        touchSign(event.currentTarget, event, prefix ,uniqueTypeShort);
                    });

                    $input.on('wheel', function(event) {
                        adjustOnScroll(event, event.currentTarget, prefix, uniqueTypeShort);
                    });
                    
                    $input.hover(
                        function() { // mouseenter
                            hoverMouseEnter(this, prefix, uniqueTypeShort);
                        },
                        function() { // mouseleave
                            hoverMouseLeave(this, prefix, uniqueTypeShort);
                        }
                    );
                    
                    $input.on('paste', function(event) {
                        handlePasteEvent(this, event, uniqueTypeShort, prefix, `${prefix}_${uniqueTypeShort}_input`);
                    });
                    
                    $input.on('copy', function(event) {
                        event.preventDefault(); // Empêche le comportement par défaut
                        navigator.clipboard.writeText($(this).val());
                    });

                    $wrapperDiv.append($input);

                    // Élément texte inférieur
                    const $bottomTextDiv = $('<div>', {
                        class: `cla-hover-text bottom-text-${uniqueTypeShort}-${prefix}`,
                        id: `${prefix}_${uniqueTypeShort}_div_bottom`,
                        text: "0"
                    });
                    
                    $bottomTextDiv.hover(
                        function() { // mouseenter
                            toggleHoverEffect(this, prefix, uniqueTypeShort, true);
                        },
                        function() { // mouseleave
                            toggleHoverEffect(this, prefix, uniqueTypeShort, false);
                        }
                    );
                    
                    $bottomTextDiv.on('click', function(event) {
                        handleTextDivClick(this, prefix, uniqueTypeShort);
                    });
                    
                    $wrapperDiv.append($bottomTextDiv);
                    $inputContainer.append($wrapperDiv);
                
                }

                for (let i = 1; i <= settings.numInputs; i++) {
                    
                    // Insère le div du point décimal si l'index correspond à `decimalPosition`
                    if (settings.type === 'float' && (i-1) === settings.decimalPosition) {
                        const $decimalPoint = $('<div>', {
                            class: 'col-1',
                            html: '<div><h2 class="my-5">'+settings.separator+'</h2></div>'
                        });
                        $inputContainer.append($decimalPoint);
                    }                
                    
                    const prefix = 'digit';
                    
                    // Utiliser les valeurs min et max spécifiques si fournies
                    const min = settings.minValues[i - 1] !== undefined ? Math.max(digitMin, Math.min(settings.minValues[i - 1], digitMax)) : digitMin;
                    const max = settings.maxValues[i - 1] !== undefined ? Math.max(digitMin, Math.min(settings.maxValues[i - 1], digitMax)) : digitMax;
                    let value = settings.values[i - 1] !== undefined ? settings.values[i - 1] : settings.defaultValue;

                    // Borne la valeur entre min et max
                    value = Math.max(min, Math.min(value, max));

                    currentDigit[i-1] = value;

                    // Création du wrapper
                    const $wrapperDiv = $('<div>', {
                        class: 'text-center cla-input-wrapper',
                        css: { position: 'relative' }
                    });

                    // Élément texte supérieur
                    const $topTextDiv = $('<div>', {
                        class: `cla-hover-text top-text-${uniqueTypeShort}-${i}`,
                        id: `${prefix}_${uniqueTypeShort}_div_top_${i}`,
                        text: min
                    });
                    
                    $topTextDiv.hover(
                        function() { // mouseenter
                            toggleHoverEffect(this, prefix, uniqueTypeShort, true);
                        },
                        function() { // mouseleave
                            toggleHoverEffect(this, prefix, uniqueTypeShort, false);
                        }
                    );
                    
                    $topTextDiv.on('click', function(event) {
                        handleTextDivClick(this, prefix, uniqueTypeShort);
                    });
                    
                    $wrapperDiv.append($topTextDiv);

                    // Création de l'input avec onkeyup, onwheel, et onhover, et onpaste
                    const $input = $('<input>', {
                        type: 'text',
                        class: `form-control form-control-lg text-center cla-h2-like ${prefix}-input`,
                        maxLength: '1',
                        id: `${prefix}_${uniqueTypeShort}_input_${i}`,
                        name: `${prefix}${i}`,
                        autocomplete: 'off',
                        value: value,
                        'data-min': min,
                        'data-max': max,
                    });

                    $input.on('keyup', function(event) {
                        touchCode(event.currentTarget, event, prefix ,uniqueTypeShort, (i + 1), settings.numInputs);
                    });

                    $input.on('wheel', function(event) {
                        adjustOnScroll(event, event.currentTarget, prefix, uniqueTypeShort);
                    });
                    
                    $input.hover(
                        function() { // mouseenter
                            hoverMouseEnter(this, prefix, uniqueTypeShort);
                        },
                        function() { // mouseleave
                            hoverMouseLeave(this, prefix, uniqueTypeShort);
                        }
                    );
                    
                    $input.on('paste', function(event) {
                        handlePasteEvent(this, event, uniqueTypeShort, prefix , `${prefix}_${uniqueTypeShort}_input`);
                    });
                    
                    $input.on('copy', function(event) {
                        event.preventDefault(); // Empêche le comportement par défaut
                        navigator.clipboard.writeText($(this).val());
                    });

                    $wrapperDiv.append($input);

                    // Élément texte inférieur
                    const $bottomTextDiv = $('<div>', {
                        class: `cla-hover-text bottom-text-${uniqueTypeShort}-${i}`,
                        id: `${prefix}_${uniqueTypeShort}_div_bottom_${i}`,
                        text: min
                    });
                    
                    $bottomTextDiv.hover(
                        function() { // mouseenter
                            toggleHoverEffect(this, prefix, uniqueTypeShort, true);
                        },
                        function() { // mouseleave
                            toggleHoverEffect(this, prefix, uniqueTypeShort, false);
                        }
                    );
                    
                    $bottomTextDiv.on('click', function(event) {
                        handleTextDivClick(this, prefix,uniqueTypeShort);
                    });
                    
                    $wrapperDiv.append($bottomTextDiv);
                    $inputContainer.append($wrapperDiv);
                    
                }

                $container.append($inputContainer);
                
                for (let i = 1; i <= settings.numInputs; i++) {
                    const prefix = 'digit';
                    // Utiliser les valeurs min et max spécifiques si fournies
                    const min = settings.minValues[i - 1] !== undefined ? Math.max(digitMin, Math.min(settings.minValues[i - 1], digitMax)) : digitMin;
                    const max = settings.maxValues[i - 1] !== undefined ? Math.max(digitMin, Math.min(settings.maxValues[i - 1], digitMax)) : digitMax;
                    let value = settings.values[i - 1] !== undefined ? settings.values[i - 1] : settings.defaultValue;

                    // Borne la valeur entre min et max
                    value = Math.max(min, Math.min(value, max));
                    updateFinalValue($("#"+prefix+"_" + uniqueTypeShort + "_input_" + i), value, prefix, uniqueTypeShort , false);
                }
            }
            else if (settings.type === "text" )
            {
                const prefix = 'list';
                    
                // Création du wrapper
                const $wrapperDiv = $('<div>', {
                    class: 'text-center cla-input-wrapper',
                    css: { position: 'relative' }
                });

                // Élément texte supérieur
                const $topTextDiv = $('<div>', {
                    class: `cla-hover-text top-text-${uniqueTypeShort}-${prefix}`,
                    id: `${prefix}_${uniqueTypeShort}_div_top`,
                    text: "..."
                });
                
                $topTextDiv.hover(
                    function() { // mouseenter
                        toggleHoverEffect(this, prefix, uniqueTypeShort, true);
                    },
                    function() { // mouseleave
                        toggleHoverEffect(this, prefix, uniqueTypeShort, false);
                    }
                );
                
                $topTextDiv.on('click', function(event) {
                    handleTextDivClick(this, prefix, uniqueTypeShort);
                });
                
                $wrapperDiv.append($topTextDiv);

                // Création de l'input avec onkeyup, onwheel, et onhover, et onpaste
                const $input = $('<input>', {
                    type: 'text',
                    class: `form-control form-control-lg text-center cla-h2-like ${prefix}-input`,
                    id: `${prefix}_${uniqueTypeShort}_input`,
                    name: `${prefix}`,
                    autocomplete: 'off',
                    value: settings.values[settings.defaultValue],
                    disabled: 'disabled',
                    'data-min': 0,
                    'data-max': settings.values.length - 1,
                });

                $input.on('wheel', function(event) {
                    adjustOnScroll(event, event.currentTarget, prefix, uniqueTypeShort);
                });
                
                $input.hover(
                    function() { // mouseenter
                        hoverMouseEnter(this, prefix, uniqueTypeShort);
                    },
                    function() { // mouseleave
                        hoverMouseLeave(this, prefix, uniqueTypeShort);
                    }
                );
                   
                $input.on('copy', function(event) {
                    event.preventDefault(); // Empêche le comportement par défaut
                    navigator.clipboard.writeText($(this).val());
                });

                $wrapperDiv.append($input);

                // Élément texte inférieur
                const $bottomTextDiv = $('<div>', {
                    class: `cla-hover-text bottom-text-${uniqueTypeShort}-${prefix}`,
                    id: `${prefix}_${uniqueTypeShort}_div_bottom`,
                    text: "..."
                });
                
                $bottomTextDiv.hover(
                    function() { // mouseenter
                        toggleHoverEffect(this, prefix, uniqueTypeShort, true);
                    },
                    function() { // mouseleave
                        toggleHoverEffect(this, prefix, uniqueTypeShort, false);
                    }
                );
                
                $bottomTextDiv.on('click', function(event) {
                    handleTextDivClick(this, prefix,uniqueTypeShort);
                });
                
                $wrapperDiv.append($bottomTextDiv);
                $inputContainer.append($wrapperDiv);

                $container.append($inputContainer);
            } 
            else
            {
                const prefix = 'not';
                   // Création du wrapper
                const $wrapperDiv = $('<div>', {
                    class: 'text-center cla-input-wrapper',
                    css: { position: 'relative' }
                });

                const $input = $('<input>', {
                    type: 'text',
                    class: `form-control form-control-lg text-center cla-h2-like ${prefix}-input`,
                    id: `${prefix}_${uniqueTypeShort}_input`,
                    name: `${prefix}${prefix}`,
                    value: 'Not Implemented',
                    disabled: 'disabled'
                });

                $wrapperDiv.append($input);
                $inputContainer.append($wrapperDiv);

                $container.append($inputContainer);
            }
        });
        
        // Méthode pour récupérer la valeur complète
        this.getCompleteValue = function() {
            return currentValue;
        };
        
        // Méthode pour récupérer un chiffre spécifique à un index donné
        this.getDigitAt = function(index) {
            if (settings.type === "integer" || settings.type === "float" ) 
            { 
                // Vérifie si l'index est dans la plage de currentValue
                if (index >= 0 && index < currentDigit.length) {
                    const digit = currentDigit[index];
                    return parseInt(digit, 10); // Ignorer le point décimal
                } else {
                    throw new Error("L'index est en dehors de la plage.");
                }
            }
            else{
                throw new Error("Not implemented");
            }
        };

       // Fonction pour définir la valeur complète en répartissant les caractères dans les inputs
        this.setCompleteValue = function(value,onchange = false) 
        { 
            if (settings.type === "integer" || settings.type === "float" ) 
            { 
                // Vérifie si la valeur est un nombre flottant
                const isFloat = /^[-+]?\d+\.\d+$/.test(value);
                // Vérifie si la valeur est un entier
                const isInteger = /^[-+]?\d+$/.test(value);
                // Vérifie si la valeur est du texte non numérique
                const isText = isNaN(value);
            
                if ( (isFloat || isInteger) && !isText )
                {
                    if( settings.totalMin !== undefined && settings.totalMin != null && value <= settings.totalMin) value = settings.totalMin;
                    if( settings.totalMax !== undefined && settings.totalMax != null && value >= settings.totalMax) value = settings.totalMax;
                    
                    currentDigit.fill(0);

                    if (settings.type === 'float') // Sépare la partie entière et décimale
                    {                    
                        fillFloatDigits(value);
                    }
                    else if (settings.type === 'integer')
                    {
                        fillIntegerDigits(value);
                    }
                    currentValue = digitsArrayToNumber(currentDigit,(settings.type === 'float'),settings.decimalPosition);
                    
                    // Appel de onValueChange avec $input et newValue
                    if (onchange == true && typeof settings.onValueChange === 'function') {
                        settings.onValueChange(null, currentValue);
                    }
                }
            } else if (settings.type === "text" )
            {
                let index = findPosition(settings.values,value);
                if (index != -1)
                {
                    $("#list_" + uniqueTypeShort + "_input").val(value);
                    currentValue = value;
                    // Appel de onValueChange avec $input et newValue
                    if (onchange == true && typeof settings.onValueChange === 'function') {
                        settings.onValueChange(null, currentValue);
                    }
                }
                else
                {
                    throw new Error("Le texte n'est pas reconnu.");
                }
            } 
            else
            {
                throw new Error("Not implemented");
            }
        };

        return this;
    };

}(jQuery));

