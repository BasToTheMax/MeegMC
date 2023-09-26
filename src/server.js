const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

// Modules
const CommandContext = require('./context/CommandContext');
const ConsolePlayer = require('./context/ConsolePlayer');
const World = require('./context/World');

var supportedWorldGenerations;
supportedWorldGenerations = ['normal'];

class Server {
    constructor(log, a) {
        var [host, port, args, online] = a;
        this.log = log;

        const mc = require('minecraft-protocol');
        const server = mc.createServer({
            'online-mode': online,
            encryption: true,
            host: host,
            port: port,
            version: '1.18.2',
            maxPlayers: 100
        });
        this.server = server;

        var stdin = process.openStdin();
        var t;
        t = this;
        stdin.addListener("data", function(d) {
            var command = String(d).trim();
            
            // Process
            t.onInput(command);
        });

        // Fake players
        this.ConsolePlayer = new ConsolePlayer(this);
        this.commands = {};
        this.players = [];
        this.config = {
            host,
            port,
            online
        };

        this.registerCommand('log', (ctx, args) => {
            ctx.server.log.log(`[${ctx.player.username}] ${args.join(' ')}`);
        });

        this.loadConfig();
        this.loadWorlds();
    }

    registerCommand(name, execute) {
        this.log.log(`Registering command /${name}...`);
        if (this.commands[name]) {
            this.log.warn(`Command /${name} already exists. Existing command will be overwritten.`);
        }
        
        var cmd = {};
        cmd.name = name;
        cmd.run = execute;
        this.commands[name] = cmd;
    }

    onInput(command) {
        const args = String(command).split(' ');
        command = args.shift().toLowerCase();

        if (!this.commands[command]) return this.log.log(`Command /${command} does not exist. Type help or ? for list of commands.`);

        var ctx = new CommandContext(this, this.ConsolePlayer);

        this.commands[command].run(ctx, args);
    }

    loadWorlds() {
        var world = this.config.world;
        if (!world) {
            this.log.error('No world in config. Stopping server. Please regenerate config!');
            return this.stop();
        }
        
        if (!supportedWorldGenerations.includes(world.worldGeneration)) {
            this.log.error(`World has invalid world generation. Current: ${world.worldGeneration}. Supported: ${supportedWorldGenerations.join(', ')}`);
            this.stop();
        }

        this.log.info(`Loading world... Generator: ${world.worldGeneration}`);

        var worldPath = path.join(__dirname, '..', 'world');
        this.log.info('World path: ' + worldPath);

        if (!fs.existsSync(worldPath)) {
            fs.mkdirSync(worldPath);
            this.log.info(`Created world directory.`);
        }

        this.world = new World(
            this,

            require('./worldGenerators/FlatWorld'),
            true,
            true,
            worldPath
        );
    }

    stop() {
        this.log.info('Stopping server!');
        process.exit(0);
    }

    loadConfig() {
        var dir = process.cwd();
        var path = dir + '/config.yaml';
        this.log.info(`Loading config file from ${path}`);

        if (!fs.existsSync(path)) {
            fs.writeFileSync(path, this.createConfig());
        }

        var config = yaml.load(fs.readFileSync(path));

        config.port = this.config.port;
        config.host = this.config.host;
        config.online = this.config.online;

        this.config = config;
        this.log.info('Config loaded!');
    }

    createConfig() {
        var conf = {};

        // conf.license = '<LICENSE CODE>';

        conf.chunks = {
            'render-distance': 10,
            'simulation-distance': 5
        };
        conf.players = {
            limit: 20,
            whitelist: false,
            defaultGamemode: 0,
            hardcore: false,
            difficulty: 'normal',
            savePlayerData: true
        }
        conf.server = {
            motd: 'Minecraft server'
        };
        conf.entities = {
            'spawn-animals': true,
            'spawn-monsters': true,
            'spawn-npcs': true,

            'allow-flight': false
        };
        conf.world = {
            worldGeneration: 'normal',

            'enable-nether': true,
            'enable-end': true,

            seed: 0,

            'max-mobs': 100,
            'max-items': 100,
            'max-entities': 100
        };

        return yaml.dump(conf, {
            indent: 4
        });
    }

}
module.exports = Server;