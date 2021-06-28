const { readFile, writeFile } = require("./files");
const { converter } = require("./markdown");

const rootPath = process.env.ROOT_PATH || ''

function toSlug(title) {
    return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/"/g, "").replace(/'/g, "").replace(/\?/g, "").trim().toLowerCase().replace(/ /g, "-")
}

function generateRecipe(input, targetDirectory) {
    const fileContent = readFile(input);
    const htmlContent = converter.makeHtml(fileContent)
    const metatdata = converter.getMetadata()
    const title = metatdata.title;
    const type = metatdata.type;
    const typeLink = toSlug(type)
    const htmlTemplate = readFile('./src/template/recipe.html');
    const element = htmlTemplate
        .replace("$$RECETTE_TYPELINK$$", typeLink)
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
        .replace(/\$\$RECETTE_TYPE\$\$/g, type)
        .replace(/\$\$RECETTE_TITLE\$\$/g, title)
        .replace("$$RECETTE_CONTENT$$", htmlContent)
    const finalPath = `${targetDirectory}/${toSlug(title)}.html`;
    writeFile(element, finalPath);
    return {
        title,
        finalPath,
        type,
        typeLink
    }
}

function generateIndex(recipesList, targetDirectory) {
    //console.log(recipesList);
    const listAsHtml = recipesList.map(recipe => {
        return `<li><a href="${rootPath}${recipe.finalPath.replace("docs", "")}" title="${recipe.title}">${recipe.title}</a>`
    }).join("\n");
    
    const htmlTemplate = readFile('./src/template/index.html');
    const element = htmlTemplate
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
        .replace("$$LISTE_RECETTES$$", listAsHtml);
    const finalPath = `${targetDirectory}/index.html`;
    writeFile(element, finalPath);
}

function generateManifest(targetDirectory) {
    const manifestTemplate = readFile('./src/template/manifest.json');
    const element = manifestTemplate
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
    const finalPath = `${targetDirectory}/manifest.json`;
    writeFile(element, finalPath);
}

function generateCSS(targetDirectory) {
    const cssTemplate = readFile('./src/template/css/style.css');
    const element = cssTemplate
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
    const finalPath = `${targetDirectory}/css/style.css`;
    writeFile(element, finalPath);
}


exports.generateRecipe = generateRecipe;
exports.generateIndex = generateIndex;
exports.generateManifest = generateManifest;
exports.generateCSS = generateCSS;