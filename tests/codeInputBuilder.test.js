describe("CodeInputBuilder Plugin Test des options", function() {
    
    let codeInputTest;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');
    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait lancer une erreur si Type invalide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'nonexistentType', // Type invalide
            });
        }).to.throw("Option 'type' invalide. Valeurs autorisées : 'integer', 'float', 'text','binary', 'hexadecimal', 'letter'.");
    });
    
    it("devrait lancer une erreur si numInputs est un nombre négatif", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'integer', 
                numInputs: -4
            });
        }).to.throw("Option 'numInputs' doit être un entier positif.");
    });
    
    it("devrait lancer une erreur si minValues est invalide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'integer', 
                numInputs: 5, // Nombre d'inputs négatif
                minValues: ['0'], // minValues invalide
            });
        }).to.throw("'minValues' doit contenir autant d'éléments que 'numInputs'.");
    });
    
    it("devrait lancer une erreur si maxValues est invalide", function() {
        expect(() => {
            $('#element').codeInputBuilder({
                type: 'integer', 
                numInputs: 5, // Nombre d'inputs négatif
                maxValues: ['0'], // minValues invalide
            });
        }).to.throw("'maxValues' doit contenir autant d'éléments que 'numInputs'.");
    });
    
});
