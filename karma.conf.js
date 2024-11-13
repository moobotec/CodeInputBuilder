// karma.conf.js
module.exports = function(config) {
    config.set({
      frameworks: ['mocha', 'chai'], // Utiliser Mocha et Chai pour les tests
      files: [
        'node_modules/jquery/dist/jquery.min.js', // Inclure jQuery
        'src/codeinputbuilder.js',                // Ton fichier source
        'tests/**/*.test.js'                      // Tous les fichiers de test
      ],
      preprocessors: {
        'src/codeinputbuilder.js': ['webpack'],   // Utiliser Webpack pour traiter le fichier source
        'tests/**/*.test.js': ['webpack']         // Traiter les fichiers de test avec Webpack
      },
      webpack: {
        // Config de base de Webpack
        mode: 'development',
        module: {
          rules: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: ['@babel/preset-env'] // Pour la compatibilité avec ES6+
                }
              }
            }
          ]
        }
      },
      browsers: ['ChromeHeadless'], // Utiliser Chrome en mode headless
      reporters: ['progress'],      // Afficher la progression des tests
      singleRun: true,              // Arrêter après une exécution (idéal pour CI/CD)
      plugins: [
        'karma-mocha',
        'karma-chai',
        'karma-chrome-launcher',
        'karma-webpack'
      ]
    });
  };
  