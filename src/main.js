const net = require('net');
const arg = require('arg');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const printer = require("fancy-printer");
const log = printer.create({
	styleSubstitutionsEnabled: true
});

log.setFormat(`%tag %text`);
const args = arg({
	// Types
	'--help': Boolean,
	'--version': Boolean,
    
	'--port': Number, // --port <number> or --port=<number>
	'--host': String, // --name <string> or --name=<string>
});

async function main() {
	console.clear();
	console.log('Easter egg!');
	await sleep(100);
	console.clear();
	if (args['--help']) {
		return console.log(require('./menus').help());
	}
	if (args['--version']) {
		return console.log(require('./menus').version());
	}

	var port = args['--port'] ?? 25565;
	var host = args['--host'] ?? '0.0.0.0';

	if (process.env['SERVER_PORT'] && process.env['P_SERVER_UUID']) {
		printer.addTag("pterodactyl", "WINGS", "", "#959bdb", "#c1f7e2");
		printer.tag("pterodactyl", "Pterodactyl detected! Using pterodactyl port.");
		printer.tag("pterodactyl", "This can be overwritten by --port");
		if (!args['--port']) port = parseInt(process.env['SERVER_PORT']);
	}

	log.log(`&eStarting minecraft server on &c${host}&e:&c${port}`);
	var server = net.createServer();

	server.on('connection', handleConnection);
	server.listen(port, host, function() {    
		log.log(`&eStarted TCP listener on &c${host}&e:&c${port}`);  
	});

	function handleConnection(conn) {
		log.log(`Connection from &c${conn.remoteAddress}:${conn.remotePort} &tis &2open`);

		conn.on('end', () => {
			log.log(`Connection from &c${conn.remoteAddress}:${conn.remotePort} &tis &4closed`);
		});
		conn.on('close', () => {
			log.log(`Connection from &c${conn.remoteAddress}:${conn.remotePort} &tis &4closed`);
		});
		conn.on('error', () => {
			log.error(`Connection from &c${conn.remoteAddress}:${conn.remotePort} &thas an error: &c${String(e)}`);
		});  
	}
}

module.exports = main;