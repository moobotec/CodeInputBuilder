describe("CodeInputBuilder Plugin Tests avec type Integer", function() {
    let codeInputTest;
    const numInputs = 4;

    describe("Avec signe autorisé", function() {
        beforeEach(function() {
            $('body').append('<div id="element"></div>');

            // Initialiser le plugin avec le signe autorisé
            codeInputTest = $('#element').codeInputBuilder({
                type: 'integer',
                numInputs: numInputs,
                minValues: [0, 0, 1, 2],
                maxValues: [9, 9, 9, 5],
                allowSign: true
            });

            $element = $('#element');

        });

        afterEach(function() {
            $('#element').remove();
        });

        it("devrait initialiser les valeurs par défaut correctement", function() {
            const value = codeInputTest.getCompleteValue();
            expect(value).to.equal(12);
        });

        it("devrait contenir l'input pour le signe avec les attributs et classes corrects", function() {
            const signInput = $element.find('input.sign-input');
    
            // Vérification de l'ID sans dépendance à la partie aléatoire
            const signIdPattern = /^sign_integer_[a-zA-Z0-9]+_input_sign$/;
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
                const digitIdPattern = new RegExp(`^digits_integer_[a-zA-Z0-9]+_input_${i}$`);
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
                expect(digitInput.attr('aria-labelledby')).to.match(new RegExp(`^digits_integer_[a-zA-Z0-9]+_label_${i}$`));
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
                const labelPattern = new RegExp(`^digits_integer_[a-zA-Z0-9]+_label_${i}$`);
                const label = $element.find(`label[for*='digits_integer_'][for*='_input_${i}']`);
    
                // Vérification de l'ID du label et du texte
                expect(label.length).to.equal(1);
                expect(label.attr('id')).to.match(labelPattern);
                expect(label.hasClass('sr-only')).to.be.true;
                expect(label.text()).to.equal(`Entrée ${i} pour integer`);
            }
    
            // Vérifier le label pour le champ de signe
            const signLabel = $element.find("label[for*='sign_integer_'][for*='_input_sign']");
            const signLabelPattern = /^sign_integer_[a-zA-Z0-9]+_label_sign$/;
            expect(signLabel.length).to.equal(1);
            expect(signLabel.attr('id')).to.match(signLabelPattern);
            expect(signLabel.hasClass('sr-only')).to.be.true;
            expect(signLabel.text()).to.equal("Entrée sign pour integer");
        });
    
        it("devrait contenir les textes de survol (hover-text) au-dessus et en-dessous de chaque input", function() {
    
            for (let i = 1; i <= numInputs; i++) {
                // Vérification du texte de survol au-dessus
                const topText = $element.find(`[id^='digits_integer_'][id$='_div_top_${i}']`);
                const topTextPattern = new RegExp(`^digits_integer_[a-zA-Z0-9]+_div_top_${i}$`);
                expect(topText.length).to.equal(1);
                expect(topText.attr('id')).to.match(topTextPattern);
                expect(topText.hasClass('cla-hover-text')).to.be.true;
    
                // Vérification du texte de survol en-dessous
                const bottomText = $element.find(`[id^='digits_integer_'][id$='_div_bottom_${i}']`);
                const bottomTextPattern = new RegExp(`^digits_integer_[a-zA-Z0-9]+_div_bottom_${i}$`);
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

        it("devrait mettre à jour la valeur avec un signe", function() {
            codeInputTest.setCompleteValue(42);
            expect(codeInputTest.getCompleteValue()).to.equal(42);

            codeInputTest.setCompleteValue(1);
            expect(codeInputTest.getCompleteValue()).to.equal(2); 

            codeInputTest.setCompleteValue(-1);
            expect(codeInputTest.getCompleteValue()).to.equal(-2); 
        });

        it("devrait respecter les valeurs minimales et maximales avec signe", function() {
            codeInputTest.setCompleteValue(9999);
            expect(codeInputTest.getCompleteValue()).to.equal(9995);

            codeInputTest.setCompleteValue(-9999);
            expect(codeInputTest.getCompleteValue()).to.equal(-9995); 

            codeInputTest.setCompleteValue(-10000);
            expect(codeInputTest.getCompleteValue()).to.equal(-12); 

            codeInputTest.setCompleteValue(10000); 
            expect(codeInputTest.getCompleteValue()).to.equal(12); 

        });
    });

    describe("Sans signe autorisé", function() {
        beforeEach(function() {
            $('body').append('<div id="element"></div>');

            // Initialiser le plugin sans signe autorisé
            codeInputTest = $('#element').codeInputBuilder({
                type: 'integer',
                numInputs: 4,
                minValues: [0, 0, 1, 2],
                maxValues: [9, 9, 9, 5],
                allowSign: false
            });
        });

        afterEach(function() {
            $('#element').remove();
        });

        it("devrait initialiser les valeurs par défaut correctement", function() {
            const value = codeInputTest.getCompleteValue();
            expect(value).to.equal(12);
        });

        it("devrait mettre à jour la valeur sans signe", function() {
            codeInputTest.setCompleteValue(42);
            expect(codeInputTest.getCompleteValue()).to.equal(42);

            codeInputTest.setCompleteValue(1);
            expect(codeInputTest.getCompleteValue()).to.equal(2); // Le signe négatif est ignoré

            codeInputTest.setCompleteValue(-1);
            expect(codeInputTest.getCompleteValue()).to.equal(2); // Le signe négatif est ignoré
        });

        it("devrait respecter les valeurs minimales et maximales sans signe", function() {
            codeInputTest.setCompleteValue(9999);
            expect(codeInputTest.getCompleteValue()).to.equal(9995);

            codeInputTest.setCompleteValue(-9999);
            expect(codeInputTest.getCompleteValue()).to.equal(9995); // Devrait ignorer le signe négatif

            codeInputTest.setCompleteValue(-10000);
            expect(codeInputTest.getCompleteValue()).to.equal(12); 

            codeInputTest.setCompleteValue(10000); 
            expect(codeInputTest.getCompleteValue()).to.equal(12); 

        });
    });
});