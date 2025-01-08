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

        codeInputTest.setCompleteValue("12:00:00 AM");
        expect(codeInputTest.getCompleteValue()).to.equal(0);

        codeInputTest.setCompleteValue("01:02:25 PM");
        expect(codeInputTest.getCompleteValue()).to.equal(46945);

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


describe("CodeInputBuilder Plugin Tests avec type Time (avec millisecondes) au format 12h", function () {
    let codeInputTest;

    beforeEach(function () {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin pour le type time avec millisecondes
        codeInputTest = $('#element').codeInputBuilder({
            type: 'time',
            formatTime: 'HH:MM:SS',
            hourCycle: '12h',
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
        const timeParts = ['HH', 'MM', 'SS'];
        let inputIndex = 1;

        for (const part of timeParts) {
            for (let i = 0; i < part.length; i++) {
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

    it("devrait contenir l'input pour le system time avec les attributs et classes corrects", function() {
        const systimeInput = $element.find('input.systime-input');

        // Vérification de l'ID sans dépendance à la partie aléatoire
        const sysTimeIdPattern = /^systime_time_[a-zA-Z0-9]+_input_systime$/;
        expect(systimeInput.length).to.equal(1);
        expect(systimeInput.attr('id')).to.match(sysTimeIdPattern);

        // Vérifications des attributs et classes
        expect(systimeInput.attr('type')).to.equal('text');
        expect(systimeInput.hasClass('form-control')).to.be.true;
        expect(systimeInput.hasClass('form-control-lg')).to.be.true;
        expect(systimeInput.hasClass('text-center')).to.be.true;
        expect(systimeInput.hasClass('cla-h2-like')).to.be.true;
        expect(systimeInput.attr('maxlength')).to.equal('2');
        expect(systimeInput.attr('aria-valuenow')).to.equal('AM');
        expect(systimeInput.attr('role')).to.equal('spinbutton');
        expect(systimeInput.val()).to.equal('AM');
        expect(systimeInput.prop('disabled')).to.be.true;
    });


    it("devrait respecter les limites des valeurs de temps avec millisecondes", function () {
        codeInputTest.setCompleteValue("23:59:59");
        expect(codeInputTest.getCompleteValue()).to.equal(86399);

        codeInputTest.setCompleteValue("24:00:00");
        expect(codeInputTest.getCompleteValue()).to.equal(43200);

        codeInputTest.setCompleteValue("-01:00:00");
        expect(codeInputTest.getCompleteValue()).to.equal(0);


        codeInputTest.setCompleteValue("01:02:25 AM");
        expect(codeInputTest.getCompleteValue()).to.equal(3745);

        codeInputTest.setCompleteValue("01:02:25 PM");
        expect(codeInputTest.getCompleteValue()).to.equal(46945);

        codeInputTest.setCompleteValue(new Date(Date.UTC(1970, 0, 1, 15, 34, 55, 20)));
        expect(codeInputTest.getCompleteValue()).to.equal(56095);

    });

    it("devrait mettre à jour correctement les valeurs de temps avec millisecondes", function () {
        codeInputTest.setCompleteValue("12:34:56");
        expect(codeInputTest.getCompleteValue()).to.equal(45296); 

        codeInputTest.setCompleteValue("01:02:03");
        expect(codeInputTest.getCompleteValue()).to.equal(3723);
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

        expect(codeInputTest.getCompleteValue()).to.equal(1);

        // Décrémenter
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(2);


        // Incrémenter la dernière partie (millisecondes)
        timeInputs.last().trigger({
            type: 'wheel',
            originalEvent: { deltaY: -1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(1);

    });


    it("devrait incrémenter toutes les valeurs d'input en utilisant un signal keyup ", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue("01:34:55");
    
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
        expect(codeInputTest.getCompleteValue()).to.equal(1342);

    });

    it("devrait changer la valeur correctement ", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue(new Date(Date.UTC(1970, 0, 1, 1, 34, 55, 20)));
        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal(5695);
    });

    it("devrait incrémenter les valeurs avec la molette de la souris et test au limite du time ", function () {
        
        codeInputTest.setCompleteValue(71999);
        
        const timeInputs = $element.find("input.digits-input");

        // Décrémenter
        timeInputs.first().trigger({
            type: 'wheel',
            originalEvent: { deltaY: 1, preventDefault: function () {} },
        });

        expect(codeInputTest.getCompleteValue()).to.equal(46799);

    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour le system time ", function() {
        // Définir la valeur initiale du premier input
        codeInputTest.setCompleteValue(4585);
        const codeInputTestSysTime = $('#element').find('input').eq(0);
        // Simuler l'événement de défilement vers le haut sur le premier input qui est le system time
        codeInputTestSysTime.trigger({
            type: 'wheel',
            originalEvent: { deltaY: +1 , preventDefault: function() {} } // Défilement vers le bas
            
        });
        expect(codeInputTest.getCompleteValue()).to.equal(47785); 
    });

    it("devrait changer la valeur du system time en utilisant le click du bas pour les div au survole ", function() {

        codeInputTest.setCompleteValue(5695);

        const codeInputs = $('#element').find("input[id^='systime_time_']");
        
        const bottomDivs = $("div[id^='systime_time_'][id*='_div_bottom_']");

        bottomDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal(48895);          
    });


    it("devrait changer la valeur du system time en utilisant la molette vers le bas pour les digits ", function() {
        // Définir la valeur initiale du premier input

        codeInputTest.setCompleteValue(4585);

        const codeInputs = $('#element').find("input[id^='systime_time_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent);

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal(47785); 
    });

    it("devrait changer la valeur du system time en utilisant la molette vers le haut pour les digits ", function() {
        // Définir la valeur initiale du premier input

        codeInputTest.setCompleteValue(47785);

        const codeInputs = $('#element').find("input[id^='systime_time_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent);

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: -1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal(4585); 
    });


    it("devrait déclencher les événements mouseenter et mouseleave", function () {

        codeInputTest.setCompleteValue(47785);

        const codeInputs = $('#element').find("input[id^='systime_time_']");

        // Vérification du texte de survol au-dessus
        const topText = $('#element').find(`[id^='systime_time_'][id$='_div_top_systime']`);
        const topTextPattern = new RegExp(`^systime_time_[a-zA-Z0-9]+_div_top_systime`);
        expect(topText.length).to.equal(1);
        expect(topText.attr('id')).to.match(topTextPattern);
        expect(topText.hasClass('cla-hover-text')).to.be.true;

        // Vérification du texte de survol en-dessous
        const bottomText = $element.find(`[id^='systime_time_'][id$='_div_bottom_systime']`);
        const bottomTextPattern = new RegExp(`^systime_time_[a-zA-Z0-9]+_div_bottom_systime$`);
        expect(bottomText.length).to.equal(1);
        expect(bottomText.attr('id')).to.match(bottomTextPattern);
        expect(bottomText.hasClass('cla-hover-text')).to.be.true;
              
        $(codeInputs[0]).trigger('mouseenter');

        expect(topText.css('visibility')).to.equal('visible');
        expect(bottomText.css('visibility')).to.equal('hidden');
        
        $(codeInputs[0]).trigger('mouseleave');
      
        expect(topText.css('visibility')).to.equal('hidden');
        expect(bottomText.css('visibility')).to.equal('hidden');
        
    });


    it("devrait changer la valeur du system d'heure", function() {

        const codeInputs = $('#element').find("input[id^='systime_time_']");

        expect(codeInputs.parent().parent().css('display')).to.equal('block');

        let previous = codeInputTest.getCompleteValue();
        
        codeInputTest.changeHourCycle('24h');

        expect(codeInputTest.getCompleteValue()).to.equal(previous); 
        
        expect(codeInputs.parent().parent().css('display')).to.equal('none');

        previous = codeInputTest.getCompleteValue();

        codeInputTest.changeHourCycle('12h');

        expect(codeInputTest.getCompleteValue()).to.equal(previous); 

        expect(codeInputs.parent().parent().css('display')).to.equal('block');
        
    });

    it("devrait lancer une erreur si 'hoursCycle' est vide", function() {
        expect(() => {
            codeInputTest.changeHourCycle(null);
        }).to.throw("Parameter 'hourCycle' n'est pas définie. Valeur par défaut utilisée : '24h'.");
    });

    it("devrait lancer une erreur si 'hoursCycle' doit un string", function() {
        expect(() => {
            codeInputTest.changeHourCycle(10);
        }).to.throw("Parameter 'hourCycle' doit être une chaîne de caractères ('24h' ou '12h').");
    });

    it("devrait lancer une erreur si 'hoursCycle' doit etre soit 24h ou 12h", function() {
        expect(() => {
            codeInputTest.changeHourCycle("13h");
        }).to.throw("Parameter 'hourCycle' doit être une des valeurs suivantes : 24h, 12h.");
    });

});