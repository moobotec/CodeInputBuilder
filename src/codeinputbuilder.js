/*
Author: Daumand David
Website: https://www.timecaps.io
Contact: daumanddavid@gmail.com
File: Code Input Builder Js File
*/

(function ($) {
        
   $.fn.codeInputBuilder = function (options) {
        // Options par défaut
        const settings = $.extend({
            type: 'integer', // integer ou float
            numInputs: 1,
            minValues: [],
            maxValues: [],
            values: [],
            defaultvalue: 0,
            gap: '10px', // Espace entre les inputs
            allowSign: false, // Nouveau paramètre pour autoriser le signe
            defaultSign: '+', // Signe par défaut (peut être "+" ou "-")
            decimalPosition : 1,
            separator : '.',
            totalMax: null, // Valeur maximale totale
            totalMin: null, // Valeur minimale totale
            onValueChange: null // Fonction de surcharge pour les changements de valeur
        }, options);

        let gIdHover = -1;
        let digitMin = 0;
        let digitMax = 9;
        let currentDigitSign = (settings.allowSign) ?  settings.defaultSign : null;
        let currentDigit = new Array(settings.numInputs);
        let currentValue = ''; // Variable pour stocker la valeur complète des inputs
        let limitDigitMin = ( settings.totalMin !== undefined && settings.totalMin != null ) ? numberToDigitsArray(settings.totalMin) : null;
        let limitDigitMax = ( settings.totalMax !== undefined && settings.totalMax != null ) ? numberToDigitsArray(settings.totalMax) : null;
        let uniqueTypeShort = settings.type + '_' + uuidShort();
        
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
           
            currentValue = finalValue;
            
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

        function applyCode(inputElement,codeTouche,event,prefix,type,pos,max,maxValue) 
        {
            let valueMin =  parseInt($(inputElement).attr('data-min'));
            
            // Vérifie si Ctrl+C est pressé, si oui, ignore le reste de la fonction
            if ((event.ctrlKey && (event.key === 'c' || codeTouche === 67 )) 
                    ||  (event.ctrlKey && (event.key === 'v' || codeTouche === 86 ) )
                    ||  (!event.ctrlKey && codeTouche === 17) ) {
                return; // Quitte la fonction pour éviter de réinitialiser l'input
            }
            
            if ((codeTouche >= 48 && codeTouche <= (48 + maxValue)) || // Chiffres (0-9)
                (codeTouche >= 96 && codeTouche <= (96 + maxValue)) || // Pavé numerique (0-9)
                codeTouche === 8 || // Touche "Retour arrière" (Backspace)
                codeTouche === 9 || // Touche "Tabulation"
                codeTouche === 46) { // Touche "Supprimer" (Delete)
            
                if (codeTouche === 8)
                {
                    setValueInput(inputElement,valueMin,prefix,type);
                    if ((pos-2) == 0) pos = max+2;
                    $("#"+prefix+"_"+type+"_input_"+(pos-2)).focus();
                }
                else if (codeTouche === 46)
                {
                    setValueInput(inputElement,valueMin,prefix,type);
                    if ((pos+1) == max+2) pos = 1;
                    $("#"+prefix+"_"+type+"_input_"+pos).focus();
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
                        setValueInput(inputElement,event.key,prefix,type);
                        $("#"+prefix+"_"+type+"_input_"+pos).focus();
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

        function touchCode(inputElement,event,prefix,type,pos,max,maxValue) 
        {
            // Récupérer le code de la touche appuyée
            var codeTouche = event.keyCode || event.which;
            if (codeTouche != 16) // Touche "Maj enfoncée"
            {
                applyCode(inputElement,codeTouche,event,prefix,type,pos,max,maxValue);
            }
        }

        /* Gestionnaire d'appui sur les touche du clavier pour les touche + et - du clavier */
        function touchSign(inputElement, event, prefix, type) 
        {
            var codeTouche = event.keyCode || event.which;
            if (codeTouche != 16) // Touche "Maj enfoncée"
            {
                applySign(inputElement,codeTouche,event,prefix,type);
            }
        }

        /* Gestionnaire de modification de la mollette de la souris */
        function adjustOnScroll(event, inputElement,prefix,type) 
        {
            event.preventDefault();
             // Récupération du delta en utilisant `originalEvent.deltaY` avec fallback sur `wheelDelta`
            const delta = event.originalEvent.deltaY !== undefined 
                ? event.originalEvent.deltaY 
                : (event.originalEvent.wheelDelta ? -event.originalEvent.wheelDelta : 0);

            // Définir un seuil pour rendre le défilement moins sensible
            const threshold = 50; // La valeur du seuil peut être ajustée en fonction de la sensibilité désirée

            if (Math.abs(delta) < threshold) {
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
        }

        function hoverMouseLeave(inputElement,prefix,type) 
        {
            if (prefix == "digit")
            {
                let id = $(inputElement).attr('id').replace(prefix+'_'+type+'_input_', '');
                updatePeripheralDigit(type,id, false, false, 0 ,0);
            }
            else if (prefix == "sign")
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
            else if ( prefix == "sign" )
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
                updateFinalValue($("#"+prefix+"_" + type + "_input_"),$(element).html(),prefix, type);
                updatePeripheralDigit(type,'sign', false, false, 0 ,0);
            }
        }

        function handlePasteEvent(element, event, type, basename) {
            event.preventDefault();
            let pasteText = event.originalEvent.clipboardData.getData('text');
            if (pasteText.length > 1) pasteText = pasteText.substring(0, 1); // Limiter à un caractère
            let codeTouche = pasteText.charCodeAt(0);
            event.key = pasteText;
            
            let id = $(element).attr('id').replace(basename + '_', '');
            let valueMax = parseInt($(element).attr('data-max'));

            applyCode(element, codeTouche, event, type, parseInt(id) + 1, settings.numInputs, valueMax);
        }


        // Création des inputs dans chaque élément sélectionné
        this.each(function () {
            const $container = $(this);

            // Création d'un div parent avec la classe `cla-input-container` pour appliquer le `gap`
            const $inputContainer = $('<div>', {
                class: 'cla-input-container',
                css: { display: 'flex', gap: settings.gap } // Appliquer le gap défini dans les settings
            });

            if (settings.allowSign) {
                
                const prefix = "sign";
                
                const value = settings.defaultSign;

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
                    value: value
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
                    handlePasteEvent(this, event, uniqueTypeShort, `${prefix}_${uniqueTypeShort}_input`);
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
                let value = settings.values[i - 1] !== undefined ? settings.values[i - 1] : settings.defaultvalue;

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
                    touchCode(event.currentTarget, event, prefix ,uniqueTypeShort, (i + 1), settings.numInputs, max);
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
                    handlePasteEvent(this, event, uniqueTypeShort, `${prefix}_${uniqueTypeShort}_input`);
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
                let value = settings.values[i - 1] !== undefined ? settings.values[i - 1] : settings.defaultvalue;

                // Borne la valeur entre min et max
                value = Math.max(min, Math.min(value, max));
                updateFinalValue($("#"+prefix+"_" + uniqueTypeShort + "_input_" + i), value, prefix, uniqueTypeShort , false);
            }

        });
        
        // Méthode pour récupérer la valeur complète
        this.getCompleteValue = function() {
            return currentValue;
        };
        
        // Méthode pour récupérer un chiffre spécifique à un index donné
        this.getDigitAt = function(index) {
            // Vérifie si l'index est dans la plage de currentValue
            if (index >= 0 && index < currentDigit.length) {
                const digit = currentDigit[index];
                return parseInt(digit, 10); // Ignorer le point décimal
            } else {
                throw new Error("L'index est en dehors de la plage.");
            }
        };

       // Fonction pour définir la valeur complète en répartissant les caractères dans les inputs
        this.setCompleteValue = function(value) 
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
                
                if (settings.type === 'float') // Sépare la partie entière et décimale
                {                    
                   fillFloatDigits(value);
                }
                else if (settings.type === 'integer')
                {
                    fillIntegerDigits(value);
                }
                currentValue = digitsArrayToNumber(currentDigit,(settings.type === 'float'),settings.decimalPosition);
            }
        };

        return this;
    };

}(jQuery));

