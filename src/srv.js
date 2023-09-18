const path = require('path');

async function main(srv) {
    var [server, log, args] = srv;

    var pluginPath = path.join(__dirname, '../', 'plugins')

    log.info('Loading plugins...');
    log.debug(pluginPath);
}

module.exports = {
    main
}