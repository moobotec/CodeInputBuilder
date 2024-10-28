
# CodeInputBuilder

**CodeInputBuilder** est un plugin JavaScript basé sur jQuery permettant de créer des champs de saisie numérique personnalisés. Il supporte plusieurs options de configuration pour gérer les entiers et les nombres flottants avec des limites de valeurs, des signes, et des interactions avancées.

## Table des matières
- [Fonctionnalités](#fonctionnalités)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Options](#options)
- [Exemples](#exemples)
- [Styles personnalisés](#styles-personnalisés)
- [Dépendances](#dépendances)
- [Licence](#licence)

## Fonctionnalités

- Saisie de nombres entiers ou flottants avec configuration de limites min/max.
- Option de signe (+/-) pour les valeurs.
- Gestion des événements comme `onValueChange` pour réagir aux changements en temps réel.
- Défilement pour incrémenter ou décrémenter les valeurs.
- Interactions visuelles pour guider l'utilisateur avec des valeurs limites affichées en périphérie.
  
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
|---------------------|--------------|--------------------------------------------------------------------------------------------------|--------------------|
| `type`              | `string`     | Type de valeur (`integer` ou `float`).                                                           | `integer`         |
| `numInputs`         | `integer`    | Nombre d'entrées/chiffres.                                                                       | `1`               |
| `minValues`         | `array`      | Valeurs minimales par position.                                                                  | `[]`              |
| `maxValues`         | `array`      | Valeurs maximales par position.                                                                  | `[]`              |
| `values`            | `array`      | Valeurs par défaut par position.                                                                 | `[]`              |
| `defaultvalue`      | `integer`    | Valeur par défaut des champs.                                                                    | `0`               |
| `gap`               | `string`     | Espace entre les champs d'entrée.                                                                | `'10px'`          |
| `allowSign`         | `boolean`    | Autorise l'ajout d'un signe (+/-).                                                               | `false`           |
| `defaultSign`       | `string`     | Signe par défaut (`+` ou `-`).                                                                   | `'+'`             |
| `decimalPosition`   | `integer`    | Position de la virgule pour les flottants.                                                       | `1`               |
| `totalMax`          | `float`      | Valeur maximale totale possible.                                                                 | `null`            |
| `totalMin`          | `float`      | Valeur minimale totale possible.                                                                 | `null`            |
| `onValueChange`     | `function`   | Fonction déclenchée lorsque la valeur change.                                                    | `null`            |

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
    separarator: ',',
    onValueChange: function($input, newValue) {
        console.log(`Valeur complète : ${newValue}`);
    }
});
```

## Styles personnalisés

Le fichier CSS `codeinputbuilder.css` personnalise l'apparence des champs :
- `.cla-h2-like` : Applique une apparence similaire à un titre `<h2>`.
- `.cla-hover-text` : Style les textes de survol pour les valeurs limites.

## Dépendances

- [jQuery](https://jquery.com) (3.5.1+)
- [Bootstrap](https://getbootstrap.com) (4.5.2+)

## Licence

Distribué sous la licence MIT. Consultez `LICENSE` pour plus d’informations.
