const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

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

        this.registerCommand('log', (ctx, args) => {
            ctx.server.log.log(`[${ctx.username}] ${ctx.args.join(' ')}`);
        });
        this.registerCommand('log', (ctx, args) => {
            ctx.server.log.log(`[${ctx.username}] ${ctx.args.join(' ')}`);
        });
    }

    registerCommand(name, execute) {
        if (!this.commands) this.commands = {};
        this.log.log(`Registering command /${name}...`);
        if (this.commands.name) {
            this.log.warn(`Command /${name} already exists. Existing command will be overwritten.`);
        }
        
        var cmd = {};
        cmd.name = name;
        cmd.run = execute;
        this.commands.name = cmd;
    }

    onInput(command) {
        console.log(`> ${command}`);
    }

}
module.exports = Server;