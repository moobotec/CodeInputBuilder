describe("CodeInputBuilder Plugin Test du type Float", function() {
    let codeInputTest;
    const numInputs = 5;

    describe("Avec signe autorisé", function() {

        beforeEach(function() {
            $('body').append('<div id="element"></div>');

            // Initialiser le plugin et stocker la référence dans une variable globale
            codeInputTest = $('#element').codeInputBuilder({
                type: 'float',
                numInputs: numInputs,
                values: [0, 0, 0, 0, 0],
                minValues: [9, 9, 9, 9, 9],
                maxValues: [9, 9, 9, 9, 9],
                decimalPosition : 2,
                allowSign : true,
                gap: '1px', // Espace entre les inputs
                separator: ',',
                autoFocusNextInput: true,
                autoFocusNextInputDirection: 'Right',
                scrollSensitivity : 0.1,
            });

            $element = $('#element');

        });

        afterEach(function() {
            $('#element').remove();
        });

        it("devrait initialiser les valeurs par défaut correctement", function() {
            // Utiliser la variable globale pour accéder aux méthodes du plugin
            const value = codeInputTest.getCompleteValue();
            expect(value).to.equal(0);
        });


        it("devrait contenir l'input pour le signe avec les attributs et classes corrects", function() {
            const signInput = $element.find('input.sign-input');

            // Vérification de l'ID sans dépendance à la partie aléatoire
            const signIdPattern = /^sign_float_[a-zA-Z0-9]+_input_sign$/;
            expect(signInput.length).to.equal(1);
            expect(signInput.attr('id')).to.match(signIdPattern);

            // Vérifications des attributs et classes
            expect(signInput.attr('type')).to.equal('text');
            expect(signInput.hasClass('form-control')).to.be.true;
            expect(signInput.hasClass('form-control-lg')).to.be.true;
            expect(signInput.hasClass('text-center')).to.be.true;
            expect(signInput.hasClass('cla-h2-like')).to.be.true;
            expect(signInput.attr('maxlength')).to.equal('1');
            expect(signInput.attr('aria-valuenow')).to.equal('+');
            expect(signInput.attr('role')).to.equal('spinbutton');
            expect(signInput.val()).to.equal('+');
            expect(signInput.prop('disabled')).to.be.false;
        });

        it("devrait contenir les inputs de chiffres avec les attributs corrects", function() {
        
            for (let i = 1; i <= numInputs; i++) {
                // Sélection de l'input correspondant sans inclure le code aléatoire
                const digitInput = $element.find(`input.digits-input[name='digits${i}']`);

                // Vérification de l'ID sans dépendance au code aléatoire
                const digitIdPattern = new RegExp(`^digits_float_[a-zA-Z0-9]+_input_${i}$`);
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
                expect(digitInput.attr('aria-labelledby')).to.match(new RegExp(`^digits_float_[a-zA-Z0-9]+_label_${i}$`));
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
                const labelPattern = new RegExp(`^digits_float_[a-zA-Z0-9]+_label_${i}$`);
                const label = $element.find(`label[for*='digits_float_'][for*='_input_${i}']`);

                // Vérification de l'ID du label et du texte
                expect(label.length).to.equal(1);
                expect(label.attr('id')).to.match(labelPattern);
                expect(label.hasClass('sr-only')).to.be.true;
                expect(label.text()).to.equal(`Entrée ${i} pour float`);
            }

            // Vérifier le label pour le champ de signe
            const signLabel = $element.find("label[for*='sign_float_'][for*='_input_sign']");
            const signLabelPattern = /^sign_float_[a-zA-Z0-9]+_label_sign$/;
            expect(signLabel.length).to.equal(1);
            expect(signLabel.attr('id')).to.match(signLabelPattern);
            expect(signLabel.hasClass('sr-only')).to.be.true;
            expect(signLabel.text()).to.equal("Entrée sign pour float");
        });

        it("devrait contenir les textes de survol (hover-text) au-dessus et en-dessous de chaque input", function() {

            for (let i = 1; i <= numInputs; i++) {
                // Vérification du texte de survol au-dessus
                const topText = $element.find(`[id^='digits_float_'][id$='_div_top_${i}']`);
                const topTextPattern = new RegExp(`^digits_float_[a-zA-Z0-9]+_div_top_${i}$`);
                expect(topText.length).to.equal(1);
                expect(topText.attr('id')).to.match(topTextPattern);
                expect(topText.hasClass('cla-hover-text')).to.be.true;

                // Vérification du texte de survol en-dessous
                const bottomText = $element.find(`[id^='digits_float_'][id$='_div_bottom_${i}']`);
                const bottomTextPattern = new RegExp(`^digits_float_[a-zA-Z0-9]+_div_bottom_${i}$`);
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

        it("devrait mettre à jour la valeur correctement", function() {
            codeInputTest.setCompleteValue(42);
            expect(codeInputTest.getCompleteValue()).to.equal(42);

            codeInputTest.setCompleteValue(42.3);
            expect(codeInputTest.getCompleteValue()).to.equal(42.3);       
        });

        it("devrait respecter les valeurs minimales et maximales", function() {
            codeInputTest.setCompleteValue(99.999);
            expect(codeInputTest.getCompleteValue()).to.equal(99.999);

            codeInputTest.setCompleteValue(100.000); // Au-delà de la valeur maximale
            expect(codeInputTest.getCompleteValue()).to.equal(99.999); 
        
            codeInputTest.setCompleteValue(-1); // En-dessous de la valeur minimale
            expect(codeInputTest.getCompleteValue()).to.equal(-1); 

            codeInputTest.setCompleteValue(-1000.000); // En-dessous de la valeur minimale
            expect(codeInputTest.getCompleteValue()).to.equal(-99.999); // Devrait être limité à 0
        });


        it("devrait incrémenter toutes les valeurs d'input en utilisant un signal keyup sur les div associées au survol", function () {
            // Initialiser la valeur complète
            codeInputTest.setCompleteValue(42.300);
        
            // Sélectionner les inputs et leurs divs associés
            const codeInputs = $('#element').find("input[id^='digits_float_']");

            // Parcourir les divs pour simuler le survol et le keyup
            codeInputs.each((index, input) => {
                // Simuler un événement `mouseover` sur l'input associé
                const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
                codeInputs[index].dispatchEvent(hoverEvent);
        
                // Simuler un événement `keyup` avec keyCode
                const keyupEvent = new KeyboardEvent('keyup', {
                    key: '7', // Simule une touche spécifique
                    keyCode: 103,
                    bubbles: true,
                    cancelable: true,
                });

                input.dispatchEvent(keyupEvent);
        
            });
        
            // Vérification de la valeur finale
            expect(codeInputTest.getCompleteValue()).to.equal(77.777);


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
            expect(codeInputTest.getCompleteValue()).to.equal(0);

            codeInputTest.setCompleteValue(42.300);
        
            // Parcourir les divs pour simuler le survol et le keyup
            codeInputs.each((index, input) => {
                // Simuler un événement `mouseover` sur l'input associé
                const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
                codeInputs[index].dispatchEvent(hoverEvent);
        
                // Simuler un événement `keyup` avec keyCode
                const keyupEvent = new KeyboardEvent('keyup', {
                    key: '5', // Simule une touche spécifique
                    keyCode: 53, 
                    bubbles: true,
                    cancelable: true,
                });

                input.dispatchEvent(keyupEvent);
        
            });
        
            // Vérification de la valeur finale
            expect(codeInputTest.getCompleteValue()).to.equal(55.555);

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

            expect(codeInputTest.getCompleteValue()).to.equal(0);

            codeInputTest.setCompleteValue(42.300);
        
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
            expect(codeInputTest.getCompleteValue()).to.equal(0);
        });

        it("devrait incrémenter toutes les valeurs d'input en utilisant le click du haut pour les div associes au survole", function() {

            codeInputTest.setCompleteValue(42.300);

            const codeInputs = $('#element').find("input[id^='digits_float_']");
            
            const topDivs = $("div[id^='digits_float_'][id*='_div_top_']");

            topDivs.each((index, div) => {

                const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
                codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

                const event = new Event('click');
                div.dispatchEvent(event);

            });
            expect(codeInputTest.getCompleteValue()).to.equal(31.200);          
        });

        it("devrait incrémenter toutes les valeurs d'input en utilisant le click du bas pour les div associes au survole", function() {

            codeInputTest.setCompleteValue(42.300);

            const codeInputs = $('#element').find("input[id^='digits_float_']");
            
            const bottomDivs = $("div[id^='digits_float_'][id*='_div_bottom_']");

            bottomDivs.each((index, div) => {

                const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
                codeInputs[index].dispatchEvent(hoverEvent); // Déclenche l'événement sur l'input

                const event = new Event('click');
                div.dispatchEvent(event);

            });
            expect(codeInputTest.getCompleteValue()).to.equal(53.411);          
        });

        //signe
        it("devrait incrémenter la valeur du premier champ d'input (signe) en utilisant la molette vers le bas pour le signe ", function() {
            // Définir la valeur initiale du premier input

            codeInputTest.setCompleteValue(42.300);

            const codeInputTestSigne = $('#element').find('input');
            
            const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
            codeInputTestSigne[0].dispatchEvent(hoverEvent);

            // Simuler l'événement de défilement vers le haut sur le premier input qui est le sign
            $(codeInputTestSigne[0]).trigger({
                type: 'wheel',
                originalEvent: { deltaY: +1 , preventDefault: function() {} } // Défilement vers le bas
                
            });
    
            expect(codeInputTest.getCompleteValue()).to.equal(-42.3); 
        });

        it("devrait incrémenter les valeurs d'input (digit) en utilisant la molette vers le bas pour les digits ", function() {
            // Définir la valeur initiale du premier input

            codeInputTest.setCompleteValue(42.300);

            const codeInputs = $('#element').find("input[id^='digits_float_']");

            // Simuler l'événement de défilement vers le haut sur chaque input correspondant
            codeInputs.each((index, input) => {

                const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
                input.dispatchEvent(hoverEvent);

                $(input).trigger({
                    type: 'wheel',
                    originalEvent: { deltaY: +1, preventDefault: function() {} } // Défilement vers le bas
                });
            });
    
            expect(codeInputTest.getCompleteValue()).to.equal(53.411); 
        });

        it("devrait incrémenter les valeurs d'input (digit) en utilisant la molette vers le haut pour les digits ", function() {
            // Définir la valeur initiale du premier input

            codeInputTest.setCompleteValue(42.300);

            const codeInputs = $('#element').find("input[id^='digits_float_']");

            // Simuler l'événement de défilement vers le haut sur chaque input correspondant
            codeInputs.each((index, input) => {

                const hoverEvent = new Event('mouseover', { bubbles: true, cancelable: true });
                input.dispatchEvent(hoverEvent);

                $(input).trigger({
                    type: 'wheel',
                    originalEvent: { deltaY: -1, preventDefault: function() {} } // Défilement vers le haut
                });
            });
    
            expect(codeInputTest.getCompleteValue()).to.equal(31.2); 
        });

    });

    describe("Sans signe autorisé", function() {

        beforeEach(function() {
            $('body').append('<div id="element"></div>');

            // Initialiser le plugin et stocker la référence dans une variable globale
            codeInputTest = $('#element').codeInputBuilder({
                type: 'float',
                numInputs: numInputs,
                values: [0, 0, 0, 0, 0],
                minValues: [0, 0, 0, 0, 0],
                maxValues: [9, 9, 9, 9, 9],
                decimalPosition : 2,
                gap: '1px', // Espace entre les inputs
                separator: ',',
                autoFocusNextInput: true,
                autoFocusNextInputDirection: 'Right',
            });

        });

        afterEach(function() {
            $('#element').remove();
        });

        it("devrait initialiser les valeurs par défaut correctement", function() {
            // Utiliser la variable globale pour accéder aux méthodes du plugin
            const value = codeInputTest.getCompleteValue();
            expect(value).to.equal(0);
        });

        it("devrait mettre à jour la valeur correctement", function() {
            codeInputTest.setCompleteValue(42);
            expect(codeInputTest.getCompleteValue()).to.equal(42);

            codeInputTest.setCompleteValue(42.3);
            expect(codeInputTest.getCompleteValue()).to.equal(42.3);       
        });

        it("devrait respecter les valeurs minimales et maximales", function() {
            codeInputTest.setCompleteValue(99.999);
            expect(codeInputTest.getCompleteValue()).to.equal(99.999);

            codeInputTest.setCompleteValue(100.000); // Au-delà de la valeur maximale
            expect(codeInputTest.getCompleteValue()).to.equal(99.999); // Devrait être limité à 9999
        
            codeInputTest.setCompleteValue(-1); // En-dessous de la valeur minimale
            expect(codeInputTest.getCompleteValue()).to.equal(0); 

            codeInputTest.setCompleteValue(-1000.000); // En-dessous de la valeur minimale
            expect(codeInputTest.getCompleteValue()).to.equal(0); // Devrait être limité à 0
        });

    });
});
