const { deleteDirectoryContent, forEachFile } = require("./src/files");
const { generateRecipe, generateIndex } = require("./src/html");


const allRecipes = []
// supprimer le contenu de 'docs/recettes'
deleteDirectoryContent('./docs/recettes', () => {  
    // lire l'ensemble des recettes => générer le sommaire
    forEachFile('./recettes', (directory, file) => {
        const input = `${directory}/${file}`
        const recipe = generateRecipe(input, 'docs/recettes');
        //console.log(recipe)
        allRecipes.push(recipe);
    }, () => {
        generateIndex(allRecipes, 'docs')
    })
})
