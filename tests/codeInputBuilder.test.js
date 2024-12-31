describe("CodeInputBuilder Plugin Test des options dans initCodeInputBuilderOptions", function() {
    let codeInputTest;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');
    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait lancer une erreur si 'type' est invalide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'invalidType'
            });
        }).to.throw("Option 'type' invalide. Valeurs autorisées : 'integer', 'float', 'text','binary', 'hexadecimal', 'letter', time, date.");
    });

    it("devrait lancer une erreur si 'numInputs' est négatif ou nul", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                numInputs: 0
            });
        }).to.throw("Option 'numInputs' doit être un entier positif.");
    });

    it("devrait lancer une erreur si 'minValues' n'a pas la même longueur que 'numInputs'", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                numInputs: 3,
                minValues: [1, 2]
            });
        }).to.throw("'minValues' doit contenir autant d'éléments que 'numInputs'.");
    });

    it("devrait lancer une erreur si 'maxValues' n'a pas la même longueur que 'numInputs'", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                numInputs: 3,
                maxValues: [1, 2]
            });
        }).to.throw("'maxValues' doit contenir autant d'éléments que 'numInputs'.");
    });

    it("devrait lancer une erreur si 'values' n'a pas la même longueur que 'numInputs'", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                numInputs: 3,
                values: [1, 2]
            });
        }).to.throw("'values' doit contenir autant d'éléments que 'numInputs'.");
    });

    it("devrait lancer une erreur si 'decimalPosition' est invalide pour le type 'float'", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'float',
                decimalPosition: 0
            });
        }).to.throw("Option 'decimalPosition' doit être un entier positif pour les types flottants.");
    });

    it("devrait lancer une erreur si 'formatTime' est invalide pour le type 'time'", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'time',
                formatTime : 'kllk:lkfkfkf:lflfjff:flfkfkfk',
            });
        }).to.throw("Le format 'kllk:lkfkfkf:lflfjff:flfkfkfk' est invalide. Utilisez un format valide comme 'HH:MM:SS.SSS' ou 'HH|MM|SS'.");
    });

    it("devrait lancer une erreur si 'formatDate' est invalide pour le type 'date'", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'date',
                formatDate : 'kllk:lkfkfkf:lflfjff:flfkfkfk',
            });
        }).to.throw("Le format 'kllk:lkfkfkf:lflfjff:flfkfkfk' est invalide. Utilisez un format valide comme 'DD/MM/YYYY' ou 'DD|MM|YYYY' ou 'DD|MH|YYYY' ou 'DD/MH.");
    });

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                defaultValue: {}
            });
        }).to.throw("Option 'defaultValue' doit être un nombre ou une chaîne.");
    });

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne (type time)", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'time',
                defaultValue: 'xxcvxv'
            });
        }).to.throw("Option 'defaultValue' : doit être un nombre (secondes), une chaîne formatée 'HH:MM:SS' ou un objet Date.");
    });

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne (type time)", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'time',
                defaultValue: -10
            });
        }).to.throw("Option 'defaultValue' : doit être un nombre (secondes), une chaîne formatée 'HH:MM:SS' ou un objet Date.");
    });

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne (type time)", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'time',
                defaultValue: new Date('invalid-date-string')
            });
        }).to.throw("Option 'defaultValue' : doit être un nombre (secondes), une chaîne formatée 'HH:MM:SS' ou un objet Date.");
    });

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne (type date)", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'date',
                defaultValue: 'xxcvxv'
            });
        }).to.throw("Option 'defaultValue' : doit être un nombre (secondes), une chaîne formatée 'DD/MM/YYYY' ou un objet Date.");
    });

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne (type date)", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'date',
                defaultValue: -10
            });
        }).to.throw("Option 'defaultValue' : doit être un nombre (secondes), une chaîne formatée 'DD/MM/YYYY' ou un objet Date.");
    });

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne (type date)", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'date',
                defaultValue: new Date('invalid-date-string')
            });
        }).to.throw("Option 'defaultValue' : doit être un nombre (secondes), une chaîne formatée 'DD/MM/YYYY' ou un objet Date.");
    });

    it("devrait lancer une erreur si 'totalMin' n'est pas un nombre ou null", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                totalMin: 'invalid'
            });
        }).to.throw("Option 'totalMin' doit être un nombre ou null.");
    });

    it("devrait lancer une erreur si 'totalMax' n'est pas un nombre ou null", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                totalMax: 'invalid'
            });
        }).to.throw("Option 'totalMax' doit être un nombre ou null.");
    });

    it("devrait lancer une erreur si 'onValueChange' n'est pas une fonction ou null", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                onValueChange: 'notAFunction'
            });
        }).to.throw("Option 'onValueChange' doit être une fonction ou null.");
    });

    it("devrait lancer une erreur si 'allowScroll' n'est pas un booléen", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                allowScroll: 'invalid'
            });
        }).to.throw("Option 'allowScroll' doit être un booléen.");
    });

    it("devrait lancer une erreur si 'allowSign' n'est pas un booléen", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                allowSign: 'invalid'
            });
        }).to.throw("Option 'allowSign' doit être un booléen.");
    });

    it("devrait lancer une erreur si 'allowArrowKeys' n'est pas un booléen", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                allowArrowKeys: 'invalid'
            });
        }).to.throw("Option 'allowArrowKeys' doit être un booléen.");
    });

    it("devrait lancer une erreur si 'isDisabled' n'est pas un booléen", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                isDisabled: 'invalid'
            });
        }).to.throw("Option 'isDisabled' doit être un booléen.");
    });

    it("devrait lancer une erreur si 'autoFocusNextInput' n'est pas un booléen", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                autoFocusNextInput: 'invalid'
            });
        }).to.throw("Option 'autoFocusNextInput' doit être un booléen.");
    });

    it("devrait lancer une erreur si 'autoFocusNextInputDirection' est invalide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                autoFocusNextInputDirection: 'Upwards'
            });
        }).to.throw("Option 'autoFocusNextInputDirection' doit être 'Forward', 'Backward', 'Right', 'Left' ou null.");
    });

    it("devrait lancer une erreur si 'scrollSensitivity' n'est pas un entier positif", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                scrollSensitivity: -1
            });
        }).to.throw("Option 'scrollSensitivity' doit être un entier positif.");
    });

    it("devrait lancer une erreur si 'requireKeyForScroll' est invalide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                requireKeyForScroll: 'Enter'
            });
        }).to.throw("Option 'requireKeyForScroll' doit être 'Control', 'Shift', 'Alt', 'Meta' ou null.");
    });

    it("devrait lancer une erreur si 'defaultSign' est invalide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                defaultSign: '*'
            });
        }).to.throw("Option 'defaultSign' doit être '+', '-'.");
    });

    it("devrait lancer une erreur si 'maskInput' n'est pas un booléen", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                maskInput: 'invalid'
            });
        }).to.throw("Option 'maskInput' doit être un booléen.");
    });

    it("devrait lancer une erreur si 'defaulLanguage' n'est pas un string", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                defaultLanguage: 10
            });
        }).to.throw("L'option 'defaultLanguage' doit être une chaîne de caractères.");
    });

    it("devrait lancer une erreur si 'defaulLanguage' est une chaine de caractères compatible avec Intl.DateTimeFormat", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                defaultLanguage: 'abcd'
            });
        }).to.throw("Incorrect locale information provided");
    });

    it("devrait lancer une erreur si 'hoursCycle' est vide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'time',
                hourCycle: null
            });
        }).to.throw("L'option 'hourCycle' n'est pas définie. Valeur par défaut utilisée : '24h'.");
    });

    it("devrait lancer une erreur si 'hoursCycle' doit un string", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'time',
                hourCycle: 10
            });
        }).to.throw("L'option 'hourCycle' doit être une chaîne de caractères ('24h' ou '12h').");
    });

    it("devrait lancer une erreur si 'hoursCycle' doit etre soit 24h ou 12h", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'time',
                hourCycle: "13h"
            });
        }).to.throw("L'option 'hourCycle' doit être une des valeurs suivantes : 24h, 12h.");
    });

    it("devrait accepter des options valides sans lancer d'erreur", function() {
        expect(() => {
            codeInputTest = $('#element').codeInputBuilder({
                type: 'integer',
                numInputs: 4,
                minValues: [0, 1, 2, 3],
                maxValues: [9, 9, 9, 9],
                values: [4, 5, 6, 7],
                defaultValue: 1234,
                allowSign: true,
                defaultSign: '+',
                decimalPosition: 2,
                totalMax: 10000,
                totalMin: 100,
                onValueChange: () => {},
                allowScroll: true,
                scrollSensitivity: 50,
                requireKeyForScroll: 'Control',
                autoFocusNextInput: true,
                autoFocusNextInputDirection: 'Forward',
                gap: '5px',
                isDisabled: false
            });
        }).to.not.throw();
    });
});

