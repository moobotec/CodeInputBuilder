describe("CodeInputBuilder Plugin Tests avec type Date ()", function () {
    let codeInputTest;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest = $('#element').codeInputBuilder({
            type: 'date',
            formatDate: 'DD/MM/YYYY',
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

    it("devrait contenir les inputs pour chaque partie de la date et les attributs corrects", function () {
        const timeParts = ['DD', 'MM', 'YYYY'];
        let inputIndex = 1;

        for (const part of timeParts) {
            const length = part === 'YYYY' ? 4 : 2; 
            for (let i = 0; i < length; i++) {
                const timeInput = $element.find(`input.digits-input[name='digits${inputIndex}']`);

                // Vérifications des attributs
                const idPattern = new RegExp(`^digits_date_[a-zA-Z0-9]+_input_${inputIndex}$`);
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

    it("devrait respecter les limites des valeurs de la date", function () {
        codeInputTest.setCompleteValue("31/12/9999");
        expect(codeInputTest.getCompleteValue()).to.equal(253402214400);

        codeInputTest.setCompleteValue("10/02/2025");
        expect(codeInputTest.getCompleteValue()).to.equal(1739145600);

        codeInputTest.setCompleteValue("-01/00/0000");
        expect(codeInputTest.getCompleteValue()).to.equal(0);
    });

    it("devrait incrémenter les valeurs avec la molette de la souris", function () {
        const timeInputs = $element.find("input.digits-input");

        // Incrémenter la dernière partie (date)
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

        expect(codeInputTest.getCompleteValue()).to.equal(31536000);

        // Décrémenter
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(63072000);


        // Incrémenter la dernière partie (date)
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: -1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(31536000);

    });


    it("devrait incrémenter toutes les valeurs d'input en utilisant un signal keyup ", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue("10/02/2025");
    
        // Sélectionner les inputs et leurs divs associés
        const codeInputs = $('#element').find("input[id^='digits_date_']");

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
        expect(codeInputTest.getCompleteValue()).to.equal(7983014400); - '22/12/2222'

    });

    it("devrait changer la valeur correctement ", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue(new Date(Date.UTC(2025, 0, 1, 0, 0, 0, 0)));
        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal(1735689600);
    });

    it("devrait incrémenter les valeurs avec la molette de la souris et test au limite de la date ", function () {
        
        codeInputTest.setCompleteValue(253402214400);
        const timeInputs = $element.find("input.digits-input");
        // Décrémenter
        timeInputs.first().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });
        expect(codeInputTest.getCompleteValue()).to.equal(253402214400);

    });

});

describe("CodeInputBuilder Plugin Tests avec type Date autre façon d'initiliser la valeur par défault", function () {
    let codeInputTest1;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest1 = $('#element').codeInputBuilder({
            type: 'date',
            formatDate: 'DD/MM/YYYY',
            defaultValue: '10/12/2025',
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

        expect(values).to.deep.equal(['1', '0', '1', '2', '2', '0', '2', '5']);
        const value = codeInputTest1.getCompleteValue();
        expect(value).to.equal(1765324800);
    });

});

describe("CodeInputBuilder Plugin Tests avec type Date autre façon d'initiliser la valeur par défault", function () {
    let codeInputTest1;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest1 = $('#element').codeInputBuilder({
            type: 'date',
            formatDate: 'DD/MM/YYYY',
            defaultValue: new Date(Date.UTC(2025, 11, 10, 0, 0, 0, 0)),
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

        expect(values).to.deep.equal(['1', '0', '1', '2', '2', '0', '2', '5']);
        const value = codeInputTest1.getCompleteValue();
        expect(value).to.equal(1765324800);
    });

});

describe("CodeInputBuilder Plugin Tests avec type Date ( avec mois en letter)", function () {
    let codeInputTest;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest = $('#element').codeInputBuilder({
            type: 'date',
            formatDate: 'DD/MH/YYYY',
            defaultLanguage: 'fr',
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

    it("devrait contenir les inputs pour chaque partie de la date et les attributs corrects", function () {
        const timeParts = ['DD', 'MH', 'YYYY'];
        let inputIndex = 1;

        for (const part of timeParts) {
            let length = 0;
            let prefix = 'digits';
            let maxlength = '1';
            
            if ( part === 'YYYY')
            {
                length = 4; 
            }
            else if ( part == 'MH')
            {
                prefix = 'month';
                length = 1; 
                maxlength = '30';
            }
            else if ( part == 'DD')
            {
                length = 2; 
            }
            for (let i = 0; i < length; i++) {
                const timeInput = $element.find(`input.${prefix}-input[name='${prefix}${inputIndex}']`);

                // Vérifications des attributs
                const idPattern = new RegExp(`^${prefix}_date_[a-zA-Z0-9]+_input_${inputIndex}$`);
                expect(timeInput.length).to.equal(1);
                expect(timeInput.attr('id')).to.match(idPattern);
                expect(timeInput.attr('type')).to.equal('text');
                expect(timeInput.hasClass('form-control')).to.be.true;
                expect(timeInput.hasClass('form-control-lg')).to.be.true;
                expect(timeInput.hasClass('text-center')).to.be.true;
                expect(timeInput.hasClass('cla-h2-like')).to.be.true;
                expect(timeInput.attr('maxlength')).to.equal(maxlength);
                inputIndex++;
            }
        }
    });

    it("devrait respecter les limites des valeurs de la date", function () {
        codeInputTest.setCompleteValue("31/12/9999");
        expect(codeInputTest.getCompleteValue()).to.equal(253402214400);

        codeInputTest.setCompleteValue("10/02/2025");
        expect(codeInputTest.getCompleteValue()).to.equal(1739145600);

        codeInputTest.setCompleteValue("-01/00/0000");
        expect(codeInputTest.getCompleteValue()).to.equal(0);
    });

    it("devrait incrémenter les valeurs avec la molette de la souris", function () {
        const timeInputs = $element.find("input.month-input");

        // Incrémenter la dernière partie (date)
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

        expect(codeInputTest.getCompleteValue()).to.equal(2678400);

        // Décrémenter
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(5097600);


        // Incrémenter la dernière partie (date)
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: -1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(2678400);

    });


    it("devrait incrémenter les valeurs avec la molette de la souris et test au limite de la date ", function () {
        
        codeInputTest.setCompleteValue(253402214400);
        const timeInputs = $element.find("input.month-input");
        // Décrémenter
        timeInputs.first().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });
        expect(codeInputTest.getCompleteValue()).to.equal(253402214400);

    });


    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du haut pour les div au survole ", function() {

        codeInputTest.setCompleteValue(1739145600);

        const codeInputs = $('#element').find("input[id^='month_date_']");
        
        const topDivs = $("div[id^='month_date_'][id*='_div_top_']");

        topDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal(1736467200);          
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du bas pour les div au survole ", function() {

        codeInputTest.setCompleteValue(1739145600);

        const codeInputs = $('#element').find("input[id^='month_date_']");
        
        const topDivs = $("div[id^='month_date_'][id*='_div_bottom_']");

        topDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            let event = new Event('click');
            div.dispatchEvent(event);

            event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal(1744243200);          
    });

});



