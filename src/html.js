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

exports.generateRecipe = generateRecipe;