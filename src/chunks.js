const fs = require('fs');

function getDir(world, x) {
    return `${__dirname}/worlds/${world}/chunks/${x}/`;
}
function getPath(world, x, y) {
    return `${getDir(world, x)}/${y}.world`;
}

function getChunk(world, x, y) {
    var dir = getDir(world, x);
    var path = getPath(world, x, y);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return [false, null];
    }
    if (!fs.existsSync(path)) return [false, null];

    return [true, fs.readFileSync(path)];
}
function saveChunk(world, x, y, data) {
    var dir = getDir(world, x);
    var path = getPath(world, x, y);

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        return [false, null];
    }

    fs.writeFileSync(path, data);

    return true;
}

module.exports = {
    getChunk,
    saveChunk
};