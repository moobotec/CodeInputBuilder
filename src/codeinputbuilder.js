/*
Plugin: Code Input Builder
Version: 0.0.16
Author: Daumand David
Website: https://www.timecaps.io
Contact: daumanddavid@gmail.com
Description: Code Input Builder est un plugin jQuery permettant de générer des champs d'input configurables pour la saisie de valeurs numériques (entiers, flottants), de textes, ou de valeurs dans des systèmes spécifiques (binaire, hexadécimal). Il offre des options avancées de personnalisation incluant la gestion des signes, des positions décimales, des limites de valeurs, et des callbacks pour la gestion des changements de valeur.

Fonctionnalités :
- Configuration flexible du type de valeur (entier, flottant, texte, binaire, hexadécimal, lettre)
- Définition des valeurs initiales, des limites minimales et maximales pour chaque input
- Saisie facilitée avec un focus automatique et un défilement pour ajuster les valeurs
- Gestion des signes (+/-) et des séparateurs pour les décimales
- Callback `onValueChange` pour réagir aux changements de valeurs

Options disponibles:
    - `type`: (string) Définit le type de valeur acceptée par les inputs.
        * Valeurs possibles : 'integer', 'float', 'text', 'binary', 'hexadecimal', 'letter'.
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
        
    - `isDisabled`: (boolean) Permet de désactiver les inputs. Si activé, les champs ne seront pas modifiables par l'utilisateur. Dans le cas d'un CodeInput de type "text" cette option n'est pas utilisable.
        * Par défaut : false.
  
    - `allowArrowKeys`: (boolean) Permet d'active la fonctionnalité de navigation via les touches `ArrowLeft`,`ArrowRight`,`ArrowUp`,`ArrowDown`
      * Par défaut : false.

Usage basique :
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

*/
'use strict';

/* istanbul ignore next */
if (typeof jQuery === 'undefined') {
  throw new Error(
    'La bibliothèque jQuery est requise pour que CodeInputBuilder fonctionne. Veuillez inclure jQuery avant de charger cette bibliothèque.'
  );
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
      gap: '10px',
      isDisabled: false,
      allowArrowKeys: false,
    };

    const settings = $.extend({}, defaultOptions, options);

    function validateType(type) {
      if (
        ![
          'integer',
          'float',
          'text',
          'binary',
          'hexadecimal',
          'letter',
        ].includes(type)
      ) {
        throw new Error(
          "Option 'type' invalide. Valeurs autorisées : 'integer', 'float', 'text','binary', 'hexadecimal', 'letter'."
        );
      }
    }

    function validateNumInputs(numInputs) {
      if (typeof numInputs !== 'number' || numInputs < 1) {
        throw new Error("Option 'numInputs' doit être un entier positif.");
      }
    }

    function validateMinValues(type, minValues, numInputs) {
      if (
        type !== 'text' &&
        Array.isArray(minValues) &&
        minValues.length > 0 &&
        minValues.length !== numInputs
      ) {
        throw new Error(
          "'minValues' doit contenir autant d'éléments que 'numInputs'."
        );
      }
    }

    function validateMaxValues(type, maxValues, numInputs) {
      if (
        type !== 'text' &&
        Array.isArray(maxValues) &&
        maxValues.length > 0 &&
        maxValues.length !== numInputs
      ) {
        throw new Error(
          "'maxValues' doit contenir autant d'éléments que 'numInputs'."
        );
      }
    }

    function validateValues(type, values, numInputs) {
      if (
        type !== 'text' &&
        Array.isArray(values) &&
        values.length > 0 &&
        values.length !== numInputs
      ) {
        throw new Error(
          "'values' doit contenir autant d'éléments que 'numInputs'."
        );
      }
    }

    function validateDecimalPosition(type, decimalPosition) {
      if (
        type === 'float' &&
        (typeof decimalPosition !== 'number' || decimalPosition < 1)
      ) {
        throw new Error(
          "Option 'decimalPosition' doit être un entier positif pour les types flottants."
        );
      }
    }

    function validateDefaultValue(defaultValue) {
      if (
        typeof defaultValue !== 'number' &&
        typeof defaultValue !== 'string'
      ) {
        throw new Error(
          "Option 'defaultValue' doit être un nombre ou une chaîne."
        );
      }
    }

    function validateTotalMin(totalMin) {
      if (totalMin !== null && typeof totalMin !== 'number') {
        throw new Error("Option 'totalMin' doit être un nombre ou null.");
      }
    }

    function validateTotalMax(totalMax) {
      if (totalMax !== null && typeof totalMax !== 'number') {
        throw new Error("Option 'totalMax' doit être un nombre ou null.");
      }
    }

    function validateOnValueChange(onValueChange) {
      if (onValueChange !== null && typeof onValueChange !== 'function') {
        throw new Error(
          "Option 'onValueChange' doit être une fonction ou null."
        );
      }
    }

    function validateAllowScroll(allowScroll) {
      if (typeof allowScroll !== 'boolean') {
        throw new Error("Option 'allowScroll' doit être un booléen.");
      }
    }

    function validateAllowSign(allowSign) {
      if (typeof allowSign !== 'boolean') {
        throw new Error("Option 'allowSign' doit être un booléen.");
      }
    }

    function validateAllowArrowKeys(allowArrowKeys) {
      if (typeof allowArrowKeys !== 'boolean') {
        throw new Error("Option 'allowArrowKeys' doit être un booléen.");
      }
    }

    function validateIsDisabled(isDisabled) {
      if (typeof isDisabled !== 'boolean') {
        throw new Error("Option 'isDisabled' doit être un booléen.");
      }
    }

    function validateAutoFocusNextInput(autoFocusNextInput) {
      if (typeof autoFocusNextInput !== 'boolean') {
        throw new Error("Option 'autoFocusNextInput' doit être un booléen.");
      }
    }

    function validateAutoFocusNextInputDirection(autoFocusNextInputDirection) {
      if (
        autoFocusNextInputDirection &&
        !['Forward', 'Backward', 'Right', 'Left'].includes(
          autoFocusNextInputDirection
        )
      ) {
        throw new Error(
          "Option 'autoFocusNextInputDirection' doit être 'Forward', 'Backward', 'Right', 'Left' ou null."
        );
      }
    }

    function validateScrollSensitivity(scrollSensitivity) {
      if (typeof scrollSensitivity !== 'number' || scrollSensitivity <= 0) {
        throw new Error(
          "Option 'scrollSensitivity' doit être un entier positif."
        );
      }
    }

    function validateRequireKeyForScroll(requireKeyForScroll) {
      if (
        requireKeyForScroll &&
        !['Control', 'Shift', 'Alt', 'Meta'].includes(requireKeyForScroll)
      ) {
        throw new Error(
          "Option 'requireKeyForScroll' doit être 'Control', 'Shift', 'Alt', 'Meta' ou null."
        );
      }
    }

    function validateDefaultSign(defaultSign) {
      if (defaultSign && !['+', '-'].includes(defaultSign)) {
        throw new Error("Option 'defaultSign' doit être '+', '-'.");
      }
    }

    function validateOptions() {
      validateType(settings.type);
      validateNumInputs(settings.numInputs);
      validateMinValues(settings.type, settings.minValues, settings.numInputs);
      validateMaxValues(settings.type, settings.maxValues, settings.numInputs);
      validateValues(settings.type, settings.values, settings.numInputs);
      validateDecimalPosition(settings.type, settings.decimalPosition);
      validateDefaultValue(settings.defaultValue);
      validateTotalMin(settings.totalMin);
      validateTotalMax(settings.totalMax);
      validateOnValueChange(settings.onValueChange);
      validateAllowScroll(settings.allowScroll);
      validateAllowSign(settings.allowSign);
      validateAllowArrowKeys(settings.allowArrowKeys);
      validateIsDisabled(settings.isDisabled);
      validateAutoFocusNextInput(settings.autoFocusNextInput);
      validateAutoFocusNextInputDirection(settings.autoFocusNextInputDirection);
      validateScrollSensitivity(settings.scrollSensitivity);
      validateRequireKeyForScroll(settings.requireKeyForScroll);
      validateDefaultSign(settings.defaultSign);
    }

    validateOptions();

    return settings;
  }

  function truncateFromEnd(text, maxLength) {
    if (text.length > maxLength) {
      return text.slice(-maxLength); // Tronque le texte et conserve les derniers caractères
    }
    return text; // Retourne le texte original s'il est plus court que maxLength
  }

  function findPosition(array, element) {
    return array.indexOf(element);
  }

  function uuidShort() {
    return 'xxxxxxxx'.replace(/x/g, function () {
      const r = (Math.random() * 16) | 0;
      return r.toString(16);
    });
  }

  function getValueLimits(settings) {
    const valueMin = valueDigitMin(settings);
    const valueMax = valueDigitMax(settings);
    return { valueMin, valueMax };
  }

  function getValueInputLimits(currentValue, inputElement, settings) {
    let valueMin = 0;
    let valueMax = 0;
    if (isAllowSign(settings)) {
      valueMax =
        currentValue < 0
          ? convertIntegerBase10($(inputElement).attr('data-min'))
          : convertIntegerBase10($(inputElement).attr('data-max'));
    } else {
      valueMin = convertIntegerBase10($(inputElement).attr('data-min'));
      valueMax = convertIntegerBase10($(inputElement).attr('data-max'));
    }

    return { valueMin, valueMax };
  }

  function calculateNextIndex(id, settings) {
    let index = id;

    if (
      settings.autoFocusNextInput &&
      settings.autoFocusNextInputDirection !== null
    ) {
      switch (settings.autoFocusNextInputDirection) {
        case 'Forward':
        case 'Right':
          index += 1;
          break;
        case 'Backward':
        case 'Left':
          index -= 1;
          break;
        default:
          console.warn(
            `Direction "${settings.autoFocusNextInputDirection}" non reconnue. L'index reste inchangé.`
          );
      }
    }

    return index;
  }

  const charEscapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    ' ': 'Espace', // espace insécable
    '©': '&copy;',
    '®': '&reg;',
    '™': '&trade;',
    '€': '&euro;',
    '¢': '&cent;',
    '£': '&pound;',
    '¥': '&yen;',
  };

  // Map inversée pour les caractères échappés vers leurs caractères originaux
  const escapeToCharMap = Object.fromEntries(
    Object.entries(charEscapeMap).map(([char, escaped]) => [escaped, char])
  );

  // Fonction pour échapper un caractère
  function escapeChar(char) {
    return charEscapeMap[char] || char;
  }

  // Fonction pour convertir un caractère échappé en caractère normal
  function unescapeChar(escapedChar) {
    return escapeToCharMap[escapedChar] || escapedChar;
  }

  // Fonction pour échapper les caractères spéciaux dans une chaîne
  function escapeHtml(text) {
    return text.replace(/[&<>"' ©®™€¢£¥]/g, (m) => escapeChar(m));
  }

  // Fonction pour convertir une chaîne échappée en caractères normaux
  function convertFromEscapedChar(escapedStr) {
    switch (escapedStr) {
      case '\\0x00':
        return convertChar(0);
      case '\\0x0b':
        return convertChar(11);
      case '\\t':
        return '\t'; // Tabulation
      case '\\n':
        return '\n'; // Nouvelle ligne
      case '\\r':
        return '\r'; // Retour chariot
      case '\\b':
        return '\b'; // Retour arrière
      case '\\f':
        return '\f'; // Saut de page
      default:
        return unescapeChar(escapedStr); // Utilise la fonction unescapeChar pour le reste
    }
  }

  // Fonction pour convertir un caractère en version échappée si nécessaire
  function convertToEscapedChar(char) {
    const charCode = convertLetter(char);

    switch (charCode) {
      case 9:
        return '\\t'; // Tabulation
      case 10:
        return '\\n'; // Nouvelle ligne
      case 13:
        return '\\r'; // Retour chariot
      case 8:
        return '\\b'; // Retour arrière
      case 12:
        return '\\f'; // Saut de page
      default:
        return char; // Utilise la map pour les caractères spéciaux
    }
  }

  function convertFloat(value) {
    return parseFloat(value);
  }
  function convertIntegerBase10(value) {
    return parseInt(value, 10);
  }
  function convertIntegerBase16(value) {
    return parseInt(value, 16);
  }
  function convertBinary(value) {
    return parseInt(value, 2);
  }
  function convertLetter(value) {
    return value.charCodeAt(0);
  }
  function convertChar(value) {
    return String.fromCharCode(value);
  }

  function convertHexadecimalToLetter(value) {
    if (value >= 0 && value <= 9) {
      return convertChar(0x30 + value); // '0' à '9'
    }
    // Si la valeur est entre 10 et 15, renvoie le caractère alphabétique correspondant
    else if (value >= 10 && value <= 15) {
      return convertChar(0x61 + (value - 10)); // 'a' à 'f'
    }
    // Si le caractère n'est pas dans la plage autorisée, retourne null ou un message d'erreur
    return null;
  }

  function convertLetterToHexadecimal(char) {
    // Vérifie si le caractère est entre '0' et '9'
    if (char >= '0' && char <= '9') {
      return convertLetter(char) - 0x30;
    }
    // Vérifie si le caractère est entre 'a' et 'f'
    else if (char >= 'a' && char <= 'f') {
      return convertLetter(char) - 0x61 + 10;
    }
    // Si le caractère n'est pas dans la plage autorisée, retourne null ou un message d'erreur
    return null;
  }

  function validateInteger(value) {
    return Number(value) === value && Number.isInteger(value);
  }

  // Vérifie si la valeur est un nombre valide en fonction du type
  const isValidIntegerOrFloat = (val) => /^[-+]?\d+(\.\d+)?$/.test(val);
  const isValidBinary = (val) => /^0b[01]+$/.test(val) || /^[01]+$/.test(val);
  const isValidHexadecimal = (val) =>
    /^0x[0-9a-fA-F]+$/.test(val) || /^[0-9a-fA-F]+$/.test(val);

  const typeHandlers = {
    integer: {
      convert: (value) => convertIntegerBase10(value),
      validate: (value) =>
        typeof value === 'number' && !isNaN(value) && validateInteger(value),
      display: (value) => value,
      isForcedAllowSign: false,
      isForcedAllowArrowKeys: false,
      isAdjustToBounds: true,
      isGetDigit: true,
      isSetDigit: true,
      min: 0x00,
      max: 0x09,
      isForcedDisabled: false,
      isValidKey: (codeTouche, valueMax) =>
        (codeTouche >= 48 && codeTouche <= 48 + valueMax) || // Chiffres (0-9)
        (codeTouche >= 96 && codeTouche <= 96 + valueMax), // Pavé numérique (0-9)
    },
    float: {
      convert: (value) => convertFloat(value),
      validate: null,
      display: (value) => value,
      isForcedAllowSign: false,
      isForcedAllowArrowKeys: false,
      isAdjustToBounds: true,
      isGetDigit: true,
      isSetDigit: true,
      min: 0x00,
      max: 0x09,
      isForcedDisabled: false,
      isValidKey: (codeTouche, valueMax) =>
        (codeTouche >= 48 && codeTouche <= 48 + valueMax) || // Chiffres (0-9)
        (codeTouche >= 96 && codeTouche <= 96 + valueMax), // Pavé numérique (0-9)
    },
    binary: {
      convert: (value) => convertBinary(value),
      validate: null,
      display: (value) => value,
      isForcedAllowSign: false,
      isForcedAllowArrowKeys: false,
      isAdjustToBounds: false,
      isGetDigit: true,
      isSetDigit: true,
      min: 0x00,
      max: 0x01,
      isForcedDisabled: false,
      isValidKey: (codeTouche) =>
        codeTouche === 48 ||
        codeTouche === 49 || // Chiffres 0 et 1
        codeTouche === 96 ||
        codeTouche === 97, // Pavé numérique 0 et 1
    },
    hexadecimal: {
      convert: (value) => convertIntegerBase16(value),
      validate: (value, settings) =>
        settings.type !== 'letter' &&
        typeof value === 'string' &&
        isValidHexadecimal(value),
      display: (value) => convertHexadecimalToLetter(value),
      isForcedAllowSign: false,
      isForcedAllowArrowKeys: false,
      isAdjustToBounds: false,
      isGetDigit: true,
      isSetDigit: true,
      min: 0x00,
      max: 0x0f,
      isForcedDisabled: false,
      isValidKey: (codeTouche) =>
        (codeTouche >= 48 && codeTouche <= 57) || // Chiffres (0-9)
        (codeTouche >= 65 && codeTouche <= 70) || // Lettres A-F
        (codeTouche >= 97 && codeTouche <= 102) || // Lettres a-f
        (codeTouche >= 96 && codeTouche <= 105), // Pavé numérique (0-9)
    },
    letter: {
      convert: (value) => convertLetter(value),
      validate: () => false,
      display: (value) => convertChar(value),
      isForcedAllowSign: false,
      isForcedAllowArrowKeys: false,
      isAdjustToBounds: false,
      isGetDigit: true,
      isSetDigit: true,
      min: 0x00,
      max: 0xff,
      isForcedDisabled: false,
      isValidKey: (codeTouche, valueMax, key, allowArrowKeys) => {
        // Exclut Ctrl, Shift, Alt, Windows (Meta), et Menu Contextuel
        const invalidCodes = [16, 17, 18, 91, 93];
        if (invalidCodes.includes(codeTouche)) {
          return false;
        }
        const arrowKeys = ['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'];
        return (
          !invalidCodes.includes(codeTouche) &&
          (!allowArrowKeys || !arrowKeys.includes(key))
        );
      },
    },
    text: {
      convert: null,
      validate: () => false,
      display: null,
      isForcedAllowSign: false,
      isForcedAllowArrowKeys: false,
      isAdjustToBounds: false,
      isGetDigit: false,
      isSetDigit: false,
      min: null,
      max: null,
      isForcedDisabled: true,
      isValidKey: null,
    },
  };

  function isKeyAllowed(codeTouche, key, valueMax, type, allowArrowKeys) {
    // Utilisation de l'opérateur de chaînage optionnel pour vérifier les propriétés
    return (
      typeHandlers[type]?.isValidKey?.(
        codeTouche,
        valueMax,
        key,
        allowArrowKeys
      ) || false
    );
  }

  function convertDigitByType(value, type) {
    return typeHandlers[type]?.convert?.(value) ?? null;
  }

  function valueDigitMin(settings) {
    return typeHandlers[settings.type]?.min ?? null;
  }

  function valueDigitMax(settings) {
    return typeHandlers[settings.type]?.max ?? null;
  }

  function determineType(value, settings) {
    // Trouve le premier type qui valide la valeur
    for (const [type, handler] of Object.entries(typeHandlers)) {
      if (handler?.validate?.(value, settings)) {
        return type;
      }
    }
    // Retourne "letter" si aucun type valide n'est trouvé
    return 'letter';
  }

  function makeValueElement(value, settings) {
    return typeHandlers[settings.type]?.display?.(value) ?? null;
  }

  function isAdjustToBounds(settings) {
    return typeHandlers[settings.type]?.isAdjustToBounds ?? false;
  }

  function isAllowSign(settings) {
    return (
      (typeHandlers[settings.type]?.isForcedAllowSign ?? false) ||
      settings.allowSign
    );
  }

  function isAllowArrowKeys(settings) {
    return (
      (typeHandlers[settings.type]?.isForcedAllowArrowKeys ?? false) ||
      settings.allowArrowKeys
    );
  }

  function isGetDigit(settings) {
    return typeHandlers[settings.type]?.isGetDigit ?? false;
  }

  function isSetDigit(settings) {
    return typeHandlers[settings.type]?.isSetDigit ?? false;
  }

  function isDisabled(settings) {
    return (
      (typeHandlers[settings.type]?.isForcedDisabled ?? false) ||
      settings.isDisabled
    );
  }

  function defaultSign(settings) {
    return isAllowSign(settings) ? settings.defaultSign : null;
  }

  function getValueByType(index, valueArray, settings) {
    const value = valueArray[index];
    // Vérifie si la valeur existe et la détermine le type
    if (value === undefined) return null;
    const type = determineType(value, settings);
    // prettier-ignore
    return convertDigitByType(value, type);
  }

  function maxValue(index, settings) {
    return getValueByType(index, settings.maxValues, settings);
  }

  function minValue(index, settings) {
    return getValueByType(index, settings.minValues, settings);
  }

  function defaultValue(index, settings) {
    return getValueByType(index, settings.values, settings);
  }

  // Fonction interne pour effectuer le clamp
  function clampCore(value, min, max) {
    return Math.max(min, Math.min(value, max));
  }

  function setElement(type, object, value, settings) {
    let val = makeValueElement(value, settings);
    if (settings.type == 'letter') val = convertToEscapedChar(val);
    // Utiliser des fonctions spécifiques pour chaque type d'élément
    if (type === 'input') {
      setInputValue(object, val);
    } else if (type === 'div') {
      setDivValue(object, val, settings);
    }
  }

  // Gère la valeur pour un élément input
  function setInputValue(object, val) {
    $(object).val(val);
  }

  // Gère la valeur pour un élément div
  function setDivValue(object, val, settings) {
    if (settings.type === 'letter') {
      val = handleSpecialLetters(val);
      $(object).html(escapeHtml(val));
    } else {
      $(object).html(val);
    }
  }

  // Gestion des caractères spéciaux pour le type lettre
  function handleSpecialLetters(val) {
    if (convertLetter(val) === 0) return '\\0x00';
    if (convertLetter(val) === 11) return '\\0x0b';
    return val;
  }

  function getElement(type, object, settings) {
    let value = type === 'input' ? $(object).val() : $(object).html();
    if (settings.type === 'letter') value = convertFromEscapedChar(value);
    return convertDigitByType(value, settings.type);
  }

  function calculateAdjacentValues(value) {
    const currentValue = convertIntegerBase10(value);
    const valueTop = currentValue - 1;
    const valueBottom = currentValue + 1;
    return { valueTop, valueBottom };
  }

  function getValidLimitDigit(limitDigit, id) {
    // Vérifie si l'index est valide et si la valeur correspond à un nombre
    if (
      Array.isArray(limitDigit) &&
      limitDigit[id - 1] !== undefined &&
      typeof limitDigit[id - 1] === 'number'
    ) {
      return convertIntegerBase10(limitDigit[id - 1]); // Retourne la valeur valide
    }
    return 0; // Retourne la valeur par défaut si invalide
  }

  function adjustToBounds(
    value,
    min,
    max,
    othervalue = null,
    othervaluemin = null,
    othervaluemax = null
  ) {
    if (
      min !== undefined &&
      min !== null &&
      typeof min === 'number' &&
      value <= min
    )
      return othervaluemin != null ? othervaluemin : min;
    if (
      max !== undefined &&
      max !== null &&
      typeof max === 'number' &&
      value >= max
    )
      return othervaluemax != null ? othervaluemax : max;
    return othervalue != null ? othervalue : value;
  }

  $.fn.codeInputBuilder = function (options) {
    // Options par défaut
    const settings = initCodeInputBuilderOptions(options);

    let gIdHover = null;

    let currentValues = {
      value: '',
      digits: new Array(settings.numInputs).fill(0), // Tableau pour n digits
      sign: defaultSign(settings), // Valeur pour sign
      list: '',
      limitDigitMin: null,
      limitDigitMax: null,
      limitMin: null,
      limitMax: null,
      totalMin: null,
      totalMax: null,
    };

    initLimitValue(currentValues, settings);
    initTotalValue(currentValues, settings);

    let uniqueTypeShort = settings.type + '_' + uuidShort();

    function initTotalValue(currentValues, settings) {
      const signMultiplier = isAllowSign(settings) ? -1 : 1;

      // prettier-ignore
      let totalMin =
        settings.totalMin !== undefined && settings.totalMin != null
          ? settings.totalMin
          : digitsArrayToNumber(
            settings.minValues,
            settings.type === 'float',
            settings.decimalPosition
          ) * signMultiplier;

      // prettier-ignore
      let totalMax =
        settings.totalMax !== undefined && settings.totalMax != null
          ? settings.totalMax
          : digitsArrayToNumber(
            settings.maxValues,
            settings.type === 'float',
            settings.decimalPosition
          );

      currentValues.totalMin = totalMin;
      currentValues.totalMax = totalMax;
      currentValues.limitDigitMin = numberToDigitsArray(totalMin);
      currentValues.limitDigitMax = numberToDigitsArray(totalMax);
    }

    function initLimitValue(currentValues, settings) {
      if (settings.type === 'float' || settings.type === 'integer') {
        let minDigitArray = new Array();
        let maxDigitArray = new Array();

        for (let i = 0; i < settings.numInputs; i++) {
          // prettier-ignore
          const min = settings.minValues[i] !== undefined 
          ? Math.max(valueDigitMin(settings), Math.min(minValue(i,settings), valueDigitMax(settings))) 
          :  valueDigitMin(settings);

          minDigitArray.push(min);

          // prettier-ignore
          const max = settings.maxValues[i] !== undefined 
          ? Math.max(valueDigitMin(settings), Math.min(maxValue(i,settings), valueDigitMax(settings))) 
          : valueDigitMax(settings);

          maxDigitArray.push(max);
        }

        let limitMax = digitsArrayToNumber(
          maxDigitArray,
          settings.type === 'float',
          settings.decimalPosition
        );
        let limitMin = digitsArrayToNumber(
          minDigitArray,
          settings.type === 'float',
          settings.decimalPosition
        );
        if (isAllowSign(settings)) limitMin *= -1;

        currentValues.limitMax = limitMax;
        currentValues.limitMin = limitMin;
      }
    }

    function triggerValueChange($input, settings, onchange = true) {
      if (onchange && typeof settings.onValueChange === 'function') {
        const newValue = getCurrentValueByIndex('current');
        // Mise à jour de la région de notification pour les lecteurs d'écran
        if ($input != null) {
          $('#live-update').text(
            `Input ${$input.attr('id')} a changé de valeur ${newValue}`
          );
        } else {
          $('#live-update').text(`Le CodeInput a changé de valeur ${newValue}`);
        }
        // Appel du callback avec l'input et la nouvelle valeur
        settings.onValueChange($input, newValue);
      }
    }

    // Fonction pour mettre à jour les valeurs en fonction de l'index
    function updateCurrentValues(index, value) {
      if (index === 'sign') {
        currentValues.sign = value;
      } else if (index === 'list') {
        currentValues.list = value;
      } else if (index === 'current') {
        currentValues.value = value;
      } else if (index === 'fillDigits') {
        currentValues.digits.fill(value);
      } else if (!isNaN(index)) {
        // Si l'index est un nombre, on l'utilise pour mettre à jour le digit
        currentValues.digits[index] = value;
      } else {
        throw new Error('Index invalide :', index);
      }
    }

    function getCurrentValueByIndex(index) {
      if (index === 'sign') {
        return currentValues.sign;
        /*} else if (index === 'list') {
        return currentValues.list;*/
      } else if (index === 'current') {
        return currentValues.value;
      } else if (index === 'digits') {
        return currentValues.digits;
      } else if (!isNaN(index)) {
        // Si l'index est un nombre, on l'utilise pour mettre à jour le digit
        return currentValues.digits[index];
      }
      return null;
    }

    function processIntegerParts(value) {
      let integer = value; // Partie entière (par défaut, la valeur entière est le "value")
      let decimal = ''; // Partie décimale par défaut est une chaîne vide

      // Retourner un tableau contenant la partie entière et décimale
      return [integer, decimal];
    }

    function processFloatParts(value, settings) {
      const maxDecimalLength = settings.numInputs - settings.decimalPosition;
      let [integer, decimal = ''] = value.split('.');
      integer = integer.padStart(settings.decimalPosition, '0');
      decimal = (decimal || '')
        .slice(0, maxDecimalLength)
        .padEnd(maxDecimalLength, '0');
      return [integer, decimal];
    }

    function populateDigitInputs(digitString, type, settings) {
      const digitInputs = $(`[id^="digits_${type}_input_"]`).get();
      let index = digitInputs.length - 1;

      // Réinitialise les valeurs des inputs à zéro
      digitInputs.forEach((input) => setElement('input', input, 0, settings));

      // Parcourt les chiffres et les assigne aux inputs
      for (let digit of digitString.split('').reverse()) {
        const { value } = getAdjustedValueSettings(
          index,
          settings,
          convertDigitByType(digit, settings.type)
        );
        setElement('input', digitInputs[index], value, settings);
        updateCurrentValues(index, value);
        index--;
        if (index < 0) break;
      }
    }

    function adjustToBoundsByAllDigit(
      number,
      limitDigitMin,
      limitDigitMax,
      settings
    ) {
      // Détermine le signe du nombre et les limites correspondantes
      const sign = number > 0 ? '+' : '-';
      const limitDigit =
        number > 0
          ? numberToDigitsArray(limitDigitMax)
          : numberToDigitsArray(limitDigitMin);

      const decimalPosition =
        settings.type === 'float' && settings.decimalPosition
          ? settings.decimalPosition
          : 0;

      // Séparation des parties entière et décimale
      let [integer, decimal] =
        settings.type === 'float'
          ? processFloatParts(Math.abs(number).toString(), settings)
          : processIntegerParts(Math.abs(number).toString());

      // Traitement des parties entière et décimale
      const adjustedInteger = adjustDigits(
        integer,
        limitDigit,
        limitDigit.length - decimalPosition - 1
      );
      const adjustedDecimal = adjustDigits(
        decimal,
        limitDigit,
        decimalPosition
      );

      // Fusionne les parties entière et décimale, puis convertit en nombre
      const adjustedDigits = adjustedInteger.concat(adjustedDecimal);
      let baseValue = digitsArrayToNumber(
        adjustedDigits,
        settings.type === 'float',
        settings.decimalPosition
      );

      if (sign === '-') baseValue *= -1;

      return baseValue;
    }

    // Fonction auxiliaire pour ajuster les digits
    function adjustDigits(part, limitDigit, startIndex) {
      const adjustedPart = [];
      const partArray = part.split('').reverse();

      partArray.forEach((digit, index) => {
        const limitIndex = startIndex - index;
        adjustedPart.unshift(
          digit > limitDigit[limitIndex]
            ? limitDigit[limitIndex].toString()
            : digit
        );
      });

      return adjustedPart;
    }

    function fillDigits(number, type) {
      // Vérifie si la valeur `number` est valide pour les types pris en charge
      if (['float', 'integer'].includes(settings.type) && isNaN(number)) return;

      let integerPart, decimalPart;
      let baseValue = number;
      let numericValue = number;
      // Ajuste la valeur en fonction des limites si nécessaire
      if (isAdjustToBounds(settings)) {
        baseValue = adjustToBounds(
          number,
          currentValues.totalMin,
          currentValues.totalMax
        );

        baseValue = adjustToBoundsByAllDigit(
          baseValue,
          currentValues.limitMin,
          currentValues.limitMax,
          settings
        );
        numericValue = Math.abs(baseValue).toString();
      }

      // Gère le signe si `allowSign` est activé
      if (isAllowSign(settings)) {
        $(`[id^="sign_${type}_input"]`).val(baseValue < 0 ? '-' : '+');
      }

      // Traite les parties entière et décimale selon le type défini
      switch (settings.type) {
        case 'float':
          [integerPart, decimalPart] = processFloatParts(
            numericValue,
            settings
          );
          break;
        case 'integer':
        case 'binary':
        case 'hexadecimal':
        case 'letter':
          integerPart = numericValue;
          decimalPart = '';
          break;
        default:
          throw new Error('Type non supporté dans la fonction fillDigits.');
      }

      // Remplit les inputs avec les parties entière et décimale combinées
      populateDigitInputs(integerPart + decimalPart, type, settings);
    }

    function computeValueFromInputs(type) {
      let numberString = computeDigitToValue(type);
      if (settings.type === 'float' || settings.type === 'integer') {
        numberString = addSignToValue(numberString, type);
        return convertDigitByType(numberString, settings.type);
      }
      return numberString;
    }

    function computeDigitToValue(type) {
      let numberString = '';
      // Récupération des digits pour les types 'float' et 'integer'
      $('input[id^=digits_' + type + '_input]').each(function (index) {
        if (
          settings.type === 'float' ||
          settings.type === 'integer' ||
          settings.type === 'binary'
        ) {
          // Ajouter un point décimal si le type est 'float' et on atteint la position décimale
          if (settings.type === 'float' && index === settings.decimalPosition) {
            numberString += '.';
          }
          numberString += getElement('input', $(this), settings);
        } else {
          let value = $(this).val();
          if (settings.type == 'letter') value = convertFromEscapedChar(value);
          numberString += value;
        }
      });
      return numberString;
    }

    function addSignToValue(value, type) {
      if (!isAllowSign(settings)) return value; // Retourne la valeur sans modification si `allowSign` est désactivé

      // Récupère le signe (+ ou -) pour le type spécifié
      const signInput = $('input[id^=sign_' + type + '_input]');
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
      // Fonction pour mettre à jour la valeur finale et gérer les limites
      function updateNumericValue() {
        let finalValue = computeValueFromInputs(type);
        let backValue = finalValue;

        finalValue = adjustToBounds(
          finalValue,
          currentValues.totalMin,
          currentValues.totalMax,
          finalValue
        );

        finalValue = adjustToBoundsByAllDigit(
          finalValue,
          currentValues.limitMin,
          currentValues.limitMax,
          settings
        );
        // Met à jour la valeur 'current' dans currentValues
        updateCurrentValues('current', finalValue);
        // Met à jour les digits si la valeur finale a changé
        if (backValue !== getCurrentValueByIndex('current')) {
          fillDigits(getCurrentValueByIndex('current'), type);
        }
      }

      // Gestion des différents types de données
      switch (settings.type) {
        case 'integer':
        case 'float':
          updateNumericValue();
          break;

        case 'hexadecimal':
        case 'letter':
        case 'binary':
          updateCurrentValues('current', computeValueFromInputs(type));
          break;

        case 'text':
          updateCurrentValues('current', newValue);
          break;

        default:
          throw new Error('Type de données non supporté.');
      }

      // Déclenche le callback de changement de valeur si nécessaire
      triggerValueChange($input, settings, onchange);
    }

    /* Changement de l'effet de persitance des valeur 
        possible en haut et en bas */
    function updatePeripheralDigit(
      type,
      id,
      showTop,
      showBottom,
      valueTop,
      valueBottom
    ) {
      $('.cla-input-wrapper .top-text-' + type + '-' + id).css(
        'visibility',
        'hidden'
      );
      $('.cla-input-wrapper .bottom-text-' + type + '-' + id).css(
        'visibility',
        'hidden'
      );
      $('.cla-input-wrapper .top-text-' + type + '-' + id).css('opacity', '0');
      $('.cla-input-wrapper .bottom-text-' + type + '-' + id).css(
        'opacity',
        '0'
      );

      if (showTop) {
        $('.cla-input-wrapper .top-text-' + type + '-' + id).css(
          'visibility',
          'visible'
        );

        if (settings.type === 'text') {
          $('.cla-input-wrapper .top-text-' + type + '-' + id).html(valueTop);
        } else {
          setElement(
            'div',
            $('.cla-input-wrapper .top-text-' + type + '-' + id),
            valueTop,
            settings
          );
        }
        $('.cla-input-wrapper .top-text-' + type + '-' + id).css(
          'opacity',
          '1'
        );
      }

      if (showBottom) {
        $('.cla-input-wrapper .bottom-text-' + type + '-' + id).css(
          'visibility',
          'visible'
        );

        if (settings.type === 'text') {
          $('.cla-input-wrapper .bottom-text-' + type + '-' + id).html(
            valueBottom
          );
        } else {
          setElement(
            'div',
            $('.cla-input-wrapper .bottom-text-' + type + '-' + id),
            valueBottom,
            settings
          );
        }
        $('.cla-input-wrapper .bottom-text-' + type + '-' + id).css(
          'opacity',
          '1'
        );
      }
    }

    function numberToDigitsArray(number) {
      // Convertir le nombre en chaîne de caractères, supprimer le point décimal pour les floats
      const numberStr = Math.abs(number).toString().replace('.', '');

      // Initialiser le tableau de chiffres en extrayant chaque chiffre
      let digitsArray = Array.from(numberStr, (char) =>
        convertIntegerBase10(char)
      );

      // Limiter le tableau à la taille numInputs, au cas où il y aurait trop de chiffres
      return digitsArray.slice(0, settings.numInputs);
    }

    function digitsArrayToNumber(digitsArray, isFloat, decimalPosition) {
      // Convertir chaque chiffre en chaîne de caractères
      let numberStr = digitsArray.map((digit) => digit.toString()).join('');

      // Si un index de décimale est fourni, insérer le point décimal
      if (isFloat && decimalPosition < digitsArray.length) {
        numberStr =
          numberStr.slice(0, decimalPosition) +
          '.' +
          numberStr.slice(decimalPosition);
      }

      // Convertir la chaîne résultante en nombre (float ou integer selon la présence du point)
      return convertFloat(numberStr);
    }

    function calculatePeripheralDisplay(
      prefix,
      id,
      value,
      inputElement,
      hover
    ) {
      // Vérification initiale pour le hover
      if (hover !== gIdHover) {
        return {
          index: -1,
          showTop: false,
          showBottom: false,
          adjustedValueTop: 0,
          adjustedValueBottom: 0,
        };
      }

      // Dictionnaire d'actions pour chaque type de `prefix`
      const actions = {
        digits: () => {
          const valueLimits = calculateValueLimits(
            inputElement,
            id,
            getCurrentValueByIndex('current'),
            currentValues.limitDigitMin,
            currentValues.limitDigitMax
          );

          return {
            index: id,
            showTop: valueLimits.showTop,
            showBottom: valueLimits.showBottom,
            adjustedValueTop: valueLimits.valueTop,
            adjustedValueBottom: valueLimits.valueBottom,
          };
        },
        sign: () => {
          return {
            index: prefix,
            showTop: value === '-',
            showBottom: value === '+',
            adjustedValueTop: '+',
            adjustedValueBottom: '-',
          };
        },
        list: () => {
          const { valueTop, valueBottom } = calculateAdjacentValues(value);
          const valueLimits = calculateVisibilityAndAdjustLimits(
            valueTop,
            valueBottom,
            0,
            settings.values.length - 1
          );
          return {
            index: prefix,
            showTop: valueLimits.showTop,
            showBottom: valueLimits.showBottom,
            adjustedValueTop: settings.values[valueLimits.adjustedValueTop],
            adjustedValueBottom:
              settings.values[valueLimits.adjustedValueBottom],
          };
        },
      };

      // prettier-ignore
      return actions[prefix] ? actions[prefix]() : { index: -1, showTop: false, showBottom: false, adjustedValueTop: 0, adjustedValueBottom: 0 };
    }

    function setValueInput(inputElement, value, prefix, type) {
      // Déterminer l'ID pour les types `digit` et `list`
      const id =
        prefix === 'digits'
          ? $(inputElement).attr('id').replace(`${prefix}_${type}_input_`, '')
          : prefix;
      const hover = type + (prefix === 'digits' ? id : prefix);

      // Dictionnaire des actions pour définir `newValue` et mettre à jour `currentValues`
      const actions = {
        digits: () => {
          updateCurrentValues(id - 1, value);
          setElement('input', $(inputElement), value, settings);
          return value;
        },
        sign: () => {
          updateCurrentValues('sign', value);
          setElement('input', $(inputElement), value, settings);
          return value;
        },
        list: () => {
          const listValue = settings.values[value];
          updateCurrentValues('list', listValue);
          inputElement.val(listValue);
          return listValue;
        },
      };
      // Exécute l'action correspondant au `prefix` pour définir `newValue`
      const newValue = actions[prefix] ? actions[prefix]() : '';
      updateFinalValue($(inputElement), newValue, type);

      // Calcul des informations pour l'affichage périphérique
      const displayData = calculatePeripheralDisplay(
        prefix,
        id,
        value,
        inputElement,
        hover
      );

      // Mise à jour de l'affichage périphérique avec les données calculées
      updatePeripheralDigit(
        type,
        displayData.index,
        displayData.showTop,
        displayData.showBottom,
        displayData.adjustedValueTop,
        displayData.adjustedValueBottom
      );
    }

    function isSpecialKey(event, codeTouche) {
      return (
        (event.ctrlKey && (event.key === 'c' || codeTouche === 67)) ||
        (event.ctrlKey && (event.key === 'v' || codeTouche === 86)) ||
        (!event.ctrlKey && codeTouche === 17)
      );
    }

    function isControlKey(codeTouche, settings) {
      // Backspace, Tab, Delete, ArrowUp, ArrowDown,ArrowLeft, ArrowRight
      return (
        [8, 9, 46].includes(codeTouche) ||
        (isAllowArrowKeys(settings) && [37, 38, 39, 40].includes(codeTouche))
      );
    }

    function navigateInput(prefix, type, id, direction, settings) {
      // Ajuster l'id en fonction de la direction
      if (direction === 'previous') {
        id = id - 1 === 0 ? settings.numInputs : id - 1;
      } else if (direction === 'next') {
        id = id + 1 === settings.numInputs + 1 ? 1 : id + 1;
      }

      // Appliquer le focus au champ correspondant
      $(`#${prefix}_${type}_input_${id}`).focus();
    }

    function handleBackspace(
      inputElement,
      type,
      id,
      prefix,
      valueMin,
      settings
    ) {
      setValueInput(inputElement, valueMin, prefix, type);
      navigateInput(prefix, type, id, 'previous', settings);
    }

    function handleDelete(inputElement, type, id, prefix, valueMin, settings) {
      setValueInput(inputElement, valueMin, prefix, type);
      navigateInput(prefix, type, id, 'next', settings);
    }

    function handleDigitEntry(inputElement, event, type, id, prefix, settings) {
      let key = event.key;
      if (settings.type == 'hexadecimal')
        key = convertLetterToHexadecimal(event.key);
      if (settings.type == 'letter') key = convertLetter(event.key);
      setValueInput(inputElement, key, prefix, type);
      navigateInput(
        prefix,
        type,
        calculateNextIndex(id, settings),
        null,
        settings
      );
    }

    function handleArrowUp(inputElement, type, id, prefix, settings) {
      // Récupérer la valeur actuelle

      let currentValue = -1;

      if (settings.type == 'hexadecimal')
        currentValue = convertLetterToHexadecimal($(inputElement).val()) || 0;
      else if (settings.type == 'letter')
        currentValue = convertLetter($(inputElement).val()) || 0;
      else currentValue = convertIntegerBase10($(inputElement).val()) || 0;

      // Incrémenter la valeur
      currentValue -= 1;

      const { valueMin, valueMax } = getValueInputLimits(
        getCurrentValueByIndex('current'),
        inputElement,
        settings
      );

      currentValue = adjustLimits(
        currentValue,
        valueMin,
        valueMax
      ).adjustedValue;

      setValueInput(inputElement, currentValue, prefix, type);
      navigateInput(prefix, type, id, null, settings);
    }

    function handleArrowDown(inputElement, type, id, prefix, settings) {
      // Récupérer la valeur actuelle
      let currentValue = -1;

      if (settings.type == 'hexadecimal')
        currentValue = convertLetterToHexadecimal($(inputElement).val()) || 0;
      else if (settings.type == 'letter')
        currentValue = convertLetter($(inputElement).val()) || 0;
      else currentValue = convertIntegerBase10($(inputElement).val()) || 0;

      // Décrémenter la valeur
      currentValue += 1;

      const { valueMin, valueMax } = getValueInputLimits(
        getCurrentValueByIndex('current'),
        inputElement,
        settings
      );

      currentValue = adjustLimits(
        currentValue,
        valueMin,
        valueMax
      ).adjustedValue;

      setValueInput(inputElement, currentValue, prefix, type);
      navigateInput(prefix, type, id, null, settings);
    }

    function processDigitInput({
      inputElement,
      codeTouche,
      event,
      type,
      id,
      prefix,
      valueMin,
      settings,
    }) {
      if (codeTouche === 8) {
        // Handle Backspace
        handleBackspace(inputElement, type, id, prefix, valueMin, settings);
      } else if (codeTouche === 46) {
        // Handle Delete
        handleDelete(inputElement, type, id, prefix, valueMin, settings);
      } else if (codeTouche === 9) {
        // Handle Tab (actuellement vide)
      } else if (codeTouche === 37) {
        // Handle ArrowLeft
        navigateInput(prefix, type, id, 'previous', settings);
      } else if (codeTouche === 38) {
        // Handle ArrowUp
        handleArrowUp(inputElement, type, id, prefix, settings);
      } else if (codeTouche === 39) {
        // Handle ArrowRight
        navigateInput(prefix, type, id, 'next', settings);
      } else if (codeTouche === 40) {
        // Handle ArrowDown
        handleArrowDown(inputElement, type, id, prefix, settings);
      } else {
        handleDigitEntry(inputElement, event, type, id, prefix, settings);
      }
    }

    function handleDigitsInput(
      inputElement,
      codeTouche,
      event,
      type,
      prefix,
      id,
      settings
    ) {
      // Récupérer les limites pour `digit`
      const { valueMin, valueMax } = getValueLimits(settings);

      // Vérifier si la touche est valide pour un chiffre
      if (
        isKeyAllowed(
          codeTouche,
          event.key,
          valueMax,
          settings.type,
          isAllowArrowKeys(settings)
        ) ||
        isControlKey(codeTouche, settings)
      ) {
        processDigitInput({
          inputElement,
          codeTouche,
          event,
          type,
          id,
          prefix,
          valueMin,
          settings,
        });
      } else {
        // Valeur non valide pour un digit
        setValueInput(inputElement, valueMin, prefix, type);
        event.preventDefault();
      }
    }

    function handleSignInput(inputElement, codeTouche, event, type, prefix) {
      // Gestion des signes
      if (event.key === '+' || event.key === '-') {
        setValueInput(inputElement, event.key, prefix, type);
      } else if (codeTouche !== 9) {
        // Valeur non valide pour un signe
        setValueInput(inputElement, '+', prefix, type);
        event.preventDefault();
      }
    }

    function applyInput(
      inputElement,
      codeTouche,
      event,
      prefix,
      type,
      id,
      settings
    ) {
      // Gestion des touches de contrôle (Copier, Coller)
      if (isSpecialKey(event, codeTouche)) {
        event.preventDefault();
        return;
      }

      switch (prefix) {
        case 'digits':
          handleDigitsInput(
            inputElement,
            codeTouche,
            event,
            type,
            prefix,
            id,
            settings
          );
          break;
        case 'sign':
          handleSignInput(inputElement, codeTouche, event, type, prefix);
          break;
      }
    }

    function handleTouchInput(inputElement, event, prefix, type, id, settings) {
      const originalEvent = event.originalEvent || event;

      // Récupérer le code de la touche appuyée
      const codeTouche = originalEvent.keyCode || originalEvent.which;

      // Vérifie si la touche "Maj" (Shift) n'est pas enfoncée
      if (codeTouche !== 16) {
        applyInput(
          inputElement,
          codeTouche,
          originalEvent,
          prefix,
          type,
          id,
          settings
        );
      }
    }

    /* Gestionnaire de modification de la mollette de la souris */

    function adjustOnScroll(inputElement, event, prefix, type) {
      if (!settings.allowScroll) return;
      const originalEvent = event.originalEvent || event;
      originalEvent.preventDefault();

      if (!isKeyRequiredForScroll(event)) return;

      const delta = calculateDelta(originalEvent);
      if (Math.abs(delta) < settings.scrollSensitivity) return;

      handlePrefixScroll(prefix, inputElement, delta, type);
    }

    function isKeyRequiredForScroll(event) {
      if (!settings.requireKeyForScroll) return true;
      const keyRequired = settings.requireKeyForScroll.toLowerCase();
      return (
        (keyRequired === 'control' && event.ctrlKey) ||
        (keyRequired === 'shift' && event.shiftKey) ||
        (keyRequired === 'alt' && event.altKey) ||
        (keyRequired === 'meta' && event.metaKey)
      );
    }

    function calculateDelta(originalEvent) {
      if (originalEvent.deltaY !== undefined) return originalEvent.deltaY;
      if (originalEvent.wheelDelta !== undefined)
        return originalEvent.wheelDelta;
      return 0;
    }

    function handlePrefixScroll(prefix, inputElement, delta, type) {
      switch (prefix) {
        case 'digits':
          handleDigitsScroll(inputElement, delta, type);
          break;
        case 'sign':
          handleSignScroll(inputElement, delta, type);
          break;
        case 'list':
          handleListScroll(inputElement, delta, type);
          break;
      }
    }

    function handleDigitsScroll(inputElement, delta, type) {
      let currentValue = getElement('input', $(inputElement), settings);

      if (currentValue != -1) {
        currentValue += delta < 0 ? -1 : 1;
        const { valueMin, valueMax } = getValueInputLimits(
          getCurrentValueByIndex('current'),
          inputElement,
          settings
        );

        currentValue = adjustLimits(
          currentValue,
          valueMin,
          valueMax
        ).adjustedValue;

        setValueInput(inputElement, currentValue, 'digits', type);
      }
    }

    function handleSignScroll(inputElement, delta, type) {
      let currentValue = -1;

      if (inputElement.val() == '-') currentValue = 0;
      if (inputElement.val() == '+') currentValue = 1;

      if (currentValue != -1) {
        // Incrémenter ou décrémenter la valeur en fonction de la direction du scroll
        currentValue += delta < 0 ? -1 : 1;
        // Contrôler les limites de la valeur
        if (currentValue < 0) setValueInput(inputElement, '+', 'sign', type);
        if (currentValue > 1) setValueInput(inputElement, '-', 'sign', type);
      }
    }

    function handleListScroll(inputElement, delta, type) {
      let currentValue = findPosition(settings.values, inputElement.val());
      if (currentValue != -1) {
        currentValue += delta < 0 ? -1 : 1;
        currentValue = adjustLimits(
          currentValue,
          0,
          settings.values.length - 1
        ).adjustedValue;
        setValueInput(inputElement, currentValue, 'list', type);
      }
    }

    function calculateValueLimits(
      inputElement,
      id,
      currentValue,
      digitMinLimit,
      digitMaxLimit
    ) {
      let { valueTop, valueBottom } = calculateAdjacentValues(
        getElement('input', $(inputElement), settings)
      );

      valueTop = adjustToBounds(
        currentValue,
        -Infinity,
        currentValues.limitMax,
        valueTop,
        null,
        getValidLimitDigit(digitMaxLimit, id) - 1
      );
      valueBottom = adjustToBounds(
        currentValue,
        currentValues.limitMin,
        +Infinity,
        valueBottom,
        getValidLimitDigit(digitMinLimit, id) + 1,
        null
      );

      let { valueMin, valueMax } = getValueInputLimits(
        currentValue,
        inputElement,
        settings
      );

      // Calculer les indicateurs de visibilité pour top et bottom
      let showTop = valueTop >= valueMin;
      let showBottom = valueBottom <= valueMax;

      return { valueTop, valueBottom, valueMin, valueMax, showTop, showBottom };
    }

    function adjustLimits(
      value,
      valueMin,
      valueMax,
      valueTop = null,
      valueBottom = null
    ) {
      // Si seule la valeur unique est fournie, ajuster selon les limites min/max
      if (valueTop === null && valueBottom === null) {
        const adjustedValue = Math.max(valueMin, Math.min(value, valueMax));
        return { adjustedValue };
      }

      // Ajuster les valeurs si elles sont en dehors des limites
      const adjustedValueTop =
        valueTop !== null ? Math.max(valueTop, valueMin) : null;
      const adjustedValueBottom =
        valueBottom !== null ? Math.min(valueBottom, valueMax) : null;

      // Retourner en fonction des valeurs fournies
      if (valueTop !== null && valueBottom === null) {
        return { adjustedValueTop };
      } else if (valueBottom !== null && valueTop === null) {
        return { adjustedValueBottom };
      }

      // Si les deux valeurs sont fournies, renvoyer l'objet complet
      return {
        adjustedValueTop,
        adjustedValueBottom,
      };
    }

    function calculateVisibilityAndAdjustLimits(
      valueTop,
      valueBottom,
      valueMin,
      valueMax
    ) {
      // Calculer la visibilité en fonction des valeurs et des limites
      const showTop = valueTop >= valueMin;
      const showBottom = valueBottom <= valueMax;

      // Ajuster les valeurs si elles sont en dehors des limites
      const { adjustedValueTop, adjustedValueBottom } = adjustLimits(
        null,
        valueMin,
        valueMax,
        valueTop,
        valueBottom
      );

      return {
        showTop,
        showBottom,
        adjustedValueTop,
        adjustedValueBottom,
      };
    }

    function hoverMouseEnter(inputElement, prefix, type) {
      let id = convertIntegerBase10(
        $(inputElement)
          .attr('id')
          .replace(prefix + '_' + type + '_input_', '')
      );
      if (prefix == 'digits') {
        gIdHover = type + id;

        let valueLimites = calculateValueLimits(
          inputElement,
          id,
          getCurrentValueByIndex('current'),
          currentValues.limitDigitMin,
          currentValues.limitDigitMax
        );

        updatePeripheralDigit(
          type,
          id,
          valueLimites.showTop,
          valueLimites.showBottom,
          valueLimites.valueTop,
          valueLimites.valueBottom
        );
      } else if (prefix == 'sign') {
        gIdHover = type + prefix;
        let showTop = $(inputElement).val() == '-';
        let showBottom = $(inputElement).val() == '+';
        updatePeripheralDigit(type, prefix, showTop, showBottom, '+', '-');
      } else if (prefix == 'list') {
        gIdHover = type + prefix;

        let currentValue = findPosition(settings.values, inputElement.value);
        if (currentValue != -1) {
          const valueTop = convertIntegerBase10(currentValue) - 1;
          const valueBottom = convertIntegerBase10(currentValue) + 1;
          let valueLimites = calculateVisibilityAndAdjustLimits(
            valueTop,
            valueBottom,
            0,
            settings.values.length - 1
          );
          updatePeripheralDigit(
            type,
            prefix,
            valueLimites.showTop,
            valueLimites.showBottom,
            settings.values[valueLimites.adjustedValueTop],
            settings.values[valueLimites.adjustedValueBottom]
          );
        }
      }
    }

    function hoverMouseLeave(inputElement, prefix, type) {
      if (prefix == 'digits') {
        let id = $(inputElement)
          .attr('id')
          .replace(prefix + '_' + type + '_input_', '');
        updatePeripheralDigit(type, id, false, false, 0, 0);
      } else if (prefix == 'sign' || prefix == 'list') {
        updatePeripheralDigit(type, prefix, false, false, 0, 0);
      }
      gIdHover = null;
    }

    function toggleHoverEffect(element, prefix, type, isMouseEnter) {
      const suffix = $(element)
        .attr('id')
        .replace(`${prefix}_${type}_div_`, '');
      const position = suffix.includes('top') ? 'top' : 'bottom';
      const id = suffix.replace(`${position}_`, '');
      const selector = `.cla-input-wrapper .${position}-text-${type}-${id}`;

      $(selector).css({
        visibility: isMouseEnter ? 'visible' : 'hidden',
        opacity: isMouseEnter ? '1' : '0',
      });
    }

    function handleTextDivClick(element, prefix, type) {
      const suffix = $(element)
        .attr('id')
        .replace(`${prefix}_${type}_div_`, '');

      if (prefix === 'digits') {
        handleDigitsClick(element, suffix, prefix, type);
      } else if (prefix === 'sign') {
        handleSignClick(element, prefix, type);
      } else if (prefix === 'list') {
        handleListClick(element, suffix, prefix, type);
      }
    }

    // Gestion du préfixe 'digits'
    function handleDigitsClick(element, suffix, prefix, type) {
      const id = suffix.replace(/(top_|bottom_)/, '');
      const value = getElement('div', $(element), settings);
      if (!isValidValue(value) || isNaN(value)) return;

      setElement('input', $(`#${prefix}_${type}_input_${id}`), value, settings);
      updateFinalValue($(`#${prefix}_${type}_input_${id}`), value, type);
      gIdHover = `${type}${id}`;

      const isTop = suffix.includes('top');

      const valueLimits = calculateValueLimits(
        $(`#${prefix}_${type}_input_${id}`),
        id,
        getCurrentValueByIndex('current'),
        currentValues.limitDigitMin,
        currentValues.limitDigitMax
      );

      updatePeripheralDigit(
        type,
        id,
        isTop ? valueLimits.showTop : false,
        isTop ? false : valueLimits.showBottom,
        isTop ? valueLimits.valueTop : 0,
        isTop ? 0 : valueLimits.valueBottom
      );

      gIdHover = null;
    }

    // Gestion du préfixe 'sign'
    function handleSignClick(element, prefix, type) {
      const value = $(element).html();
      if (!isValidValue(value)) return;

      const inputElement = $(`#${prefix}_${type}_input_${prefix}`);
      inputElement.val(value);
      updateFinalValue(inputElement, value, type);

      gIdHover = `${type}${prefix}`;
      updatePeripheralDigit(type, prefix, false, false, 0, 0);
      gIdHover = null;
    }

    // Gestion du préfixe 'list'
    function handleListClick(element, suffix, prefix, type) {
      const value = $(element).html();
      if (!isValidValue(value)) return;

      const inputElement = $(`#${prefix}_${type}_input_${prefix}`);
      inputElement.val(value);
      updateFinalValue(inputElement, value, type);

      gIdHover = `${type}${prefix}`;
      const currentValue = findPosition(settings.values, value);

      const isTop = suffix.includes('top');
      const adjustedValue = isTop ? currentValue - 1 : currentValue + 1;
      const valueLimits = calculateVisibilityAndAdjustLimits(
        isTop ? adjustedValue : 0,
        isTop ? 0 : adjustedValue,
        0,
        settings.values.length - 1
      );

      updatePeripheralDigit(
        type,
        prefix,
        isTop ? valueLimits.showTop : false,
        isTop ? false : valueLimits.showBottom,
        isTop ? settings.values[valueLimits.adjustedValueTop] : '...',
        isTop ? '...' : settings.values[valueLimits.adjustedValueBottom]
      );

      gIdHover = null;
    }

    // Validation de la valeur
    function isValidValue(value) {
      return value !== null && value !== '';
    }

    function getAdjustedValueSettings(index, settings, inputValue = null) {
      // prettier-ignore
      const min = settings.minValues[index] !== undefined 
                ? Math.max(valueDigitMin(settings), Math.min( minValue(index,settings), valueDigitMax(settings))) 
                :  valueDigitMin(settings);

      // prettier-ignore
      const max = settings.maxValues[index] !== undefined 
                ? Math.max(valueDigitMin(settings), Math.min(maxValue(index,settings), valueDigitMax(settings))) 
                : valueDigitMax(settings);

      let value;
      if (inputValue != null) {
        value = inputValue;
      } else if (settings.values[index] !== undefined) {
        value = defaultValue(index, settings);
      } else {
        value = settings.defaultValue;
      }

      // Ajuster `value` pour qu'il soit compris entre `min` et `max`
      value = clampCore(
        value,
        valueDigitMin(settings),
        valueDigitMax(settings)
      );
      return { min, max, value };
    }

    function handlePasteEvent(inputElement, event, prefix, type, id, settings) {
      const originalEvent = event.originalEvent || event;

      originalEvent.preventDefault();
      let pasteText = originalEvent.clipboardData.getData('text');
      if (pasteText.length > 1) pasteText = pasteText.substring(0, 1); // Limiter à un caractère
      let codeTouche = pasteText.charCodeAt(0);
      originalEvent.ctrlKey = false;
      originalEvent.key = pasteText;

      applyInput(
        inputElement,
        codeTouche,
        originalEvent,
        prefix,
        type,
        id,
        settings
      );
    }

    function createTextElement(prefix, uniqueTypeShort, id, position, text) {
      return $('<div>', {
        class:
          id != null
            ? `cla-hover-text ${position}-text-${uniqueTypeShort}-${id}`
            : `cla-hover-text ${position}-text-${uniqueTypeShort}`,
        id:
          id != null
            ? `${prefix}_${uniqueTypeShort}_div_${position}_${id}`
            : `${prefix}_${uniqueTypeShort}_div_${position}`,
        text: text,
      })
        .hover(
          function () {
            toggleHoverEffect(this, prefix, uniqueTypeShort, true);
          },
          function () {
            toggleHoverEffect(this, prefix, uniqueTypeShort, false);
          }
        )
        .on('click', function () {
          handleTextDivClick(this, prefix, uniqueTypeShort);
        });
    }

    function createInputElement(
      prefix,
      uniqueTypeShort,
      id,
      value,
      { min, max, maxLength = '1', isDisabled = false } = {}
    ) {
      // Créer une étiquette avec un texte descriptif pour chaque champ
      const labelId = `${prefix}_${uniqueTypeShort}_label_${id}`;
      const $label = $('<label>', {
        for: `${prefix}_${uniqueTypeShort}_input_${id}`,
        id: labelId,
        text: `Entrée ${id} pour ${settings.type}`, // Remplacez le texte par un libellé plus spécifique si nécessaire
        class: 'sr-only', // Utilisez 'sr-only' pour les lecteurs d'écran si vous ne voulez pas d'affichage visuel
      });

      const $description = $('<div>', {
        id: `description_${uniqueTypeShort}_input_${id}`,
        class: 'visually-hidden',
        text: 'Utilisez la molette ou cliquez sur la valeur suivante ou précédente visible pour modifier la valeur.',
      });
      $('body').append($description);

      const $liveRegion = $('<div>', {
        'aria-live': 'polite',
        class: 'visually-hidden',
        id: 'live-update',
      });
      $('body').append($liveRegion);

      const $input = $('<input>', {
        type: 'text',
        class: `form-control form-control-lg text-center cla-h2-like ${prefix}-input`,
        maxLength: maxLength,
        id: `${prefix}_${uniqueTypeShort}_input_${id}`,
        name: id != null ? `${prefix}${id}` : `${prefix}`,
        autocomplete: 'off',
        value:
          settings.type === 'text' ? value : makeValueElement(value, settings),
        'data-min': min,
        'data-max': max,
        disabled: isDisabled ? 'disabled' : null,
        // Ajouter des attributs ARIA pour améliorer l'accessibilité
        'aria-labelledby': `${labelId}`,
        'aria-valuemin': min,
        'aria-valuemax': max,
        'aria-valuenow':
          settings.type === 'text' ? value : makeValueElement(value, settings),
        'aria-live': 'polite',
        role: 'spinbutton', // Indiquer qu'il s'agit d'un champ de saisie ajustable
      });

      // Lier les descriptions avec l'input
      $input.attr('aria-describedby', 'input-description');

      // Ajouter les événements comme avant
      $input
        .on('keyup', (event) => {
          if (settings.type != 'text' && settings.isDisabled) return;
          const $element = $(event.currentTarget);
          handleTouchInput(
            $element,
            event,
            prefix,
            uniqueTypeShort,
            id,
            settings
          );
        })
        .on('wheel', (event) => {
          if (settings.type != 'text' && settings.isDisabled) return;
          const $element = $(event.currentTarget);
          adjustOnScroll($element, event, prefix, uniqueTypeShort);
        })
        .hover(
          function () {
            if (settings.type != 'text' && settings.isDisabled) return;
            hoverMouseEnter(this, prefix, uniqueTypeShort);
          },
          function () {
            if (settings.type != 'text' && settings.isDisabled) return;
            hoverMouseLeave(this, prefix, uniqueTypeShort);
          }
        )
        .on('paste', (event) => {
          const $element = $(event.currentTarget);
          handlePasteEvent(
            $element,
            event,
            prefix,
            uniqueTypeShort,
            id,
            settings
          );
        })
        .on('copy', (event) => {
          event.preventDefault();
          const $element = $(event.currentTarget);
          navigator.clipboard.writeText($element.val());
        });

      // Retourner un conteneur contenant le label et l'input
      return $('<div>', {
        class: 'cla-input-wrapper',
        css: { position: 'relative' },
      })
        .append($label)
        .append($input);
    }

    this.each(function () {
      const $container = $(this);

      // Création d'un div parent avec la classe `cla-input-container` pour appliquer le `gap`
      const $inputContainer = $('<div>', {
        class: 'cla-input-container',
        css: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: settings.gap,
        },
      });

      // Fonction pour ajouter un élément d'input et ses éléments associés
      function addInputElement(
        prefix,
        id,
        min,
        max,
        value,
        maxLength,
        isDisabled
      ) {
        const $wrapperDiv = $('<div>', {
          class: 'text-center cla-input-wrapper',
          css: { position: 'relative' },
        });
        $wrapperDiv.append(
          createTextElement(prefix, uniqueTypeShort, id, 'top', '&nbsp;')
        );

        $wrapperDiv.append(
          createInputElement(prefix, uniqueTypeShort, id, value, {
            min,
            max,
            maxLength,
            isDisabled,
          })
        );
        $wrapperDiv.append(
          createTextElement(prefix, uniqueTypeShort, id, 'bottom', '&nbsp;')
        );
        $inputContainer.append($wrapperDiv);
      }

      // Ajoute les préfixes spécifiques aux types "binary" et "hexadecimal"
      function addPrefixLabel(prefix) {
        const labelMap = { binary: '0b', hexadecimal: '0x' };
        if (labelMap[prefix]) {
          $inputContainer.append(
            $('<div>', {
              class: 'col-1',
              html: `<div><h2 class="my-5">${labelMap[prefix]}</h2></div>`,
            })
          );
        }
      }

      if (
        ['integer', 'float', 'binary', 'hexadecimal', 'letter'].includes(
          settings.type
        )
      ) {
        if (isAllowSign(settings)) {
          addInputElement(
            'sign',
            'sign',
            null,
            null,
            getCurrentValueByIndex('sign'),
            '1',
            isDisabled(settings)
          );
        }

        // Ajoute le préfixe "0b" pour binaire et "0x" pour hexadécimal si nécessaire
        addPrefixLabel(settings.type);

        const prefix = 'digits';
        for (let i = 1; i <= settings.numInputs; i++) {
          // Ajoute le séparateur décimal pour les nombres flottants
          if (settings.type === 'float' && i - 1 === settings.decimalPosition) {
            $inputContainer.append(
              $('<div>', {
                class: 'col-1',
                html: `<div><h2 class="my-5">${settings.separator}</h2></div>`,
              })
            );
          }
          // Récupère les paramètres pour chaque input et ajoute l'élément
          const { min, max, value } = getAdjustedValueSettings(i - 1, settings);
          addInputElement(
            'digits',
            i,
            min,
            max,
            value,
            '1',
            isDisabled(settings)
          );
          // Met à jour les valeurs actuelles et finales pour l'input
          updateCurrentValues(i - 1, value);
        }
        $container.append($inputContainer);

        const { value } = getAdjustedValueSettings(
          settings.numInputs - 1,
          settings
        );
        updateFinalValue(
          $(`#${prefix}_${uniqueTypeShort}_input_${settings.numInputs}`),
          value,
          uniqueTypeShort,
          false
        );
      } else if (settings.type === 'text') {
        // Ajoute l'élément de liste pour le type texte
        addInputElement(
          'list',
          'list',
          0,
          settings.values.length - 1,
          settings.values[settings.defaultValue],
          '30',
          isDisabled(settings)
        );
        $container.append($inputContainer);
        updateCurrentValues('current', settings.values[settings.defaultValue]);
      }
    });

    // Méthode pour récupérer un chiffre spécifique à un index donné
    this.getDigitAt = function (index) {
      if (index === undefined || index == null) {
        throw new Error('Un index doit être renseignée.');
      }

      if (isGetDigit(settings)) {
        // Vérifie si l'index est dans la plage de currentValue
        if (index >= 0 && index < currentValues.digits.length) {
          return getCurrentValueByIndex(index);
        } else {
          throw new Error("L'index est en dehors de la plage.");
        }
      } else {
        throw new Error(
          'settings.type non disponible avec la fonction getDigitAt.'
        );
      }
    };

    // Méthode pour récupérer un chiffre spécifique à un index donné
    this.setDigitAt = function (index, value) {
      validateValue(value);

      if (index === undefined || index == null) {
        throw new Error('Un index doit être renseignée.');
      }

      if (isSetDigit(settings)) {
        // Vérifie si l'index est dans la plage de currentValue
        if (index >= 0 && index < currentValues.digits.length) {
          let newvalue = value;
          const inputElement = $(
            `#digits_${uniqueTypeShort}_input_${index + 1}`
          );

          if (settings.type == 'hexadecimal')
            newvalue = convertLetterToHexadecimal(value);
          if (settings.type == 'letter') newvalue = convertLetter(value);
          setValueInput(inputElement, newvalue, 'digits', uniqueTypeShort);
        } else {
          throw new Error("L'index est en dehors de la plage.");
        }
      } else {
        throw new Error(
          'settings.type non disponible avec la fonction setDigitAt.'
        );
      }
    };

    this.toggleInputs = function (disabled) {
      settings.isDisabled = disabled; // Met à jour l'option dans les paramètres
      this.find('input').prop('disabled', isDisabled(settings)); // Applique le changement à tous les inputs
    };

    // Méthode pour récupérer la valeur complète
    this.getCompleteValue = function () {
      return getCurrentValueByIndex('current');
    };

    function validateValue(value) {
      if (
        value === undefined ||
        value === null ||
        (typeof value == 'string' && (!value || value.length === 0))
      ) {
        throw new Error('Une valeur doit être renseignée.');
      }
    }

    // Fonction pour valider la valeur, remplir les digits et mettre à jour
    function validateAndFillDigits(value, conversionFunction) {
      updateCurrentValues('fillDigits', 0);
      fillDigits(conversionFunction(value), uniqueTypeShort);
      let newValue = digitsArrayToNumber(
        getCurrentValueByIndex('digits'),
        settings.type === 'float',
        settings.decimalPosition
      );
      newValue = addSignToValue(newValue, uniqueTypeShort);
      updateCurrentValues('current', newValue);
    }

    function updateValueInteger(value) {
      if (isValidIntegerOrFloat(value)) {
        validateAndFillDigits(value, convertIntegerBase10);
      } else {
        throw new Error('La valeur doit être un nombre entier.');
      }
    }

    function updateValueFloat(value) {
      if (isValidIntegerOrFloat(value)) {
        validateAndFillDigits(value, convertFloat);
      } else {
        throw new Error('La valeur doit être un nombre flottant.');
      }
    }

    function updateValueBinary(value) {
      if (typeof value == 'number') value = value.toString();
      const removeBinaryPrefix = (value) => value.replace(/^0b/, '');
      if (isValidBinary(value)) {
        updateValueDigits(
          truncateFromEnd(removeBinaryPrefix(value), settings.numInputs)
        );
      } else {
        throw new Error(
          'La valeur doit être un nombre binaire (composé uniquement de 0 et 1).'
        );
      }
    }

    function updateValueHexadecimal(value) {
      if (typeof value == 'number') value = value.toString();
      const removeHexadecimalPrefix = (value) => value.replace(/^0x/, '');
      if (isValidHexadecimal(value)) {
        updateValueDigits(
          truncateFromEnd(removeHexadecimalPrefix(value), settings.numInputs)
        );
      } else {
        throw new Error('La valeur doit être un nombre hexadécimal.');
      }
    }

    function updateValueLetter(value) {
      updateValueDigits(truncateFromEnd(value, settings.numInputs));
    }

    function updateValueDigits(value) {
      updateCurrentValues('fillDigits', 0);
      fillDigits(value, uniqueTypeShort);
      updateCurrentValues('current', value);
    }

    function updateValueText(value) {
      const index = findPosition(settings.values, value);
      if (index !== -1) {
        $(`input[id^=list_${uniqueTypeShort}_input]`).val(value);
        updateCurrentValues('current', value);
      } else {
        throw new Error(
          "Le texte n'est pas reconnu dans les valeurs disponibles."
        );
      }
    }

    function updateValue(value) {
      // Fonctions auxiliaires pour supprimer les préfixes
      switch (settings.type) {
        case 'integer':
          updateValueInteger(value);
          break;
        case 'float':
          updateValueFloat(value);
          break;
        case 'binary':
          updateValueBinary(value);
          break;
        case 'hexadecimal':
          updateValueHexadecimal(value);
          break;
        case 'letter':
          updateValueLetter(value);
          break;
        case 'text':
          updateValueText(value);
          break;
        /* istanbul ignore next */
        default:
          throw new Error(
            "Le type spécifié dans settings n'est pas compatible avec setCompleteValue."
          );
      }
    }

    this.setCompleteValue = function (value, onchange = false) {
      validateValue(value);
      updateValue(value);
      triggerValueChange(null, settings, onchange);
    };

    /* istanbul ignore next */
    if (typeof window !== 'undefined' && window.TEST_MODE) {
      // Fonction pour définir `gIdHover`
      this.setHoverId = function (hoverId) {
        gIdHover = hoverId;
      };

      // Fonction pour récupérer `gIdHover`
      this.getHoverId = function () {
        return gIdHover;
      };

      // Fonction pour exposer `calculatePeripheralDisplay` et retourner ses résultats
      this.calculatePeripheralDisplay = function (
        prefix,
        id,
        value,
        inputElement,
        hover
      ) {
        return calculatePeripheralDisplay(
          prefix,
          id,
          value,
          inputElement,
          hover
        );
      };
    }
    return this;
  };

  $.fn.codeInputBuilder.version = '0.0.16';
  $.fn.codeInputBuilder.title = 'CodeInputBuilder';
  $.fn.codeInputBuilder.description =
    "Plugin jQuery permettant de générer des champs d'input configurables pour la saisie de valeurs numériques (entiers, flottants), de textes, ou de valeurs dans des systèmes spécifiques (binaire, hexadécimal). Il offre des options avancées de personnalisation incluant la gestion des signes, des positions décimales, des limites de valeurs, et des callbacks pour la gestion des changements de valeur.";
})(jQuery);
