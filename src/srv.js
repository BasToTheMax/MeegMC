const path = require('path');
const fs = require('fs');
const YAML = require('yaml')

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

    plugins = await checkPlugins(plugins, pluginPath, srv);

    var stdin = process.openStdin();

    stdin.addListener("data", function(d) {
        var command = String(d).trim();
        
        // Process
      });
    
}

function checkPlugins(plugins, plPath, srv) {
    var log = srv[1];
    var plL;
    plL = [];
    for(let i = 0; i < plugins.length; i++) {
        var pl = plugins[i];
        if (!fs.existsSync(plPath + `/${pl}/plugin.yaml`)) {
            log.error(`${pl} does not have a plugin.yaml. Disabling...`);
        } else {
            plL.push(pl);

            var pluginData = YAML.parse(plPath + `/${pl}/plugin.yaml`);

            console.log(pluginData)

            if (!fs.existsSync(plPath + `/${pl}/plugin.yaml`)) {
                log.error(`${pl} does not have a plugin.yaml. Disabling...`);
            } else {
                plL.push(pl);
            }
        }
    }
}

module.exports = {
    main
}