// tests/codeInputBuilder.test.js
const expect = require('chai').expect;
const $ = require('jquery');
global.$ = $; // Assure que $ est disponible globalement pour le plugin

require('../src/codeinputbuilder.js');

describe("CodeInputBuilder Plugin Tests", function() {

    beforeEach(function() {
        // Setup du DOM avant chaque test
        $('body').append('<div id="element"></div>');
        $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: 4,
            minValues: [0, 0, 1, 2],
            maxValues: [9, 9, 9, 5]
        });
    });

    afterEach(function() {
        // Cleanup après chaque test
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function() {
        const value = $('#element').getCompleteValue();
        expect(value).to.equal(0); // Exemple de vérification de la valeur initiale
    });

    it("devrait mettre à jour la valeur correctement", function() {
        $('#element').setCompleteValue(42);
        const value = $('#element').getCompleteValue();
        expect(value).to.equal(42);
    });

});
