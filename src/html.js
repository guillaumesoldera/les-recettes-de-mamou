const { readFile, writeFile } = require("./files");
const { converter } = require("./markdown");

const rootPath = process.env.ROOT_PATH || ''

const frCollator = new Intl.Collator('fr');


function toSlug(title) {
    return title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/"/g, "").replace(/'/g, "").replace(/\?/g, "").trim().toLowerCase().replace(/ /g, "-")
}

const capitalizeFirstLetter = ([ first, ...rest ], locale = 'fr-FR') => first.toLocaleUpperCase(locale) + rest.join('')

function getType(input) {
    const fileContent = readFile(input);
    const htmlContent = converter.makeHtml(fileContent)
    const metatdata = converter.getMetadata()
    return capitalizeFirstLetter(metatdata.type);
}

function generateRecipeHeader(allSortedTypes, activeType) {
    const htmlTemplate = readFile('./src/template/header-recipe.html');
    const menuItems = allSortedTypes.map(type => {
        let linkClass = ""
        if (activeType === type) {
            linkClass = "active"
        }
        return `<li><a class="${linkClass}" href="${rootPath}/recettes/${toSlug(type)}" title="${type}">${type}</a></li>`
    }).join("\n");
    return htmlTemplate
        .replace("$$MENU_ITEMS$$", menuItems)
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
}

function generateRecipe(input, recipeHeader, targetDirectory) {
    const fileContent = readFile(input);
    const htmlContent = converter.makeHtml(fileContent)
    const metatdata = converter.getMetadata()
    const title = metatdata.title;
    const type = metatdata.type;
    const typeLink = toSlug(type)
    const htmlTemplate = readFile('./src/template/recipe.html');
    const element = htmlTemplate
        .replace("$$RECIPE_HEADER$$", recipeHeader)
        .replace("$$RECETTE_TYPELINK$$", typeLink)
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
        .replace(/\$\$RECETTE_TYPE\$\$/g, type)
        .replace(/\$\$RECETTE_TITLE\$\$/g, title)
        .replace("$$RECETTE_CONTENT$$", htmlContent)
    const finalPath = `${targetDirectory}/${typeLink}/${toSlug(title)}.html`;
    writeFile(element, finalPath);
    return {
        title,
        finalPath,
        type,
        typeLink,
        typeTitle: capitalizeFirstLetter(type)
    }
}

function generateIndex(recipesList, allSortedTypes, targetDirectory) {
    //console.log(recipesList);
    const listAsHtml = recipesList.map(recipe => {
        return `<li><a href="${rootPath}${recipe.finalPath.replace("docs", "")}" title="${recipe.title}">${recipe.title}</a>`
    }).join("\n");
    
    const htmlTemplate = readFile('./src/template/index.html');
    const menuItems = allSortedTypes.map(type => {
        return `<li><a class="paper" href="${rootPath}/recettes/${toSlug(type)}" title="${type}">${type}</a></li>`
    }).join("\n");
    const element = htmlTemplate
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
        //.replace("$$LISTE_RECETTES$$", listAsHtml);
        .replace("$$LISTE_PARTS$$", menuItems);
    const finalPath = `${targetDirectory}/index.html`;
    writeFile(element, finalPath);
}

function generateParts(allSortedTypes, recipesList, type, targetDirectory) {
    const partsHeader = generateRecipeHeader(allSortedTypes, type)
    const htmlTemplate = readFile('./src/template/parts.html');
    const listAsHtml = recipesList.sort((a, b) => frCollator.compare(a.title, b.title)).map(recipe => {
        return `<li><a class="paper" href="${rootPath}${recipe.finalPath.replace("docs", "")}" title="${recipe.title}">${recipe.title}</a>`
    }).join("\n");
    const element = htmlTemplate
        .replace(/\$\$ROOT_PATH\$\$/g, rootPath)
        .replace("$$PARTS_HEADER$$", partsHeader)
        .replace("$$PARTS_TITLE$$", type)
        .replace("$$LISTE_RECETTES$$", listAsHtml);
    const finalPath = `${targetDirectory}/${toSlug(type)}.html`;
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
exports.generateParts = generateParts;
exports.generateIndex = generateIndex;
exports.generateManifest = generateManifest;
exports.generateCSS = generateCSS;
exports.getType = getType;
exports.generateRecipeHeader = generateRecipeHeader;