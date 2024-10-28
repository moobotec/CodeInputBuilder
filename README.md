
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

**CodeInputBuilder** propose une large gamme de fonctionnalités permettant une saisie numérique flexible et personnalisable. Voici les principales fonctionnalités disponibles :

- **Saisie de nombres entiers ou flottants** : Prend en charge la saisie de valeurs de type `integer` (entiers) ou `float` (flottants), avec possibilité de configurer des limites minimales et maximales pour chaque champ de saisie.
- **Configuration de limites min/max** : Chaque champ peut avoir des valeurs spécifiques minimales et maximales par position, permettant un contrôle précis des valeurs.
- **Option de signe (+/-)** : Possibilité d’ajouter un signe (positif ou négatif) pour chaque valeur, avec une option de signe par défaut (paramètre `defaultSign`).
- **Gestion des événements `onValueChange`** : Déclenche une fonction personnalisée lors de chaque changement de valeur, permettant de réagir en temps réel aux modifications d’entrée.
- **Défilement pour incrémenter/décrémenter** : Ajustement des valeurs des champs en utilisant la molette de la souris pour faciliter les modifications.
- **Affichage des valeurs limites en périphérie** : Visualisation des valeurs supérieures et inférieures à l’aide d’un effet de survol (hover) pour guider l'utilisateur.
- **Nombre d'entrées configurables** : Possibilité de spécifier le nombre de champs de saisie pour les valeurs numériques (`numInputs`).
- **Espacement personnalisable entre les champs** : Contrôle de l’espace entre chaque champ d’entrée, pour une mise en page adaptable.
- **Position de la virgule** : Paramètre pour définir la position de la virgule dans les nombres flottants (`decimalPosition`), offrant plus de flexibilité pour la saisie de valeurs décimales.
- **Valeurs maximales et minimales totales** : Définition de limites totales (`totalMax` et `totalMin`) pour contrôler la somme des valeurs saisies.
- **Contrôle de validité des entrées** : Limite les caractères saisis aux chiffres et empêche les entrées non autorisées en fonction des valeurs min/max.
- **Interactions copier-coller** : Gestion du copier-coller pour limiter la saisie à un seul caractère par champ et empêcher les entrées multiples.
- **Styles visuels personnalisés pour les champs** : Apparence inspirée d’un style de titre `<h2>`, avec des classes CSS (`cla-h2-like`) pour les valeurs de survol (`.top-text`, `.bottom-text`) et les transitions pour un affichage fluide.
- **Affichage et mise à jour des valeurs complètes** : Possibilité de récupérer et de définir la valeur complète via des méthodes (`setCompleteValue` et `getCompleteValue`).

Ces fonctionnalités permettent une expérience utilisateur enrichie et une flexibilité avancée pour les saisies numériques dans les applications web.
  
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
