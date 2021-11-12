const ArticlesData = require("../../data/articles.json");
const AuthorsServices = require("./authors.services");
const { getNextId, saveData } = require("./utils.services");

module.exports = class {

    authorsServices;

    constructor() {
        this.authorsServices = new AuthorsServices();
    }

    post(data) {
        if (!data.title) throw new Error('Title article is required.');
        if (data.author_id && data.author_name) throw new Error('Send just author id or author name.');
        if (!data.author_id && !data.author_name) throw new Error('Author is required.');

        const author = this.authorsServices.getOneOrCreateOne(data?.author_id, data?.author_name)

        if (!author) throw new Error('Author is invalid.');
        
        const newArticle = {
            "id": getNextId(ArticlesData),
            "author_id": author.id,
            "title": data.title
        }

        ArticlesData.push(newArticle);

        saveData('articles', ArticlesData);

        return newArticle;
    }

    update(data) {
        if (!data.article) throw new Error('Article is required.');

        if (!Array.isArray(data.article)) {
            data.article = [data.article];
        }

        data.article.forEach(bodyArticle => {
            const key = ArticlesData.findIndex(articleObj => bodyArticle.id === articleObj.id);

            if(key < 0) throw new Error('Article not found');

            let articleObj = ArticlesData[key];

            if (bodyArticle.id !== articleObj.id) return articleObj;

            if (bodyArticle.author_id && bodyArticle.author_name) throw new Error('Send just author id or author name.');

            let author;
            if (bodyArticle?.author_id || bodyArticle?.author_name) {
                author = this.authorsServices.getOneOrCreateOne(bodyArticle?.author_id, bodyArticle?.author_name);
            }

            if (bodyArticle?.author_id && !author) {
                throw new Error('Author not found.');
            }

            articleObj.title = bodyArticle.title || articleObj.title;
            articleObj.author_id = author ? author.id : articleObj.author_id;
        });

        saveData('articles', ArticlesData);
    }

    delete(data) {
        if (!data.article) throw new Error('Article is required.');

        if (!Array.isArray(data.article)) {
            data.article = [data.article];
        }

        data.article.forEach(id => {
            const key = ArticlesData.findIndex(art => art.id === id);
            
            if (key === -1)  throw new Error('Article is not found.');

            ArticlesData.splice(key, 1); 
        })

        saveData('articles', ArticlesData);
    }

    getOne(id) {
        const article = ArticlesData.filter(article => article.id === id);

        return article && article.length ? article[0] : null;
    }
}