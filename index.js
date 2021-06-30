const { deleteDirectoryContent, forEachFile, createDirSync } = require("./src/files");
const { generateRecipe, generateIndex, generateCSS, generateManifest, getType, generateRecipeHeader, generateParts } = require("./src/html");
const { groupBy } = require("./src/utils")
const frCollator = new Intl.Collator('fr');
const allRecipes = []
const allTypes = new Set();
let recipeHeader = '';
// supprimer le contenu de 'docs/recettes'
deleteDirectoryContent('./docs/recettes', () => {
    createDirSync('./docs/recettes');
    forEachFile('./recettes', (directory, file) => {
        const input = `${directory}/${file}`
        allTypes.add(getType(input));
        const types = Array.from(allTypes);
        recipeHeader = generateRecipeHeader(types.sort(frCollator.compare));
    }, () => {
        // lire l'ensemble des recettes => générer le sommaire
        forEachFile('./recettes', (directory, file) => {
            const input = `${directory}/${file}`
            const recipe = generateRecipe(input, recipeHeader, 'docs/recettes');
            //console.log(recipe)
            allRecipes.push(recipe);
        }, () => {
            const types = Array.from(allTypes).sort(frCollator.compare);
            const recipeByType = groupBy(allRecipes, "typeTitle")
            types.forEach(type => {
                generateParts(types, recipeByType[type], type, 'docs/recettes')
            })
            generateIndex(allRecipes, types, 'docs')
            generateCSS('docs');
            generateManifest('docs');
            // TODO générer le service worker
        })
    })
})
