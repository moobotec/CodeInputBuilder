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
        }).to.throw("Option 'type' invalide. Valeurs autorisées : 'integer', 'float', 'text','binary', 'hexadecimal', 'letter'.");
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

    it("devrait lancer une erreur si 'defaultValue' n'est ni un nombre ni une chaîne", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                defaultValue: {}
            });
        }).to.throw("Option 'defaultValue' doit être un nombre ou une chaîne.");
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
