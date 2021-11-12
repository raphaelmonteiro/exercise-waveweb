const request = require('supertest');
const app = require('../../server');

let AuthorsData;

beforeEach(() => {
    AuthorsData = require("../../../data/authors.json");
})

describe('Authors API', () => {
    it('should show list authors and your articles.', async () => {
        const res = await request(app).get(`/authors`);
        
        commonAuthorAPI(res);
    });

    it('should show the first page from the list of authors and yours articles.', async () => {
        const page = 0;

        const res = await request(app).get(`/authors?page=${page}`);
    
        commonAuthorAPI(res, page);
    });
    it('should show until 15 authors in list result.', async () => {
        const page = 1;
        const perPage = 15;

        const res = await request(app).get(`/authors?page=${page}`);
    
        commonAuthorAPI(res, page);
    });

    it('should return a message error, because we need to pass one or more with value in per_page query.', async () => {
        const perPage = 0;
        const page = 1;

        const res = await request(app).get(`/authors?page=${page}&per_page=${perPage}`);
    
        expect(res.statusCode).toEqual(500);
        expect(res.error.text).toEqual('Per page need to be one or more.');
    });
    it('should return a message error, because we need to pass id or name with value in order query parameter.', async () => {
        const perPage = 5;
        const page = 1;

        const res = await request(app).get(`/authors?page=${page}&per_page=${perPage}&order=text`);
    
        expect(res.statusCode).toEqual(500);
        expect(res.error.text).toEqual('Order need to be id or name.');
    });
    it('should return a message error, because we need to pass ASC or DESC with value in the sort query parameter.', async () => {
        const perPage = 5;
        const page = 1;

        const res = await request(app).get(`/authors?page=${page}&per_page=${perPage}&order=id&sort=test`);
    
        expect(res.statusCode).toEqual(500);
        expect(res.error.text).toEqual('Sort need to be asc or desc.');
    });
})

const commonAuthorAPI = (res, page = 1, perPage = 5) => {
    const totalPages = Math.ceil(AuthorsData.length/perPage)

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('page');
    expect(res.body).toHaveProperty('nextPage');
    expect(res.body).toHaveProperty('totalPage');
    expect(res.body).toHaveProperty('total');
    expect(res.body).toHaveProperty('result');
    expect(res.body.page).toEqual(page === 0 ? 1 : page);
    expect(res.body.total).toEqual(AuthorsData.length);
    expect(res.body.totalPage).toEqual(totalPages);
    expect(res.body.nextPage).toEqual(totalPages > res.body.page ? parseInt(res.body.page) + 1 : null);
    expect(res.body.result.length).toEqual(perPage);
};