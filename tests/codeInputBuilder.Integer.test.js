describe("CodeInputBuilder Plugin Test du type Integer", function() {
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
        expect(codeInputTest.getCompleteValue()).to.equal(42);

        //codeInputTest.setCompleteValue(-1);
        //expect(codeInputTest.getCompleteValue()).to.equal(-2); 
    });


    it("devrait respecter les valeurs minimales et maximales", function() {
        //codeInputTest.setCompleteValue(9999);
        //expect(codeInputTest.getCompleteValue()).to.equal(9995);

        codeInputTest.setCompleteValue(10000); // Au-delà de la valeur maximale
        expect(codeInputTest.getCompleteValue()).to.equal(12); 
      
        //codeInputTest.setCompleteValue(-9999);
        //expect(codeInputTest.getCompleteValue()).to.equal(-9995);

        codeInputTest.setCompleteValue(-10000); // Au-delà de la valeur maximale
        expect(codeInputTest.getCompleteValue()).to.equal(-12); // Devrait être limité à 9999
    });

});
