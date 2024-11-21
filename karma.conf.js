module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'], // Utiliser Mocha et Chai pour les tests
    files: [
      'node_modules/jquery/dist/jquery.min.js', // Inclure jQuery
      'src/codeinputbuilder.js',                // Ton fichier source
      'tests/**/*.test.js'                      // Tous les fichiers de test
    ],
    preprocessors: {
      'src/codeinputbuilder.js': ['webpack', 'coverage'], // Ajouter 'coverage' pour le fichier source
      'tests/**/*.test.js': ['webpack']
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
                presets: ['@babel/preset-env'], // Pour la compatibilité avec ES6+
                comments : true,
                plugins: ['istanbul'] // Plugin pour la couverture
              }
            }
          }
        ]
      }
    },
    browsers: ['ChromeHeadless'], // Utiliser Chrome en mode headless
    reporters: ['progress', 'coverage'], // Ajouter 'coverage' comme reporter
    coverageReporter: {
      type: 'lcov',                 // Format du rapport
      dir: 'coverage/',             // Dossier de sortie du rapport
      subdir: '.',
      includeAllSources: true,
    },
    singleRun: true,                // Arrêter après une exécution (idéal pour CI/CD)
    plugins: [
      'karma-mocha',
      'karma-chai',
      'karma-chrome-launcher',
      'karma-webpack',
      'karma-coverage'              // Ajouter le plugin de couverture
    ]
  });
};
