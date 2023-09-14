const mc = require('minecraft-protocol');
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
    
	'--port': Number,
	'--host': String,
	'--offline': Boolean
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
	var online = args['--offline'] ?? true;
	online = !online

	if (online == false) {
		log.warn("Running insecure mode!")
	}

	if (process.env['SERVER_PORT'] && process.env['P_SERVER_UUID']) {
		log.addTag("pterodactyl", "WINGS", "", "#959bdb", "#c1f7e2");
		log.tag("pterodactyl", "Pterodactyl detected! Using pterodactyl port.");
		log.tag("pterodactyl", "This can be overwritten by --port");
		if (!args['--port']) {
			port = parseInt(process.env['SERVER_PORT']);
		}
	}

	log.info(`&eStarting minecraft server on &c${host}&e:&c${port}`);
	
	const server = mc.createServer({
		'online-mode': online,
		encryption: true,
		host: host,
		port: port,
		version: '1.18.2',
		maxPlayers: 100
	});

	require('./server').main([
		server,
		log,
		args
	]);
}

module.exports = main;