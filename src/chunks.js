const fs = require('fs');

function getDir(world, x) {
    return `${__dirname}/worlds/${world}/chunks/${x}/`;
}
function getPath(world, x, y) {
    return `${getDir(world, x)}/${y}`;
}

function getChunk(world, x, y) {
    var dir = getDir(world, x);
    var path = getPath(world, x) + y;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return [false, null];
    }
    if (!fs.existsSync(path + '.world')) return [false, null];

    return [true, fs.readFileSync(path + '.world'), fs.readFileSync(path + '.light'), fs.readFileSync(path + '.biome')];
}
function saveChunk(world, x, y, type, data) {
    var dir = getDir(world, x);
    var path = getPath(world, x, y) + '.' + type;

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return [false, null];
    }

    // console.log(typeof data);
    if (!data) return false;
    if (typeof data == 'object') {
        // console.log('Is object')
        fs.writeFileSync(path, JSON.stringify(data));
    } else {
        fs.writeFileSync(path, data);
    }

    return true;
}

module.exports = {
    getChunk,
    saveChunk
};