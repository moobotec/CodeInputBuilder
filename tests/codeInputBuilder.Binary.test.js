describe("CodeInputBuilder Plugin Tests avec type Binary", function() {
    let codeInputTest;
    const numInputs = 5;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec le signe autorisé
        codeInputTest = $('#element').codeInputBuilder({
            type: 'binary',
            numInputs: numInputs,
            values: [0x00, 0x01, 0x00, 0x01, 0x00],
            scrollSensitivity : 0.1,
        });

        $element = $('#element');

    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function() {
        const value = codeInputTest.getCompleteValue();
        expect(value).to.equal('01010');
    });

    it("devrait contenir les inputs de chiffres avec les attributs corrects", function() {
        
        for (let i = 1; i <= numInputs; i++) {
            // Sélection de l'input correspondant sans inclure le code aléatoire
            const digitInput = $element.find(`input.digits-input[name='digits${i}']`);

            // Vérification de l'ID sans dépendance au code aléatoire
            const digitIdPattern = new RegExp(`^digits_binary_[a-zA-Z0-9]+_input_${i}$`);
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
            expect(digitInput.attr('aria-labelledby')).to.match(new RegExp(`^digits_binary_[a-zA-Z0-9]+_label_${i}$`));
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
            const labelPattern = new RegExp(`^digits_binary_[a-zA-Z0-9]+_label_${i}$`);
            const label = $element.find(`label[for*='digits_binary_'][for*='_input_${i}']`);

            // Vérification de l'ID du label et du texte
            expect(label.length).to.equal(1);
            expect(label.attr('id')).to.match(labelPattern);
            expect(label.hasClass('sr-only')).to.be.true;
            expect(label.text()).to.equal(`Entrée ${i} pour binary`);
        }

    });

    it("devrait contenir les textes de survol (hover-text) au-dessus et en-dessous de chaque input", function() {

        for (let i = 1; i <= numInputs; i++) {
            // Vérification du texte de survol au-dessus
            const topText = $element.find(`[id^='digits_binary_'][id$='_div_top_${i}']`);
            const topTextPattern = new RegExp(`^digits_binary_[a-zA-Z0-9]+_div_top_${i}$`);
            expect(topText.length).to.equal(1);
            expect(topText.attr('id')).to.match(topTextPattern);
            expect(topText.hasClass('cla-hover-text')).to.be.true;

            // Vérification du texte de survol en-dessous
            const bottomText = $element.find(`[id^='digits_binary_'][id$='_div_bottom_${i}']`);
            const bottomTextPattern = new RegExp(`^digits_binary_[a-zA-Z0-9]+_div_bottom_${i}$`);
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
        codeInputTest.setCompleteValue(11001);
        expect(codeInputTest.getCompleteValue()).to.equal('11001');

        codeInputTest.setCompleteValue(1);
        expect(codeInputTest.getCompleteValue()).to.equal('1'); 

        codeInputTest.setCompleteValue(0);
        expect(codeInputTest.getCompleteValue()).to.equal('0'); 

        codeInputTest.setCompleteValue('0b00001110');
        expect(codeInputTest.getCompleteValue()).to.equal('01110');
    });

    it("devrait respecter les valeurs minimales et maximales", function() {
        codeInputTest.setCompleteValue(11111111);
        expect(codeInputTest.getCompleteValue()).to.equal('11111');
        codeInputTest.setCompleteValue('11111111');
        expect(codeInputTest.getCompleteValue()).to.equal('11111'); 
        codeInputTest.setCompleteValue('0000000'); 
        expect(codeInputTest.getCompleteValue()).to.equal('00000'); 

        expect(() => {
            codeInputTest.setCompleteValue(-111111);
        }).to.throw("La valeur doit être un nombre binaire (composé uniquement de 0 et 1).");

    });

    it("devrait incrémenter toutes les valeurs d'input en utilisant un signal keyup sur les div associées au survol", function () {
        // Initialiser la valeur complète
        codeInputTest.setCompleteValue('00000');
    
        // Sélectionner les inputs et leurs divs associés
        const codeInputs = $('#element').find("input[id^='digits_binary_']");

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
                bubbles: true,
                cancelable: true,
            });
            input.dispatchEvent(keyupEvent);
    
        });

        // Vérification de la valeur finale
        expect(codeInputTest.getCompleteValue()).to.equal('00000');

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

        expect(codeInputTest.getCompleteValue()).to.equal('00000');

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
        expect(codeInputTest.getCompleteValue()).to.equal('00000');
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du haut pour les div au survole ", function() {

        codeInputTest.setCompleteValue('11111');

        const codeInputs = $('#element').find("input[id^='digits_binary_']");
        
        const topDivs = $("div[id^='digits_binary_'][id*='_div_top_']");

        topDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal('00000');          
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du bas pour les div au survole ", function() {

        codeInputTest.setCompleteValue('00000');

        const codeInputs = $('#element').find("input[id^='digits_binary_']");
        
        const bottomDivs = $("div[id^='digits_binary_'][id*='_div_bottom_']");

        bottomDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal('11111');          
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function() {
        // Définir la valeur initiale du premier input

        codeInputTest.setCompleteValue('00000');

        const codeInputs = $('#element').find("input[id^='digits_binary_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal('11111'); 
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant la molette vers le haut pour les digits ", function() {
        // Définir la valeur initiale du premier input
        codeInputTest.setCompleteValue('11111');

        const codeInputs = $('#element').find("input[id^='digits_binary_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            input.dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: -1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal('00000'); 
    });

   
});