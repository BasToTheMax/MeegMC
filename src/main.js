// Import packages
const arg = require('arg');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Logging
const printer = require("fancy-printer");
const log = printer.create({
	styleSubstitutionsEnabled: true
});

// Logginf format
log.setFormat(`%tag %text`);

// Console arguments
const args = arg({
	// Types
	'--help': Boolean,	
	'--version': Boolean,
    
	'--port': Number,
	'--host': String,
	'--offline': Boolean
});

// Main function
async function main() {
	// Clear the screen
	console.clear();

	log.info(`Using dir ${process.cwd()}`);

	// Help command
	if (args['--help']) {
		return console.log(require('./menus').help());
	}
	// Version command
	if (args['--version']) {
		return console.log(require('./menus').version());
	}

	// Get host and port from arguments
	var port = args['--port'] ?? 25565;
	var host = args['--host'] ?? '0.0.0.0';

	// Offline mode
	var online = args['--offline'] ?? true;
	online = !online

	// Log in console if offline mode is enabled
	if (online == false) {
		log.warn("Running insecure mode!")
	}

	// Use pterodactyl port
	if (process.env['SERVER_PORT'] && process.env['P_SERVER_UUID']) {
		// Logging
		log.addTag("pterodactyl", "WINGS", "", "#959bdb", "#c1f7e2");

		// Use ptero port
		if (!args['--port']) {
			log.tag("pterodactyl", "Pterodactyl detected! Using pterodactyl port.");
			log.tag("pterodactyl", "This can be overwritten by --port");
			port = parseInt(process.env['SERVER_PORT']);
		} else {
			log.tag("pterodactyl", "Pterodactyl detected, but using --port");
		}
	}

	log.info(`&eStarting minecraft server on &c${host}&e:&c${port}`);
	
	// Create mc server using protocol
	

	// Add log for plugins
	log.addTag("plugin", "PLUGIN", "", "#424ef5", "");

	// Start
	var Server = require('./server');
	var server = new Server(
		log,
		[
			host,
			port,
			args,
			online
		]
	);

}

module.exports = main;
