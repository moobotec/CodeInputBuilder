describe("CodeInputBuilder Plugin Test des options", function() {
    let codeInputTest;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');
    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait gérer des options incorrectes sans erreur (Type invalide)", function() {
        // Initialiser le plugin et stocker la référence dans une variable globale
        codeInputTest = $('#element').codeInputBuilder({
            type: 'nonexistentType', // Type invalide
        });
        expect(codeInputTest).to.exist;
    });

    it("devrait gérer des options incorrectes sans erreur (Nombre d'inputs négatif)", function() {
        // Initialiser le plugin et stocker la référence dans une variable globale
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer', 
            numInputs: -5, // Nombre d'inputs négatif
        });
        expect(codeInputTest).to.exist;
    });

    it("devrait gérer des options incorrectes sans erreur (minValues invalide)", function() {
        // Initialiser le plugin et stocker la référence dans une variable globale
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer', 
            numInputs: 5, // Nombre d'inputs négatif
            minValues: null, // minValues invalide
        });
        expect(codeInputTest).to.exist;
    });

    it("devrait gérer des options incorrectes sans erreur (maxValues invalide)", function() {
        // Initialiser le plugin et stocker la référence dans une variable globale
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer', 
            numInputs: 5, // Nombre d'inputs négatif
            maxValues: "invalid" // maxValues invalide
        });
        expect(codeInputTest).to.exist;
    });

});
