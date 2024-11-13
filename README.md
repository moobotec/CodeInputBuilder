
# CodeInputBuilder

**CodeInputBuilder** est un plugin JavaScript basé sur jQuery permettant de créer des champs de saisie numérique personnalisés.
Il supporte plusieurs options de configuration pour gérer les entiers, les nombres flottants, les textes et des interactions avancées.

## Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Options](#options)
- [Exemples](#exemples)
- [Méthodes](#méthodes)
- [Accessibilité](#accessibilité)
- [Styles personnalisés](#styles-personnalisés)
- [Dépendances](#dépendances)
- [Licence](#licence)

## Fonctionnalités

**CodeInputBuilder** propose une large gamme de fonctionnalités permettant une saisie numérique flexible et personnalisable. Voici les principales fonctionnalités disponibles :

- **Saisie de différents types de données** : Prend en charge `integer`, `float`, `binary`, `hexadecimal`, `letter`, et `text`.
- **Configuration des limites min/max** : Chaque champ peut avoir des valeurs minimales et maximales spécifiques.
- **Option de signe (+/-)** : Permet d’ajouter un signe (positif ou négatif) pour chaque valeur.
- **Callback `onValueChange`** : Fonction personnalisée déclenchée à chaque changement de valeur.
- **Défilement pour ajuster les valeurs** : Permet d’ajuster les valeurs des champs en utilisant la molette de la souris, avec une sensibilité configurable (`scrollSensitivity`).
- **Requête de touche pour le défilement** : Une touche spécifique (`Control`, `Shift`, `Alt`, `Meta`) peut être requise pour activer la fonctionnalité de défilement (`requireKeyForScroll`), permettant un contrôle précis des valeurs.
- **Affichage des valeurs limites** : Visualisation des valeurs limites avec un effet de survol pour indiquer la plage autorisée à l’utilisateur.
- **Nombre d'entrées configurables** : Définit le nombre de champs de saisie (`numInputs`).
- **Espacement personnalisable entre les champs** : Permet de définir l’espace entre les champs d'input (`gap`).
- **Position de la virgule pour `float`** : Paramètre pour définir la position du séparateur décimal (`decimalPosition`).
- **Contrôle de validité des entrées** : Limite les caractères saisis en fonction des valeurs min/max et du type de données spécifié.
- **Accessibilité améliorée** : Intègre les attributs ARIA (`aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-live="polite"`) et le rôle `spinbutton` pour une expérience accessible aux utilisateurs de technologies d’assistance.
- **Descriptions et instructions** : Des messages d’aide sont intégrés pour guider les utilisateurs dans l’utilisation des champs, en particulier pour le défilement et l'ajustement des valeurs.
- **Gestion des copier-coller** : Restreint les valeurs saisies à un seul caractère, ce qui permet de conserver une saisie cohérente.
- **Activation et désactivation des champs** : Utilisation de l'option `isDisabled` pour désactiver les champs et empêcher les modifications si nécessaire.
- **Affichage et mise à jour des valeurs** : Utilisation des méthodes `setCompleteValue` et `getCompleteValue` pour définir et obtenir la valeur totale du champ d'input.
- **Manipulation fine des valeurs** : Grâce aux méthodes `getDigitAt` et `setDigitAt`, il est possible d’accéder et de modifier chaque chiffre individuel d’une valeur, offrant un contrôle granulaire.

Ces fonctionnalités enrichissent l'expérience utilisateur et offrent une flexibilité avancée pour la saisie numérique dans les applications web, permettant une personnalisation adaptée aux besoins spécifiques des utilisateurs.

## Installation

1. Clonez le dépôt ou téléchargez les fichiers.
2. Assurez-vous d'inclure les fichiers CSS et JavaScript dans votre projet :
   ```html
   <link href="src/codeinputbuilder.css" rel="stylesheet">
   <script src="src/codeinputbuilder.js"></script>
   ```

## Utilisation

1. Intégrez un élément HTML pour le champ de saisie.
   ```html
   <div id="codeInputInteger"></div>
   ```
2. Initialisez le plugin avec jQuery :
   ```javascript
   $('#codeInputInteger').codeInputBuilder({
       type: 'integer',
       numInputs: 5,
       minValues: [0, 0, 0, 0, 0],
       maxValues: [9, 8, 7, 6, 5],
       allowSign: true,
       defaultSign: '+',
       gap: '1px',
       onValueChange: function($input, newValue) {
           console.log(`Input modifié : ${$input.attr('id')} - Nouvelle valeur : ${newValue}`);
       }
   });
   ```

## Options

| Option              | Type         | Description                                                                                      | Valeur par défaut |
|---------------------|-------------------|--------------------------------------------------------------------------------------------------|--------------------|
| `type`              | `string`         | Type de valeur (`integer`, `float`, `binary`, `hexadecimal`, `letter`, `text`).                  | `integer`         |
| `numInputs`         | `integer`        | Nombre d'entrées/chiffres.                                                                       | `1`               |
| `minValues`         | `array`          | Valeurs minimales par position.                                                                  | `[]`              |
| `maxValues`         | `array`          | Valeurs maximales par position.                                                                  | `[]`              |
| `values`            | `array`          | Valeurs par défaut par position.                                                                 | `[]`              |
| `defaultValue`      | `number|string`    | Valeur par défaut des champs.                                                                    | `0`               |
| `gap`               | `string`         | Espace entre les champs d'entrée.                                                                | `'10px'`          |
| `allowSign`         | `boolean`        | Autorise l'ajout d'un signe (+/-).                                                               | `false`           |
| `defaultSign`       | `string`         | Signe par défaut (`+` ou `-`).                                                                   | `'+'`             |
| `decimalPosition`   | `integer`        | Position de la virgule pour les flottants.                                                       | `1`               |
| `separator`         | `string`         | Caractère de séparation pour les décimales (ex. `.`).                                            | `'.'`             |
| `totalMax`          | `float`          | Valeur maximale totale possible.                                                                 | `null`            |
| `totalMin`          | `float`          | Valeur minimale totale possible.                                                                 | `null`            |
| `allowScroll`       | `boolean`        | Active ou désactive la fonctionnalité de défilement.                                             | `true`            |
| `scrollSensitivity` | `integer`        | Définit la sensibilité du défilement.                                                            | `50`            |
| `requireKeyForScroll` | `string`       | Touche à enfoncer (par exemple 'Control' ou 'Shift') pour activer le défilement sur les inputs. Valeurs possibles : 'Control', 'Shift', 'Alt', 'Meta'. Sensible à la casse.  | `null`            |
| `autoFocusNextInput`| `boolean`        |  Active le décalage automatique du focus vers l'input suivant lors de la saisie.                 | `false`            |
| `autoFocusNextInputDirection`| `string`    |  Détermine la direction du décalage automatique du focus. Valeurs possibles : 'Forward', 'Right', 'Backward', 'Left'. Sensible à la casse.                                | `null`            |
| `onValueChange`     | `function`   | Fonction déclenchée lorsque la valeur change.                                                    | `null`            |
| `isDisabled`       | `boolean`        | Permet de désactiver les inputs. Si activé, les champs ne seront pas modifiables par l'utilisateur. Dans le cas d'un CodeInput de type "text" cette option n'est pas utilisable.                                             | `true`            |

## Exemples

### Exemple pour un nombre entier

![Exemple pour un nombre entier](img/exemple_input_integer.png)

```javascript
$('#codeInputInteger').codeInputBuilder({
    type: 'integer',
    numInputs: 5,
    values: [0, 0, 0, 0, 0],
    minValues: [0, 0, 0, 0, 0],
    maxValues: [9, 8, 7, 6, 5],
    allowSign: true,
    defaultSign: '+',
    gap: '1px',
    requireKeyForScroll: 'Control',
    onValueChange: function($input, newValue) {
        console.log(`Valeur modifiée : ${newValue}`);
    }
});
```

### Exemple pour un nombre flottant

![Exemple pour un nombre flottant](img/exemple_input_float.png)

```javascript
$('#codeInputFloat').codeInputBuilder({
    type: 'float',
    numInputs: 7,
    values: [0, 0, 0, 0, 0, 0, 0],
    minValues: [0, 0, 0, 0, 0, 0, 0],
    maxValues: [9, 9, 9, 9, 9, 9, 9],
    decimalPosition: 3,
    gap: '10px',
    totalMax: 180.0,
    separator: ',',
    onValueChange: function($input, newValue) {
        console.log(`Valeur complète : ${newValue}`);
    }
});
```

### Exemple pour un texte

![Exemple une un texte](img/exemple_input_text.png)

```javascript
$('#codeInputText').codeInputBuilder({
    type: 'text',
    values: ['Lorem', 'Consectetur', 'Eiusmod', 'Nulla', 'Vestibulum', 'Sollicitudin'], 
    defaultValue: 'Lorem',
    onValueChange: function($input, newValue) {
        console.log(`Valeur complète : ${newValue}`);
    }
});
```

## Méthodes

Le plugin `Code Input Builder` offre plusieurs méthodes pour interagir avec et manipuler les champs d'input. Voici une description de chaque méthode disponible :

- ### `getDigitAt(index)`
    - **Description** : Récupère la valeur d'un chiffre spécifique à un index donné dans le champ d'input.
    - **Paramètre** : 
      - `index` (integer) : L'index du chiffre à récupérer.
    - **Retour** : La valeur du chiffre à l'index spécifié.
    - **Exemple** :
      ```javascript
      $('#element').codeInputBuilder().getDigitAt(2);
      ```

- ### `setDigitAt(index, value)`
    - **Description** : Définit la valeur d'un chiffre spécifique à un index donné dans le champ d'input.
    - **Paramètres** :
      - `index` (integer) : L'index du chiffre à définir.
      - `value` (integer/string) : La nouvelle valeur à définir pour ce chiffre.
    - **Exemple** :
      ```javascript
      $('#element').codeInputBuilder().setDigitAt(2, 5);
      ```

- ### `getCompleteValue()`
    - **Description** : Récupère la valeur complète saisie dans l'input, en prenant en compte tous les chiffres.
    - **Retour** : La valeur complète sous forme de nombre ou de chaîne de caractères, en fonction du type d'input configuré.
    - **Exemple** :
      ```javascript
      const fullValue = $('#element').codeInputBuilder().getCompleteValue();
      ```

- ### `setCompleteValue(value, onchange = false)`
    - **Description** : Définit la valeur complète dans l'input. Cette méthode prend en compte tous les chiffres et met à jour l'input.
    - **Paramètres** :
      - `value` (integer/string) : La valeur complète à définir.
      - `onchange` (boolean, optionnel) : Si défini sur `true`, déclenche le callback `onValueChange` après la mise à jour de la valeur. Par défaut `false`.
    - **Exemple** :
      ```javascript
      $('#element').codeInputBuilder().setCompleteValue("1234", true);
      ```

- ### `toggleInputs(disabled)`
    - **Description** : Active ou désactive tous les champs d'input du plugin.
    - **Paramètre** :
      - `disabled` (boolean) : Si `true`, désactive les inputs ; si `false`, les active.
    - **Exemple** :
      ```javascript
      $('#element').codeInputBuilder().toggleInputs(true); // Désactive tous les inputs
      ```

Ces méthodes permettent de contrôler et manipuler les valeurs des champs d'input générés par le plugin, offrant une grande flexibilité et une intégration aisée dans des applications interactives.


## Accessibilité

Ce plugin a été conçu pour être accessible aux utilisateurs de lecteurs d'écran et inclut plusieurs améliorations pour une meilleure prise en charge de l'accessibilité :

- **Attributs ARIA** : Les attributs `aria-valuemin`, `aria-valuemax`, et `aria-valuenow` sont utilisés pour indiquer les limites minimales, maximales et la valeur actuelle de chaque champ d'input.
- **Annonces dynamiques** : `aria-live="polite"` permet de notifier les changements de valeur aux utilisateurs de lecteurs d'écran de manière non intrusive, pour une meilleure compréhension des modifications en temps réel.
- **Rôle `spinbutton`** : Les éléments d'input sont marqués avec le rôle `spinbutton`, ce qui indique aux technologies d'assistance qu'ils sont ajustables, pour une meilleure expérience de navigation.
- **Instructions claires** : Des descriptions et instructions sont intégrées dans les attributs ARIA pour guider l'utilisateur dans l'utilisation des champs de saisie, notamment pour la saisie et l’ajustement de valeurs.

## Styles personnalisés

Le fichier CSS `codeinputbuilder.css` personnalise l'apparence des champs :
- `.cla-h2-like` : Applique une apparence similaire à un titre `<h2>`.
- `.cla-hover-text` : Style les textes de survol pour les valeurs limites.

## Dépendances

- [jQuery](https://jquery.com) (3.5.1+)
- [Bootstrap](https://getbootstrap.com) (4.5.2+)

## Licence

Distribué sous la licence MIT. Consultez `LICENSE` pour plus d’informations.
