describe("CodeInputBuilder Plugin Tests", function() {
    let codeInputTest;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin et stocker la référence dans une variable globale
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: 4,
            minValues: [0, 0, 1, 2],
            maxValues: [9, 9, 9, 5]
        });
    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function() {
        // Utiliser la variable globale pour accéder aux méthodes du plugin
        const value = codeInputTest.getCompleteValue();
        expect(value).to.equal(12);
    });

    it("devrait mettre à jour la valeur correctement", function() {
        codeInputTest.setCompleteValue(42);
        const value = codeInputTest.getCompleteValue();
        expect(value).to.equal(42);
    });
});
