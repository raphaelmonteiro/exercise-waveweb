var fs = require('fs');
const projectPath = require('path').resolve('./');

const getNextId = (data) => {
    const lastData = data.slice(-1)[0];
    return parseInt(lastData.id) + 1;
}

const sortData = (data, order, sort = "asc") => {
    const isAsc = sort === "asc";

    data.sort( ( objA, objB )  => {
        if ( objA[order] < objB[order] ){
        return isAsc ? -1 : 1;
        }
        if ( objA[order] > objB[order] ){
        return isAsc ? 1 : -1;
        }
        return 0;
    });

    return data;
}

const saveData = (nameFile, data) => {
    
    if (!fs.existsSync(`${projectPath}/data/${nameFile}.json`)) throw new Error(`${nameFile} not found`);

    fs.writeFile(`${projectPath}/data/${nameFile}.json`,JSON.stringify(data), function(err){
        if(err) throw new Error(err);
    });
}

exports.getNextId = getNextId;
exports.sortData = sortData;
exports.saveData = saveData;