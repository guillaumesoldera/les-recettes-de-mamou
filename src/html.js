const { readFile, writeFile } = require("./files");
const { converter } = require("./markdown");

function toSlug(title) {
    return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/"/g, "").replace(/'/g, "").toLowerCase().replace(/ /g, "-")
}

function generateRecipe(input, targetDirectory) {
    const fileContent = readFile(input);
    const htmlContent = converter.makeHtml(fileContent)
    const indexH1 = htmlContent.indexOf("<h1");
    const endH1 = htmlContent.indexOf(">", indexH1)
    const title = htmlContent.substring(endH1 + 1, htmlContent.indexOf("</h1>"))
    const htmlTemplate = readFile('./src/template/recipe.html');
    const element = htmlTemplate
        .replace("$$RECETTE_TITLE$$", title)
        .replace("$$RECETTE_CONTENT$$", htmlContent)
    const finalPath = `${targetDirectory}/${toSlug(title)}.html`;
    writeFile(element, finalPath);
    return {
        title,
        finalPath
    }
}

function generateIndex(recipesList, targetDirectory) {
    console.log(recipesList);
    const listAsHtml = recipesList.map(recipe => {
        return `<li><a href="${recipe.finalPath.replace("docs", "")}" title="${recipe.title}">${recipe.title}</a>`
    }).join("\n");
    
    const htmlTemplate = readFile('./src/template/index.html');
    const element = htmlTemplate.replace("$$LISTE_RECETTES$$", listAsHtml);
    const finalPath = `${targetDirectory}/index.html`;
    writeFile(element, finalPath);
}

exports.generateRecipe = generateRecipe;
exports.generateIndex = generateIndex;