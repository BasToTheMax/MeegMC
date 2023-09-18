const path = require('path');
const fs = require('fs');

async function main(srv) {
    var [server, log, args] = srv;

    var pluginPath = path.join(__dirname, '../', 'plugins')

    log.info('Loading plugins...');
    log.debug(pluginPath);

    if (!fs.existsSync(pluginPath)) fs.mkdirSync(pluginPath);

    const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    var plugins = getDirectories(pluginPath);
    console.log(plugins);
}

module.exports = {
    main
}