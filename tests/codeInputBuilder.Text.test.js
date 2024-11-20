describe("CodeInputBuilder Plugin Tests avec type Text", function() {
    let codeInputTest;

    beforeEach(function() {
        $('body').append('<div id="element"></div>');

        // Initialiser le plugin avec le signe autorisé
        codeInputTest = $('#element').codeInputBuilder({
            type: 'text',
            values: ['Lorem', 'Consectetur', 'Eiusmod', 'Nulla', 'Vestibulum', 'Sollicitudin'],
            defaultValue : 0,
            scrollSensitivity : 0.1,
        });

        $element = $('#element');

    });

    afterEach(function() {
        $('#element').remove();
    });

    it("devrait initialiser les valeurs par défaut correctement", function() {
        const value = codeInputTest.getCompleteValue();
        expect(value).to.equal('Lorem');
    });

    it("devrait contenir les inputs de chiffres avec les attributs corrects", function() {
        
            // Sélection de l'input correspondant sans inclure le code aléatoire
            const digitInput = $element.find(`input.list-input`);

            // Vérification de l'ID sans dépendance au code aléatoire
            const digitIdPattern = new RegExp(`^list_text_[a-zA-Z0-9]+_input_list$`);
            expect(digitInput.length).to.equal(1);
            expect(digitInput.attr('id')).to.match(digitIdPattern);

            // Vérifications des attributs
            expect(digitInput.attr('type')).to.equal('text');
            expect(digitInput.hasClass('form-control')).to.be.true;
            expect(digitInput.hasClass('form-control-lg')).to.be.true;
            expect(digitInput.hasClass('text-center')).to.be.true;
            expect(digitInput.hasClass('cla-h2-like')).to.be.true;
            expect(digitInput.attr('maxlength')).to.equal('30');
            expect(digitInput.attr('data-min')).to.exist;
            expect(digitInput.attr('data-max')).to.exist;
            expect(digitInput.attr('aria-labelledby')).to.match(new RegExp(`^list_text_[a-zA-Z0-9]+_label_list$`));
            expect(digitInput.attr('aria-valuemin')).to.equal(digitInput.attr('data-min'));
            expect(digitInput.attr('aria-valuemax')).to.equal(digitInput.attr('data-max'));
            expect(digitInput.attr('aria-valuenow')).to.equal(digitInput.val());
            expect(digitInput.attr('role')).to.equal('spinbutton');
            expect(digitInput.prop('disabled')).to.be.true;
        
    });

    it("devrait associer chaque input à un label avec un texte descriptif", function() {

        // Sélection du label correspondant sans inclure le code aléatoire
        const labelPattern = new RegExp(`^list_text_[a-zA-Z0-9]+_label_list$`);
        const label = $element.find(`label[for*='list_text_'][for*='_input_list']`);

        // Vérification de l'ID du label et du texte
        expect(label.length).to.equal(1);
        expect(label.attr('id')).to.match(labelPattern);
        expect(label.hasClass('sr-only')).to.be.true;
        expect(label.text()).to.equal(`Entrée list pour text`);
    
    });

    it("devrait contenir les textes de survol (hover-text) au-dessus et en-dessous de chaque input", function() {

        // Vérification du texte de survol au-dessus
        const topText = $element.find(`[id^='list_text_'][id$='_div_top_list']`);
        const topTextPattern = new RegExp(`^list_text_[a-zA-Z0-9]+_div_top_list$`);
        expect(topText.length).to.equal(1);
        expect(topText.attr('id')).to.match(topTextPattern);
        expect(topText.hasClass('cla-hover-text')).to.be.true;

        // Vérification du texte de survol en-dessous
        const bottomText = $element.find(`[id^='list_text_'][id$='_div_bottom_list']`);
        const bottomTextPattern = new RegExp(`^list_text_[a-zA-Z0-9]+_div_bottom_list$`);
        expect(bottomText.length).to.equal(1);
        expect(bottomText.attr('id')).to.match(bottomTextPattern);
        expect(bottomText.hasClass('cla-hover-text')).to.be.true;

        // Cas spécifique pour masquer certains éléments (par exemple, le dernier)
        expect(topText.css('visibility')).to.equal('visible');
        expect(bottomText.css('visibility')).to.equal('visible');
        
    });

    it("devrait mettre à jour la valeur", function() {
        codeInputTest.setCompleteValue('Consectetur');
        expect(codeInputTest.getCompleteValue()).to.equal('Consectetur');
    });

    it("devrait respecter les valeurs minimales et maximales", function() {
            
        expect(() => {
            codeInputTest.setCompleteValue(11111111);
        }).to.throw("Le texte n'est pas reconnu dans les valeurs disponibles.");

        codeInputTest.setCompleteValue('Lorem');
        expect(codeInputTest.getCompleteValue()).to.equal('Lorem');

        codeInputTest.setCompleteValue('Sollicitudin');
        expect(codeInputTest.getCompleteValue()).to.equal('Sollicitudin');

    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du haut pour les div au survole ", function() {

        codeInputTest.setCompleteValue('Nulla');

        const codeInputs = $('#element').find("input[id^='list_text_']");
        
        const topDivs = $("div[id^='list_text_'][id*='_div_top_']");

        topDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal('Eiusmod');          
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant le click du bas pour les div au survole ", function() {

        codeInputTest.setCompleteValue('Nulla');

        const codeInputs = $('#element').find("input[id^='list_text_']");
        
        const bottomDivs = $("div[id^='list_text_'][id*='_div_bottom_']");

        bottomDivs.each((index, div) => {

            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

            const event = new Event('click');
            div.dispatchEvent(event);

        });
        expect(codeInputTest.getCompleteValue()).to.equal('Vestibulum');          
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant la molette vers le bas pour les digits ", function() {
        // Définir la valeur initiale du premier input

        codeInputTest.setCompleteValue('Nulla');

        const codeInputs = $('#element').find("input[id^='list_text_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {
            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal('Vestibulum'); 
    });

    it("devrait incrémenter la valeur du premier champ d'input en utilisant la molette vers le haut pour les digits ", function() {
        // Définir la valeur initiale du premier input
        codeInputTest.setCompleteValue('Nulla');

        const codeInputs = $('#element').find("input[id^='list_text_']");

        // Simuler l'événement de défilement vers le haut sur chaque input correspondant
        codeInputs.each((index, input) => {
            $(input).trigger({
                type: 'wheel',
                originalEvent: { deltaY: -1, preventDefault: function() {} } // Défilement vers le bas
            });
        });

        expect(codeInputTest.getCompleteValue()).to.equal('Eiusmod'); 
    });

   
});