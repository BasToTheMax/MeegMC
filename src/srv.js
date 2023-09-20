const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

async function main(srv) {
    var [server, log, args] = srv;

    var pluginPath = path.join(__dirname, '../', 'plugins')

    log.info('Loading plugins...');

    if (!fs.existsSync(pluginPath)) fs.mkdirSync(pluginPath);

    const getDirectories = source =>
    fs.readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    var plugins = getDirectories(pluginPath);

    plugins = await checkPlugins(plugins, pluginPath, srv);

    for(let i = 0; i < plugins.length; i++) {
        var pluginData = plugins[i];
        var l = (txt) => log.tag('PLUGIN', `[${pluginData.name}]: ${txt}`);
        srv.log = l;
        srv.args = args;
        var plugin = new pluginData._(srv);
        // if (pluginData.onStart && pluginData.isEnabled) {   
        //     plugin.onStart();
        // }
        if (pluginData.isEnabled) {
            log.info(`Loaded plugin ${pluginData.name}`);
            if (plugin.onStart) plugin.onStart();
        } else {
            log.debug(`${pluginData.name} is disabled!`);
        }
    }

    log.info('Plugins loaded!');

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
            log.error(`Plugin ${pl} does not have a plugin.yaml. Disabling...`);
        } else {

            var rData = fs.readFileSync(plPath + `/${pl}/plugin.yaml`);
            var pluginData = yaml.load(rData);

            var isEnabled = true;
            if (!pluginData.name || !pluginData.author || !pluginData.main) {
                isEnabled = false;
                log.error(`Plugin ${pl} is missing required data. Disabling...`);
            }

            var toPush = {
                ...pluginData,
                isEnabled,
                _: NoPlugin
            };

            if (isEnabled) toPush._ = require('../plugins/' + pl + '/' + pluginData.main);

            plL.push(toPush);

        }
    }

    return plL;
}

module.exports = {
    main
}

class NoPlugin {
    // Used for disabled plugins
}