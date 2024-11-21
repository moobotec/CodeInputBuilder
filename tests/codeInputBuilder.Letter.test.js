

describe("CodeInputBuilder Plugin Tests avec type Letter", function() {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec le signe autorisé
        codeInputTest = $('#element').codeInputBuilder({
            type: 'letter',
            numInputs: numInputs,
            values: [0x00, 0xcd, 14, '0', 'µ'],
            minValues: [0x00, 0x00, 0x00, 0x00, 0x00],
            maxValues: [0xff, 0xff, 0xff, 0xff, 0xff],
            scrollSensitivity : 0.1
        });

        $element = $('#element');
    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function() {
        const value = codeInputTest.getCompleteValue();
        expect(value).to.equal('\u0000Í\u000e0µ');
    });

    it("devrait contenir les inputs de chiffres avec les attributs corrects", function() {
        
        for (let i = 1; i <= numInputs; i++) {
            // Sélection de l'input correspondant sans inclure le code aléatoire
            const digitInput = $element.find(`input.digits-input[name='digits${i}']`);

            // Vérification de l'ID sans dépendance au code aléatoire
            const digitIdPattern = new RegExp(`^digits_letter_[a-zA-Z0-9]+_input_${i}$`);
            expect(digitInput.length).to.equal(1);
            expect(digitInput.attr('id')).to.match(digitIdPattern);

            // Vérifications des attributs
            expect(digitInput.attr('type')).to.equal('text');
            expect(digitInput.hasClass('form-control')).to.be.true;
            expect(digitInput.hasClass('form-control-lg')).to.be.true;
            expect(digitInput.hasClass('text-center')).to.be.true;
            expect(digitInput.hasClass('cla-h2-like')).to.be.true;
            expect(digitInput.attr('maxlength')).to.equal('1');
            expect(digitInput.attr('data-min')).to.exist;
            expect(digitInput.attr('data-max')).to.exist;
            expect(digitInput.attr('aria-labelledby')).to.match(new RegExp(`^digits_letter_[a-zA-Z0-9]+_label_${i}$`));
            expect(digitInput.attr('aria-valuemin')).to.equal(digitInput.attr('data-min'));
            expect(digitInput.attr('aria-valuemax')).to.equal(digitInput.attr('data-max'));
            expect(digitInput.attr('aria-valuenow')).to.equal(digitInput.val());
            expect(digitInput.attr('role')).to.equal('spinbutton');
            expect(digitInput.prop('disabled')).to.be.false;
        }
    });

    it("devrait associer chaque input à un label avec un texte descriptif", function() {

        for (let i = 1; i <= numInputs; i++) {
            // Sélection du label correspondant sans inclure le code aléatoire
            const labelPattern = new RegExp(`^digits_letter_[a-zA-Z0-9]+_label_${i}$`);
            const label = $element.find(`label[for*='digits_letter_'][for*='_input_${i}']`);

            // Vérification de l'ID du label et du texte
            expect(label.length).to.equal(1);
            expect(label.attr('id')).to.match(labelPattern);
            expect(label.hasClass('sr-only')).to.be.true;
            expect(label.text()).to.equal(`Entrée ${i} pour letter`);
        }

    });

    it("devrait contenir les textes de survol (hover-text) au-dessus et en-dessous de chaque input", function() {

        for (let i = 1; i <= numInputs; i++) {
            // Vérification du texte de survol au-dessus
            const topText = $element.find(`[id^='digits_letter_'][id$='_div_top_${i}']`);
            const topTextPattern = new RegExp(`^digits_letter_[a-zA-Z0-9]+_div_top_${i}$`);
            expect(topText.length).to.equal(1);
            expect(topText.attr('id')).to.match(topTextPattern);
            expect(topText.hasClass('cla-hover-text')).to.be.true;

            // Vérification du texte de survol en-dessous
            const bottomText = $element.find(`[id^='digits_letter_'][id$='_div_bottom_${i}']`);
            const bottomTextPattern = new RegExp(`^digits_letter_[a-zA-Z0-9]+_div_bottom_${i}$`);
            expect(bottomText.length).to.equal(1);
            expect(bottomText.attr('id')).to.match(bottomTextPattern);
            expect(bottomText.hasClass('cla-hover-text')).to.be.true;

            // Cas spécifique pour masquer certains éléments (par exemple, le dernier)
            if (i === numInputs) {
                expect(topText.css('visibility')).to.equal('visible');
                expect(bottomText.css('visibility')).to.equal('visible');
            }
        }
    });

    it("devrait mettre à jour la valeur", function() {
        codeInputTest.setCompleteValue('aaaaa');
        expect(codeInputTest.getCompleteValue()).to.equal('aaaaa');

        codeInputTest.setCompleteValue(1);
        expect(codeInputTest.getCompleteValue()).to.equal(1); 

        codeInputTest.setCompleteValue(0);
        expect(codeInputTest.getCompleteValue()).to.equal(0); 

        codeInputTest.setCompleteValue('-5455');
        expect(codeInputTest.getCompleteValue()).to.equal('-5455'); 
    });

    it("devrait respecter les valeurs minimales et maximales", function() {
        codeInputTest.setCompleteValue('ÿÿÿÿÿ');
        expect(codeInputTest.getCompleteValue()).to.equal('ÿÿÿÿÿ');
        codeInputTest.setCompleteValue('ffffffffffff');
        expect(codeInputTest.getCompleteValue()).to.equal('fffff'); 
        codeInputTest.setCompleteValue('0000000'); 
        expect(codeInputTest.getCompleteValue()).to.equal('00000'); 
    });

    it("devrait incrémenter toutes les valeurs d'input en utilisant un signal keyup sur les div associées au survol", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue('00000');
    
        // Sélectionner les inputs et leurs divs associés
        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: '1', // Simule une touche spécifique
                keyCode: 97,
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });
    
        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('11111');

        // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` sur l'input
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'd', // Simule une touche spécifique (par exemple, flèche haut)
                keyCode: 68,
                bubbles: true,
                cancelable: true,
            });
            input.dispatchEvent(keyupEvent);
    
        });

        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('ddddd');

        codeInputTest.setCompleteValue('11111');

        // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'Delete', // Simule une touche spécifique
                keyCode: 46, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });

        expect(codeInputTest.getCompleteValue()).to.equal('\u0000\u0000\u0000\u0000\u0000');

        codeInputTest.setCompleteValue('11111');
    
        // Parcourir les divs pour simuler le survol et le keyup
        codeInputs.each((index, input) => {
            // Simuler un événement `mouseover` sur l'input associé
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent);
    
            // Simuler un événement `keyup` avec keyCode
            const keyupEvent = new KeyboardEvent('keyup', {
                key: 'Backspace', // Simule une touche spécifique
                keyCode: 8, 
                bubbles: true,
                cancelable: true,
            });

            input.dispatchEvent(keyupEvent);
    
        });
        expect(codeInputTest.getCompleteValue()).to.equal('\u0000\u0000\u0000\u0000\u0000');
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du haut pour les div au survole ", function() {

        codeInputTest.setCompleteValue('89abc');

        const codeInputs = $('#element').find("input[id^='digits_letter_']");
        
        const topDivs = $("div[id^='digits_letter_'][id*='_div_top_']");

        topDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal('78`ab');          
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du bas pour les div au survole ", function() {

        codeInputTest.setCompleteValue('89abc');

        const codeInputs = $('#element').find("input[id^='digits_letter_']");
        
        const bottomDivs = $("div[id^='digits_letter_'][id*='_div_bottom_']");

        bottomDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal('9:bcd');          
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function() {
        // Définir la valeur initiale du premier input

        codeInputTest.setCompleteValue('89abc');

        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {
            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal('9:bcd'); 
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant la molette vers le haut pour les digits ", function() {
        // Définir la valeur initiale du premier input
        codeInputTest.setCompleteValue('89abc');

        const codeInputs = $('#element').find("input[id^='digits_letter_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {
            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: -1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal('78`ab'); 
    });

    it("devrait tester tous les caractères de 0x00 à 0xFF pour chaque digit en utilisant la molette vers le haut", function () {
        // Boucle pour tester chaque combinaison de 5 digits avec des caractères de 0x00 à 0xFF
        for (let i = 0; i <= 0xFF; i++) {
            const char = String.fromCharCode(i); // Convertir le code en caractère
            const initialValue = char.repeat(5); // Générer une valeur initiale avec 5 mêmes caractères
            codeInputTest.setCompleteValue(initialValue); // Définir la valeur initiale
    
            const codeInputs = $('#element').find("input[id^='digits_letter_']");
    
            // Simuler l'événement de défilement vers le haut sur chaque input
            codeInputs.each((index, input) => {
                $(input).trigger({
                    type: 'wheel',
                    originalEvent: { deltaY: +1, preventDefault: function () {} } // Défilement vers le bas
                });
            });
    
            const nextCharCode = Math.min(i + 1, 0xFF); // S'assurer que la valeur ne dépasse pas 0xFF
            const nextChar = String.fromCharCode(nextCharCode); // Caractère attendu
            const expectedValue = nextChar.repeat(5); // Générer la valeur attendue avec 5 mêmes caractères
    
            // Vérifier la valeur résultante
            expect(codeInputTest.getCompleteValue()).to.equal(expectedValue);
        }
    });
   
});