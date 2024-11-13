describe("CodeInputBuilder Plugin Tests", function() {
    beforeEach(function() {
        $('body').append('<div id="element"></div>');
        $('#element').codeInputBuilder({
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
        const value = $('#element').getCompleteValue();
        expect(value).to.equal(0);
    });

    it("devrait mettre à jour la valeur correctement", function() {
        $('#element').setCompleteValue(42);
        const value = $('#element').getCompleteValue();
        expect(value).to.equal(42);
    });
});
