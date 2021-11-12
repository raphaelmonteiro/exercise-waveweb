const request = require('supertest');
const app = require('../../server');
const { getNextId, saveData } = require('../../services/utils.services');
const faker = require('faker');

let AuthorsData;
let ArticlesData;

beforeEach(() => {
    AuthorsData = require("../../../data/authors.json");
    ArticlesData = require("../../../data/articles.json");
})

describe('Authors API', () => {
    it('should create a new article with author Brian Gregory.', async () => {
        const author = AuthorsData[0];

        const article = {
            title: faker.lorem.words(4),
            author_name: author.name
        };

        const nextArticlesId = getNextId(ArticlesData);

        const res = await request(app)
            .post(`/articles`)
            .send(article);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('author_id');
        expect(res.body).toHaveProperty('title');
        expect(res.body.id).toEqual(nextArticlesId);
        expect(res.body.author_id).toEqual(author.id);
        expect(res.body.title).toEqual(article.title);

        remove('articles', ArticlesData, 'title', article.title);
    });

    it('should create a new article to a new author with faker name.', async () => {
        const article = {
            title: faker.lorem.words(4),
            author_name: faker.name.firstName()
        };

        const nextAuthorId = getNextId(AuthorsData);
        const nextArticlesId = getNextId(ArticlesData);

        const res = await request(app)
            .post(`/articles`)
            .send(article);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('author_id');
        expect(res.body).toHaveProperty('title');
        expect(res.body.id).toEqual(nextArticlesId);
        expect(res.body.author_id).toEqual(nextAuthorId);
        expect(res.body.title).toEqual(article.title);

        remove('authors', AuthorsData, 'name', article.author_name);
        remove('articles', ArticlesData, 'title', article.title);
    });
    it('should create a new article with a real author_id.', async () => {
        const author = AuthorsData[0];

        const article = {
            title: faker.lorem.words(4),
            author_id: author.id
        };

        const nextArticlesId = getNextId(ArticlesData);

        const res = await request(app)
            .post(`/articles`)
            .send(article);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('author_id');
        expect(res.body).toHaveProperty('title');
        expect(res.body.id).toEqual(nextArticlesId);
        expect(res.body.author_id).toEqual(author.id);
        expect(res.body.title).toEqual(article.title);

        remove('articles', ArticlesData, 'title', article.title);
    });
    it('should return the error because going to use the invalid author_id.', async () => {
        const nextAuthorId = getNextId(AuthorsData);

        const article = {
            title: faker.lorem.words(4),
            author_id: nextAuthorId
        };

        const res = await request(app)
            .post(`/articles`)
            .send(article);
        
        expect(res.statusCode).toEqual(500);
        expect(res.error.text).toEqual('Author is invalid.');
    });
    it('should return the error because not going to send the title.', async () => {
        const nextAuthorId = getNextId(AuthorsData);

        const article = {
            author_id: nextAuthorId
        };

        const res = await request(app)
            .post(`/articles`)
            .send(article);
        
        expect(res.statusCode).toEqual(500);
        expect(res.error.text).toEqual('Title article is required.');
    });
    it('should return error because going to send author_id and author_name together.', async () => {

        const article = {
            title: faker.lorem.words(4),
            author_name: faker.name.firstName(),
            author_id: getNextId(AuthorsData)
        };

        const res = await request(app)
            .post(`/articles`)
            .send(article);
        
        expect(res.statusCode).toEqual(500);
        expect(res.error.text).toEqual('Send just author id or author name.');
    });
    it('should return error because not going send author.', async () => {
        const article = {
            title: faker.lorem.words(4)
        };

        const res = await request(app)
            .post(`/articles`)
            .send(article);
        
        expect(res.statusCode).toEqual(500);
        expect(res.error.text).toEqual('Author is required.');
    });
    it('should updated title article.', async () => {
        const author = getNewAuthor()
        const article1 = getNewArticle(author)

        const update = {
            article: {
                id: article1.id,
                title: faker.lorem.words(4),
            }
        }

        const res = await request(app)
            .patch(`/articles`)
            .send(update);
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('The articles was updated.');

        const newArticle = ArticlesData.find(art => art.id === article1.id);

        expect(newArticle.title).toEqual(update.article.title);

        remove('authors', AuthorsData, 'id', author.id);
        remove('articles', ArticlesData, 'id', newArticle.id);
    });
    it('should updated author with id on article.', async () => {
        const author = getNewAuthor()
        const author2 = getNewAuthor()
        const article1 = getNewArticle(author)

        const update = {
            article: {
                id: article1.id,
                author_id: author2.id,
            }
        }

        const res = await request(app)
            .patch(`/articles`)
            .send(update);
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('The articles was updated.');

        const newArticle = ArticlesData.find(art => art.id === article1.id);

        expect(newArticle.author_id).toEqual(author2.id);

        remove('authors', AuthorsData, 'id', [author.id, author2.id]);
        remove('articles', ArticlesData, 'id', article1.id);
    });

    it('should updated article through the author name.', async () => {
        const author = getNewAuthor()
        const author2 = getNewAuthor()
        const article1 = getNewArticle(author)

        const update = {
            article: {
                id: article1.id,
                author_name: author2.name,
            }
        }

        const res = await request(app)
            .patch(`/articles`)
            .send(update);
        
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('The articles was updated.');

        const newArticle = ArticlesData.find(art => art.id === article1.id);

        expect(newArticle.author_id).toEqual(author2.id);

        remove('authors', AuthorsData, 'id', [author.id, author2.id]);
        remove('articles', ArticlesData, 'id', article1.id);
    });

    it('should return error because the structure JSON will be send wrong.', async () => {
        const author = getNewAuthor()
        const article1 = getNewArticle(author)

        const update = {
            id: article1.id,
            title: faker.lorem.words(4),
        }

        const res = await request(app)
            .patch(`/articles`)
            .send(update);
        
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Article is required.');
        
        remove('authors', AuthorsData, 'id', author.id);
        remove('articles', ArticlesData, 'id', article1.id);
    });
    it('should return error when send author name and id together.', async () => {
        const author = getNewAuthor()
        const article1 = getNewArticle(author)
        
        const res = await request(app)
            .patch(`/articles`)
            .send({
                article: {
                    id: article1.id,
                    title: faker.lorem.words(4),
                    author_name: faker.name.firstName(),
                    author_id: 1
                }
            });

        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Send just author id or author name.');

        remove('authors', AuthorsData, 'id', author.id);
        remove('articles', ArticlesData, 'id', article1.id);
    });

    it('when ID wrong then error', async () => {
        const author = getNewAuthor()
        const article1 = getNewArticle(author)

        const res = await request(app)
            .patch(`/articles`)
            .send({
                article: {
                    id: article1.id,
                    title: faker.lorem.words(4),
                    author_id: getNextId(AuthorsData)
                }
            });
        
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Author not found');

        remove('authors', AuthorsData, 'id', author.id);
        remove('articles', ArticlesData, 'id', article1.id);
    });

    it('should remove one article.', async () => {
        const author = getNewAuthor();
        const article1 = getNewArticle(author);

        const res = await request(app)
        .delete(`/articles`)
        .send({
            article: article1.id
        });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('The articles was deleted.');

        const removeArticle = ArticlesData.find(article => article.id === article1.id)

        expect(removeArticle).toEqual(undefined);

        remove('authors', AuthorsData, 'id', author.id);
    });
    it('should remove one or more articles.', async () => {
        const author = getNewAuthor();
        const article1 = getNewArticle(author);
        const article2 = getNewArticle(author);
        const article3 = getNewArticle(author);

        const articlesToRemove = [article1.id, article2.id, article3.id]

        const res = await request(app)
        .delete(`/articles`)
        .send({
            article: articlesToRemove
        });

        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('The articles was deleted.');

        articlesToRemove.forEach(articleToRemove => {
            let removeArticle = ArticlesData.find(article => article.id === articleToRemove)
            expect(removeArticle).toEqual(undefined);
        });

        remove('authors', AuthorsData, 'id', author.id);
    });
    it('when JSON is wrong Then return error', async () => {
        const res = await request(app)
        .delete(`/articles`)
        .send({});

        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Article is required.');
    });
    it('should return error because the article id is invalid.', async () => {
        const res = await request(app)
        .delete(`/articles`)
        .send({ article: getNextId(ArticlesData) });

        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual('Article is not found.');
    });
});

const getNewAuthor = () => {
    const author = {
        id: getNextId(AuthorsData),
        name: faker.name.firstName()
    }
    create('authors', AuthorsData, author);

    return author;
}

const getNewArticle = (author) => {
    const article = {
        id: getNextId(ArticlesData),
        title: faker.lorem.words(4),
        author_id: author.id
    }

    create('articles', ArticlesData, article);

    return article;
}

const create = (nameFile, data, object) => {
    data.push(object);
    saveData(nameFile, data);
}

const remove = async (nameFile, data, property, values) => {
    if(!Array.isArray(values)) {
        values = [values];
    }

    values.forEach(value => {
        const key = data.findIndex(item => item[property] === value);
        if (key === -1)  return;
        data.splice(key, 1); 
    });
    
    saveData(nameFile, data);
}