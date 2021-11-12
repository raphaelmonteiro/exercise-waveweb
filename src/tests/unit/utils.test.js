const faker = require('faker');
const { getNextId, sortData } = require('../../services/utils.services');

const testSort = [
    {id: 1, name: "a"},
    {id: 2, name: "b"},
    {id: 3, name: "c"},
    {id: 4, name: "d"},
    {id: 6, name: "e"}
]

describe('Utils Service', () => {
    it('show return the next id', () => {
        const test = [
            {id: 1, name: faker.name.firstName()},
            {id: 2, name: faker.name.firstName()},
            {id: 3, name: faker.name.firstName()},
            {id: 4, name: faker.name.firstName()},
            {id: 6, name: faker.name.firstName()}
        ]

        const nextIs = getNextId(test);

        expect(nextIs).toEqual(7);
    })
    it('show return name in sort asc', () => {
        const data = sortData(testSort, "name", "asc");
        expect(data[0].name).toEqual("a");
        expect(data[4].name).toEqual("e");
    })
    it('show return name in sort desc', () => {
        const data = sortData(testSort, "name", "desc");
        expect(data[0].name).toEqual("e");
        expect(data[4].name).toEqual("a");
    })
    it('show return id in sort desc', () => {
        const data = sortData(testSort, "id", "desc");
        expect(data[0].id).toEqual(6);
        expect(data[4].id).toEqual(1);
    })
    it('show return id in sort asc', () => {
        const data = sortData(testSort, "id", "asc");
        expect(data[0].id).toEqual(1);
        expect(data[4].id).toEqual(6);
    })
})