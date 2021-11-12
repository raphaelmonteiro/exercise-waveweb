const AuthorsData = require("../../data/authors.json");
const ArticlesData = require("../../data/articles.json");
const CountriesData = require("../../data/countries.json");
const { getNextId, sortData, saveData } = require("./utils.services");

module.exports = class {
    constructor() {}

    getList(page = 1, order = "id", sort = "desc", perPage = 5) {
        const total = AuthorsData.length;
        const data = sortData(AuthorsData, order, sort).slice((page-1)*perPage, page*perPage);

        const result = data.map(author => {
            author.country = author.country_code ? CountriesData[author.country_code.toLowerCase()] : null;
            author.articles = ArticlesData.filter( article => article.author_id === author.id);

            return author;
        });

        return {
            total, result
        };
    }

    new(name, country_code = null) {
        if (!name) return null;

        const newAuthor = {
            "id": getNextId(AuthorsData),
            "name": name,
            "country_code": country_code
        }

        AuthorsData.push(newAuthor)

        saveData('authors', AuthorsData)

        return newAuthor
    }

    getOneOrCreateOne(id = null, name = null) {
        let author;

        if (!id && !name) return null;

        author = AuthorsData.find(author => author.id === id || author.name === name);

        if (!author && name) {
            author = this.new(name);
        }

        return author;
    }
}