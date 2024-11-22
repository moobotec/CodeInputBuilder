const sinon = require('sinon');

describe("CodeInputBuilder Plugin Tests Other", function () {
    let codeInputTest;
    const numInputs = 5;

    window.TEST_MODE = true;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Ajouter les conteneurs pour afficher les valeurs
        $('body').append('<div id="changeValueDisplayInteger"></div>');
        $('body').append('<div id="completeValueDisplayInteger"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'letter',
            numInputs: numInputs,
            values: [0x00, 0xcd, 14, '0', 'µ'],
            minValues: [0x00, 0x00, 0x00, 0x00, 0x00],
            maxValues: [0xff, 0xff, 0xff, 0xff, 0xff],
            scrollSensitivity : 0.1,
            allowArrowKeys: true,
            onValueChange: function ($input, newValue) {

                if ($input != null)
                {
                    // Affichage de la valeur de l'input modifié
                    $('#changeValueDisplayInteger').text(
                        `Input ${$input.attr('id')} a changé de valeur : ${newValue}`
                    );
                }

                // Met à jour l'affichage de la valeur complète
                const completeCode = codeInputTest.getCompleteValue();
                $('#completeValueDisplayInteger').text(
                    `Valeur actuelle : ${completeCode}`
                );
            },
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
        $('#changeValueDisplayInteger').remove();
        $('#completeValueDisplayInteger').remove();
    });

    it("devrait appeler onValueChange et mettre à jour l'affichage des valeurs", function () {
        

        codeInputTest.setCompleteValue('AAAAA');

        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[0].dispatchEvent(hoverEvent);

        $(codeInputs[0]).trigger({
            type: 'wheel',
            originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
        });

        // Vérifier que le texte de #completeValueDisplayInteger est correctement mis à jour
        let completeValue = codeInputTest.getCompleteValue();

        // Vérifier que le texte de #changeValueDisplayInteger est correctement mis à jour
        expect($('#changeValueDisplayInteger').text()).to.equal(
            `Input ${$(codeInputs[0]).attr('id')} a changé de valeur : ${completeValue}`
        );

        expect($('#completeValueDisplayInteger').text()).to.equal(
            `Valeur actuelle : ${completeValue}`
        );

        codeInputTest.setCompleteValue('JJJJJ',true);

         // Vérifier que le texte de #completeValueDisplayInteger est correctement mis à jour
        completeValue = codeInputTest.getCompleteValue();

        expect($('#completeValueDisplayInteger').text()).to.equal(
            `Valeur actuelle : ${completeValue}`
        );
    });

    it("devrait permettre d'incrémenter et décrémenter les valeurs avec les flèches Haut et Bas", function () {
        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        codeInputTest.setCompleteValue('AAAAA');

         // Parcourir les divs pour simuler le survol et le keyup
         codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'ArrowDown', // Simule une touche spécifique
                keyCode: 40, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });

        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('BBBBB');

        // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'ArrowUp', // Simule une touche spécifique
                keyCode: 38, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });


       // Vérification de la valeur finale
       expect(codeInputTest.getCompleteValue()).to.equal('AAAAA');

    });


    it("devrait permettre de déplacer de droite à gauche sur les input avec les flèches Droite et Gauche", function () {
        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        codeInputTest.setCompleteValue('AAAAA');

        // Simuler un événement `mouseover` sur l'input associé
        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[0].dispatchEvent(hoverEvent);

        // Créer l'événement `click`
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // Déclencher l'événement sur l'input
        codeInputs[0].dispatchEvent(clickEvent);
        codeInputs[0].focus();

        expect(document.activeElement).to.equal(codeInputs[0]);

        // Simuler un événement `keyup` avec keyCode
        let keyupEvent = new KeyboardEvent('keyup', {
            key: 'ArrowLeft', // Simule une touche spécifique
            keyCode: 37, 
            bubbles: true,
            cancelable: true,
        });

        codeInputs[0].dispatchEvent(keyupEvent);

        // Vérifier si l'input suivant (dans ce cas l'input à gauche) a reçu le focus
        const previousInput = codeInputs[codeInputs.length - 1];
        expect(document.activeElement).to.equal(previousInput);

         // Simuler un événement `keyup` avec keyCode
        keyupEvent = new KeyboardEvent('keyup', {
            key: 'ArrowRight', // Simule une touche spécifique
            keyCode: 39, 
            bubbles: true,
            cancelable: true,
        });

        codeInputs[codeInputs.length - 1].dispatchEvent(keyupEvent);

        // Vérifier si l'input suivant (dans ce cas l'input à droite) a reçu le focus
        const nextInput = codeInputs[0]; 
        expect(document.activeElement).to.equal(nextInput);
    });

    it("ne devrait rien faire lors de l'appui sur CTRL+C", function () {
        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        codeInputTest.setCompleteValue('AAAAA');

        // Simuler un événement `mouseover` sur l'input associé
        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[0].dispatchEvent(hoverEvent);

        // Simuler un événement `keyup` avec keyCode
        let keyupEvent = new KeyboardEvent('keyup', {
            ctrlKey : true,
            key: 'c', // Simule une touche spécifique
            keyCode: 67, 
            bubbles: true,
            cancelable: true,
        });

        codeInputs[0].dispatchEvent(keyupEvent);
          
        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('AAAAA');

         // Simuler un événement `keyup` avec keyCode
        keyupEvent = new KeyboardEvent('keyup', {
            ctrlKey : true,
            key: 'CTRL+C', // Simule une touche spécifique
            keyCode: 67, 
            bubbles: true,
            cancelable: true,
        });

        codeInputs[0].dispatchEvent(keyupEvent);

        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('AAAAA');
    });

    it("ne devrait rien faire lors de l'appui sur CTRL+V", function () {
        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        codeInputTest.setCompleteValue('AAAAA');

        // Simuler un événement `mouseover` sur l'input associé
        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[0].dispatchEvent(hoverEvent);

        // Simuler un événement `keyup` avec keyCode
        let keyupEvent = new KeyboardEvent('keyup', {
            ctrlKey : true,
            key: 'v', // Simule une touche spécifique
            keyCode: 67, 
            bubbles: true,
            cancelable: true,
        });

        codeInputs[0].dispatchEvent(keyupEvent);
          
        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('AAAAA');

         // Simuler un événement `keyup` avec keyCode
        keyupEvent = new KeyboardEvent('keyup', {
            ctrlKey : true,
            key: 'CTRL+V', // Simule une touche spécifique
            keyCode: 86, 
            bubbles: true,
            cancelable: true,
        });

        codeInputs[0].dispatchEvent(keyupEvent);

        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('AAAAA');
    });

    it("cas aux limites dans setCompleteValue", function () {
        
        expect(() => {
            codeInputTest.setCompleteValue(undefined);
        }).to.throw('Une valeur doit être renseignée.');

        expect(() => {
            codeInputTest.setCompleteValue(null);
        }).to.throw('Une valeur doit être renseignée.');


    });

});

describe("calculatePeripheralDisplay cas aux limites", function () {

    let inputElementMock;

    beforeEach(function () {
        inputElementMock = $('<input>').attr('id', 'test-input');
        $('body').append(inputElementMock);
    });

    afterEach(function () {
        inputElementMock.remove();
    });


    it("devrait retourner des valeurs par défaut si hover !== gIdHover", function () {
        
        const instance = $('#element').codeInputBuilder();
        
        const result = instance.calculatePeripheralDisplay('digits', 'id', 0, null, 'wrong_hover');

        expect(result).to.eql({
            index: -1,
            showTop: false,
            showBottom: false,
            adjustedValueTop: 0,
            adjustedValueBottom: 0,
        });
    });


    it("devrait retourner des valeurs par défaut pour un préfixe inconnu", function () {

        const instance = $('#element').codeInputBuilder();
        instance.setHoverId('test_hover_value');

        const result = instance.calculatePeripheralDisplay("unknown_prefix", "some_id", 0, inputElementMock, "test_hover_value");

        expect(result).to.eql({
            index: -1,
            showTop: false,
            showBottom: false,
            adjustedValueTop: 0,
            adjustedValueBottom: 0,
        });
    });

});

describe("CodeInputBuilder Plugin Tests FocusNextInput - Forward", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'letter',
            numInputs: numInputs,
            values: [0x00, 0xcd, 14, '0', 'µ'],
            minValues: [0x00, 0x00, 0x00, 0x00, 0x00],
            maxValues: [0xff, 0xff, 0xff, 0xff, 0xff],
            autoFocusNextInput : true,
            autoFocusNextInputDirection : 'Forward'
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait decaler le focus sur l'input suivant", function () {
        
        codeInputTest.setCompleteValue('AAAAA');

        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        // Simuler un événement `mouseover` sur l'input associé
        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[0].dispatchEvent(hoverEvent);

        // Créer l'événement `click`
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // Déclencher l'événement sur l'input
        codeInputs[0].dispatchEvent(clickEvent);
        codeInputs[0].focus();

        expect(document.activeElement).to.equal(codeInputs[0]);

        // Simuler un événement `keyup` avec keyCode
        const keyupEvent = new KeyboardEvent('keyup', {
            key: '1', // Simule une touche spécifique
            keyCode: 97,
            bubbles: true,
            cancelable: true,
        });

        codeInputs[0].dispatchEvent(keyupEvent);

        expect(document.activeElement).to.equal(codeInputs[1]);

    });

});

describe("CodeInputBuilder Plugin Tests FocusNextInput - Backward", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'letter',
            numInputs: numInputs,
            values: [0x00, 0xcd, 14, '0', 'µ'],
            minValues: [0x00, 0x00, 0x00, 0x00, 0x00],
            maxValues: [0xff, 0xff, 0xff, 0xff, 0xff],
            autoFocusNextInput : true,
            autoFocusNextInputDirection : 'Backward'
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait decaler le focus sur l'input précédent", function () {
        
        codeInputTest.setCompleteValue('AAAAA');

        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        // Simuler un événement `mouseover` sur l'input associé
        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[1].dispatchEvent(hoverEvent);

        // Créer l'événement `click`
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // Déclencher l'événement sur l'input
        codeInputs[1].dispatchEvent(clickEvent);
        codeInputs[1].focus();

        expect(document.activeElement).to.equal(codeInputs[1]);

        // Simuler un événement `keyup` avec keyCode
        const keyupEvent = new KeyboardEvent('keyup', {
            key: '1', // Simule une touche spécifique
            keyCode: 97,
            bubbles: true,
            cancelable: true,
        });

        codeInputs[1].dispatchEvent(keyupEvent);

        expect(document.activeElement).to.equal(codeInputs[0]);

    });
});

describe("CodeInputBuilder Plugin Tests Other integer Arrow", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            scrollSensitivity : 0.1,
            allowArrowKeys: true,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre d'incrémenter et décrémenter les valeurs avec les flèches Haut et Bas", function () {
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        codeInputTest.setCompleteValue('00000');

         // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'ArrowDown', // Simule une touche spécifique
                keyCode: 40, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });
        
        expect(codeInputTest.getCompleteValue()).to.equal(11111);

         // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'ArrowUp', // Simule une touche spécifique
                keyCode: 38, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });

        expect(codeInputTest.getCompleteValue()).to.equal(0);

    });

});

describe("CodeInputBuilder Plugin Tests Other hexadecimal Arrow", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'hexadecimal',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [0x0f, 0x0f, 0x0f, 0x0f, 0x0f],
            scrollSensitivity : 0.1,
            allowArrowKeys: true,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre d'incrémenter et décrémenter les valeurs avec les flèches Haut et Bas", function () {
        const codeInputs = $('#element').find("input[id^='digits_hexadecimal_']");

        codeInputTest.setCompleteValue('00000');

         // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'ArrowDown', // Simule une touche spécifique
                keyCode: 40, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });

        expect(codeInputTest.getCompleteValue()).to.equal('11111');

         // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'ArrowUp', // Simule une touche spécifique
                keyCode: 38, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });

        expect(codeInputTest.getCompleteValue()).to.equal('00000');

    });
});

describe("CodeInputBuilder Plugin Tests Other Tab", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            scrollSensitivity : 0.1
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre de permettre le tab donc le changement de focus", function () {
       
        codeInputTest.setCompleteValue('00000');

        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler un événement `mouseover` sur l'input associé
        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[0].dispatchEvent(hoverEvent);

        // Créer l'événement `click`
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // Déclencher l'événement sur l'input
        codeInputs[0].dispatchEvent(clickEvent);
        codeInputs[0].focus();

        expect(document.activeElement).to.equal(codeInputs[0]);

        // Simuler un événement `keyup` avec keyCode
        const keyupEvent = new KeyboardEvent('keyup', {
            key: 'Tab', // Simule une touche spécifique
            keyCode: 9,
            bubbles: true,
            cancelable: true,
        });

        codeInputs[0].dispatchEvent(keyupEvent);

        expect(document.activeElement).to.equal(codeInputs[0]);

    });

});

describe("CodeInputBuilder Plugin Tests hover div Text", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            scrollSensitivity : 0.1
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre de permettre le tab donc le changement de focus", function () {
       
        codeInputTest.setCompleteValue('11111');

        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler un événement `mouseover` sur l'input associé
        const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
        codeInputs[0].dispatchEvent(hoverEvent);

        // Créer l'événement `click`
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
        });

        // Déclencher l'événement sur l'input
        codeInputs[0].dispatchEvent(clickEvent);
        codeInputs[0].focus();

        expect(document.activeElement).to.equal(codeInputs[0]);

        // Vérification du texte de survol au-dessus
        const topText = $('#element').find(`[id^='digits_integer_'][id$='_div_top_1']`);
        const topTextPattern = new RegExp(`^digits_integer_[a-zA-Z0-9]+_div_top_1`);
        expect(topText.length).to.equal(1);
        expect(topText.attr('id')).to.match(topTextPattern);
        expect(topText.hasClass('cla-hover-text')).to.be.true;
 
        // Vérification du texte de survol en-dessous
        const bottomText = $('#element').find(`[id^='digits_integer_'][id$='_div_bottom_1']`);
        const bottomTextPattern = new RegExp(`^digits_integer_[a-zA-Z0-9]+_div_bottom_1$`);
        expect(bottomText.length).to.equal(1);
        expect(bottomText.attr('id')).to.match(bottomTextPattern);
        expect(bottomText.hasClass('cla-hover-text')).to.be.true;

        expect(topText.css('visibility')).to.equal('visible');
        expect(bottomText.css('visibility')).to.equal('visible');

        $(codeInputs[0]).trigger('mouseleave');
        topText.trigger('mouseenter');
        
        expect(topText.css('visibility')).to.equal('visible');
        expect(bottomText.css('visibility')).to.equal('hidden');
        
        topText.trigger('mouseleave');
      
        expect(topText.css('visibility')).to.equal('hidden');
        expect(bottomText.css('visibility')).to.equal('hidden');


        $(codeInputs[0]).trigger('mouseenter');

        expect(topText.css('visibility')).to.equal('visible');
        expect(bottomText.css('visibility')).to.equal('visible');

        $(codeInputs[0]).trigger('mouseleave');
        bottomText.trigger('mouseenter');

        expect(topText.css('visibility')).to.equal('hidden');
        expect(bottomText.css('visibility')).to.equal('visible');
        
        bottomText.trigger('mouseleave');
      
        expect(topText.css('visibility')).to.equal('hidden');
        expect(bottomText.css('visibility')).to.equal('hidden');

    });

});


describe("CodeInputBuilder Plugin Tests Other setdigit , getdigit", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre de changer la valeur d'un digit en fixant directement sa valeur", function () {
       
        expect(() => {
            codeInputTest.setDigitAt(null,5);
        }).to.throw('Un index doit être renseignée.');

        expect(() => {
            codeInputTest.setDigitAt(1000,5);
        }).to.throw('L\'index est en dehors de la plage.');

      
        codeInputTest.setCompleteValue(0);
        for (let i = 0; i < numInputs; i++) {
            codeInputTest.setDigitAt(i,9);
        }
        expect(codeInputTest.getCompleteValue()).to.equal(99999);

    });

    it("devrait permettre de recuperer la valeur d'un digit suivant un index en particulier", function () {
       
        const codeInputs = $('#element').find("input[id^='digits_integer_']");
       
        expect(() => {
            codeInputTest.getDigitAt(null);
        }).to.throw('Un index doit être renseignée.');

        expect(() => {
            codeInputTest.getDigitAt(1000);
        }).to.throw('L\'index est en dehors de la plage.');

        codeInputTest.setCompleteValue(12345);
        
        for (let i = 0; i < numInputs; i++) {
            const currentValue = codeInputTest.getDigitAt(i);
            expect($(codeInputs[i]).val()).to.equal(currentValue.toString());
        }
    });
  
});


describe("CodeInputBuilder Plugin Tests Letter setdigit , getdigit", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'text',
            values: ['Lorem', 'Consectetur', 'Eiusmod', 'Nulla', 'Vestibulum', 'Sollicitudin'],
            defaultValue : 0,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("ne devrait pas accpeter l'accès à ces deux fonction", function () {
       
        expect(() => {
            codeInputTest.setDigitAt(0,'Consectetur');
        }).to.throw('settings.type non disponible avec la fonction setDigitAt.');

        expect(() => {
            codeInputTest.getDigitAt(0);
        }).to.throw('settings.type non disponible avec la fonction getDigitAt.');

    });
  
});


describe("CodeInputBuilder Plugin Tests Other init isDisbled = true et toggleInputs", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            isDisabled : true, 
            scrollSensitivity : 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    
    it("ne devrait pas incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function () {
        codeInputTest.setCompleteValue('11111');
        expect(codeInputTest.getCompleteValue()).to.equal(11111);
   
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });


        expect(codeInputTest.getCompleteValue()).to.equal(11111); 

        codeInputTest.toggleInputs(false);

         // Simuler l'événement de défilement vers le haut sur chaque input correspondant
         codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal(22222); 

        codeInputTest.toggleInputs(true);
     
    });


    it("ne devrait pas incrémenter la valeur du premier champ d'input en utilisant la molette vers le haut pour les digits ", function () {
        codeInputTest.setCompleteValue('11111');
        expect(codeInputTest.getCompleteValue()).to.equal(11111);
   
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: -1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal(11111); 
     
        codeInputTest.toggleInputs(false);

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {
           $(input).trigger({
               type: 'wheel',
               originalEvent: { deltaY: -1, preventDefault: function() {} } // Défilement vers le bas
           });
       });

       expect(codeInputTest.getCompleteValue()).to.equal(0); 

       codeInputTest.toggleInputs(true);

    });


});


describe("CodeInputBuilder Plugin Tests Hexadecimal setdigit", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'hexadecimal',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [0x0f, 0x0f, 0x0f, 0x0f, 0x0f],
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre de changer la valeur d'un digit en fixant directement sa valeur", function () {
       
        codeInputTest.setCompleteValue(0);
        codeInputTest.setDigitAt(0,'f');
        expect(codeInputTest.getCompleteValue()).to.equal('f0000');

    });

});

describe("CodeInputBuilder Plugin Tests letter setdigit ", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'letter',
            numInputs: numInputs,
            values: ['A', '2', '0', '0', '0'],
            minValues: [0x00, 0x00, 0x00, 0x00, 0x00],
            maxValues: [0xff, 0xff, 0xff, 0xff, 0xff],
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre de changer la valeur d'un digit en fixant directement sa valeur", function () {
       
        codeInputTest.setDigitAt(0,'K');
        expect(codeInputTest.getCompleteValue()).to.equal('K2000');

    });

});

describe("CodeInputBuilder Plugin Tests letter copy ", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'letter',
            numInputs: numInputs,
            values: ['A', '2', '0', '0', '0'],
            minValues: [0x00, 0x00, 0x00, 0x00, 0x00],
            maxValues: [0xff, 0xff, 0xff, 0xff, 0xff],
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    it("devrait permettre de changer la valeur d'un digit en copiant ça valeur sa valeur", function () {
            
        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        // Créer un événement personnalisé "paste"
        const pasteEvent = new ClipboardEvent('paste', {
            bubbles: true,
            cancelable: true,
            clipboardData: new DataTransfer(), // Fournir des données au presse-papiers
        });

        // Ajouter des données au presse-papiers (simulé)
        pasteEvent.clipboardData.setData('text/plain', 'G');

        // Déclencher l'événement sur l'élément
        codeInputs[0].dispatchEvent(pasteEvent);

        expect(codeInputTest.getCompleteValue()).to.equal('G2000');

        pasteEvent.clipboardData.setData('text/plain', 'LOLLLLL');

        // Déclencher l'événement sur l'élément
        codeInputs[0].dispatchEvent(pasteEvent);

        expect(codeInputTest.getCompleteValue()).to.equal('L2000');
    });

    it("devrait permettre copier la valeur d'un digit", function () {
            
        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        // Sélectionner le texte à copier
        codeInputs[0].focus();
        codeInputs[0].select(); // Sélectionne tout le texte

        const clipboardSpy = sinon.stub(navigator.clipboard, 'writeText').resolves();

        // Créer un événement personnalisé "paste"
        const copyEvent = new ClipboardEvent('copy', {
            bubbles: true,
            cancelable: true,
            clipboardData: new DataTransfer(), // Fournir des données au presse-papiers
        });

        codeInputs[0].dispatchEvent(copyEvent);

        // Vérifier que le texte a bien été copié
        sinon.assert.calledOnceWithExactly(clipboardSpy, 'A');
      
        // Nettoyer
        clipboardSpy.restore();

    });

});

describe("CodeInputBuilder Plugin Tests Other init isKeyRequiredForScroll control", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            requireKeyForScroll : 'Control', 
            scrollSensitivity : 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    
    it("ne devrait pas incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function () {
        codeInputTest.setCompleteValue('11111');
        expect(codeInputTest.getCompleteValue()).to.equal(11111);
   
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });


        expect(codeInputTest.getCompleteValue()).to.equal(11111); 

    });
});

describe("CodeInputBuilder Plugin Tests Other init isKeyRequiredForScroll Shift", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            requireKeyForScroll : 'Shift', 
            scrollSensitivity : 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    
    it("ne devrait pas incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function () {
        codeInputTest.setCompleteValue('11111');
        expect(codeInputTest.getCompleteValue()).to.equal(11111);
   
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });


        expect(codeInputTest.getCompleteValue()).to.equal(11111); 

    });
});

describe("CodeInputBuilder Plugin Tests Other init isKeyRequiredForScroll Alt", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            requireKeyForScroll : 'Alt', 
            scrollSensitivity : 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    
    it("ne devrait pas incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function () {
        codeInputTest.setCompleteValue('11111');
        expect(codeInputTest.getCompleteValue()).to.equal(11111);
   
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });


        expect(codeInputTest.getCompleteValue()).to.equal(11111); 

    });
});

describe("CodeInputBuilder Plugin Tests Other init isKeyRequiredForScroll Meta", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            requireKeyForScroll : 'Meta', 
            scrollSensitivity : 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    
    it("ne devrait pas incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function () {
        codeInputTest.setCompleteValue('11111');
        expect(codeInputTest.getCompleteValue()).to.equal(11111);
   
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });


        expect(codeInputTest.getCompleteValue()).to.equal(11111); 

    });
});



describe("CodeInputBuilder Plugin Tests Other init calculateDelta", function () {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function () {
        // Ajouter le conteneur pour le plugin
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec les options fournies
        codeInputTest = $('#element').codeInputBuilder({
            type: 'integer',
            numInputs: numInputs,
            values: [0, 0, 0, 0, 0],
            minValues: [0, 0, 0, 0, 0],
            maxValues: [9, 9, 9, 9, 9],
            scrollSensitivity : 0.1,
        });

        $element = $('#element');
    });

    afterEach(function () {
        // Supprimer les conteneurs après chaque test
        $('#element').remove();
    });

    
    it("ne devrait pas incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function () {
        codeInputTest.setCompleteValue('11111');
        expect(codeInputTest.getCompleteValue()).to.equal(11111);
   
        const codeInputs = $('#element').find("input[id^='digits_integer_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { wheelDelta: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal(22222); 


        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: {preventDefault: function() {} } // Défilement vers le bas
            });
        });


        expect(codeInputTest.getCompleteValue()).to.equal(22222);

    });
});

