describe("CodeInputBuilder Plugin Test du type Float", function() {
    let codeInputTest;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin et stocker la référence dans une variable globale
        codeInputTest = $('#element').codeInputBuilder({
            type: 'float',
            numInputs: 5,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            decimalPosition : 2,
            gap: '1px', // Espace entre les inputs
            separator: ',',
            autoFocusNextInput: true,
            autoFocusNextInputDirection: 'Right',
            isDisabled: true,
        });
    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function() {
        // Utiliser la variable globale pour accéder aux méthodes du plugin
        const value = codeInputTest.getCompleteValue();
        expect(value).to.equal(0);
    });

    it("devrait mettre à jour la valeur correctement", function() {
        codeInputTest.setCompleteValue(42);
        expect(codeInputTest.getCompleteValue()).to.equal(42);

        codeInputTest.setCompleteValue(42.3);
        expect(codeInputTest.getCompleteValue()).to.equal(42.3);       
    });


    it("devrait respecter les valeurs minimales et maximales", function() {
        codeInputTest.setCompleteValue(99.999);
        expect(codeInputTest.getCompleteValue()).to.equal(99.999);

        codeInputTest.setCompleteValue(100.000); // Au-delà de la valeur maximale
        expect(codeInputTest.getCompleteValue()).to.equal(0); // Devrait être limité à 9999
      
        codeInputTest.setCompleteValue(-1); // En-dessous de la valeur minimale
        expect(codeInputTest.getCompleteValue()).to.equal(1); // Devrait être limité à 0
    });
});
