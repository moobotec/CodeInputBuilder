describe("CodeInputBuilder Plugin Tests avec type Time (avec millisecondes)", function () {
    let codeInputTest;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest = $('#element').codeInputBuilder({
            type: 'time',
            formatTime: 'HH:MM:SS.SSS',
            defaulValue: 0,
            scrollSensitivity: 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function () {
        const value = codeInputTest.getCompleteValue();
        expect(value).to.equal(0);
    });

    it("devrait contenir les inputs pour chaque partie du temps avec millisecondes et les attributs corrects", function () {
        const timeParts = ['HH', 'MM', 'SS', 'SSS'];
        let inputIndex = 1;

        for (const part of timeParts) {
            const length = part === 'SSS' ? 3 : 2; // 3 chiffres pour les millisecondes
            for (let i = 0; i < length; i++) {
                const timeInput = $element.find(`input.digits-input[name='digits${inputIndex}']`);

                // Vérifications des attributs
                const idPattern = new RegExp(`^digits_time_[a-zA-Z0-9]+_input_${inputIndex}$`);
                expect(timeInput.length).to.equal(1);
                expect(timeInput.attr('id')).to.match(idPattern);
                expect(timeInput.attr('type')).to.equal('text');
                expect(timeInput.hasClass('form-control')).to.be.true;
                expect(timeInput.hasClass('form-control-lg')).to.be.true;
                expect(timeInput.hasClass('text-center')).to.be.true;
                expect(timeInput.hasClass('cla-h2-like')).to.be.true;
                expect(timeInput.attr('maxlength')).to.equal('1');
                inputIndex++;
            }
        }
    });

    it("devrait respecter les limites des valeurs de temps avec millisecondes", function () {
        codeInputTest.setCompleteValue("23:59:59.999");
        expect(codeInputTest.getCompleteValue()).to.equal(86399.999);

        codeInputTest.setCompleteValue("24:00:00.000");
        expect(codeInputTest.getCompleteValue()).to.equal(82800);

        codeInputTest.setCompleteValue("-01:00:00.000");
        expect(codeInputTest.getCompleteValue()).to.equal(0);
    });

    it("devrait mettre à jour correctement les valeurs de temps avec millisecondes", function () {
        codeInputTest.setCompleteValue("12:34:56.789");
        expect(codeInputTest.getCompleteValue()).to.equal(45296.789); 

        codeInputTest.setCompleteValue("01:02:03.456");
        expect(codeInputTest.getCompleteValue()).to.equal(3723.456);
    });

    it("devrait incrémenter les valeurs avec la molette de la souris", function () {
        const timeInputs = $element.find("input.digits-input");

        // Incrémenter la dernière partie (millisecondes)
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: -1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(0);

        // Décrémenter
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(0.001);

        // Décrémenter
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(0.002);


        // Incrémenter la dernière partie (millisecondes)
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: -1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(0.001);

    });


    it("devrait incrémenter toutes les valeurs d'input en utilisant un signal keyup ", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue("01:34:55.000");
    
        // Sélectionner les inputs et leurs divs associés
        const codeInputs = $('#element').find("input[id^='digits_time_']");

        // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: '2', // Simule une touche spécifique
                keyCode: 103,
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });
    
        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal(80542.222);

    });

    it("devrait changer la valeur correctement ", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue(new Date(Date.UTC(1970, 0, 1, 1, 34, 55, 20)));
        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal(5695.02);
    });

    it("devrait incrémenter les valeurs avec la molette de la souris et test au limite du time ", function () {
        
        codeInputTest.setCompleteValue(71999.999);
        
        const timeInputs = $element.find("input.digits-input");

        // Décrémenter
        timeInputs.first().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(86399.999);

    });

});


describe("CodeInputBuilder Plugin Tests avec type Time (avec millisecondes) autre façon d'initiliser la valeur par défault", function () {
    let codeInputTest1;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest1 = $('#element').codeInputBuilder({
            type: 'time',
            formatTime: 'HH:MM:SS.SSS',
            defaultValue: '01:02:25.225',
            scrollSensitivity: 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function () {

        const inputs = $('#element').find('input.digits-input'); // Sélectionner tous les inputs avec la classe 'digits-input'
        const values = [];

        // Parcourir les inputs pour collecter leurs valeurs
        inputs.each((index, input) => {
            values.push($(input).val()); // Ajouter chaque valeur au tableau
        });

        expect(values).to.deep.equal(['0', '1', '0', '2', '2', '5', '2', '2', '5']);

        const value = codeInputTest1.getCompleteValue();


        expect(value).to.equal(3745.225);
    });

});

describe("CodeInputBuilder Plugin Tests avec type Time (avec millisecondes) autre façon d'initiliser la valeur par défault", function () {
    let codeInputTest1;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest1 = $('#element').codeInputBuilder({
            type: 'time',
            formatTime: 'HH:MM:SS.SSS',
            defaultValue: new Date(Date.UTC(1970, 0, 1, 1, 34, 55, 20)),
            scrollSensitivity: 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function () {

        const inputs = $('#element').find('input.digits-input'); // Sélectionner tous les inputs avec la classe 'digits-input'
        const values = [];

        // Parcourir les inputs pour collecter leurs valeurs
        inputs.each((index, input) => {
            values.push($(input).val()); // Ajouter chaque valeur au tableau
        });

        expect(values).to.deep.equal(['0', '1', '3', '4', '5', '5', '0', '2', '0']);

        const value = codeInputTest1.getCompleteValue();

        expect(value).to.equal(5695.02);
    });

});