var udp = require('dgram');
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
		log.addTag("pterodactyl", "WINGS", "", "#959bdb", "#c1f7e2");
		log.tag("pterodactyl", "Pterodactyl detected! Using pterodactyl port.");
		log.tag("pterodactyl", "This can be overwritten by --port");
		if (!args['--port']) {
			port = parseInt(process.env['SERVER_PORT']);
		}
	}

	log.info(`&eStarting minetest server on &c${host}&e:&c${port}`);
	var server = udp.createSocket('udp4');
	server.on('error', (err) => {
		log.error(err);
	});
	server.on('message', (data, info) => {
		console.log('data', info, data);
		// server.send([0x01], info.port, info.address);
		var chunks = [];

		var [peer, channel] = checkHeader(data);
		var res = Buffer.alloc(4 + 2 + 1 + 1 + 2 + 1 + 1 + 2);
		res.writeUInt32BE(0x4f457403); // 4 bit

		res.writeUInt16BE(peer); // 2 bit
		res.writeUInt8(channel); // 1 bit

		res.writeUInt8(0); // rel type (1)
		res.writeUInt16BE(65500); // seq (2)

		res.writeUInt8(0); // rel cont type (1)
		res.writeUInt8(1); // cont type (1)

		res.writeUInt16BE(5); // new peer id (2)

		server.send(res, info.port, info.address)
	});
	server.on('listening', () => {
		log.info(`&eServer listening at &c${host}&e:&c${port}`);
	});
	server.on('close', () => {
		log.info(`&eServer has &cclosed.`)
	});
	server.on('error', (err) => {
		log.error(err)
	});
	server.on('connect', (a1, a2) => {
		log.log('Connection', a1, a2);
	});
	
	server.bind(port, host);
}

module.exports = main;

function checkHeader(data) {
	var ok = true;
	if (!checkData(data)) ok = false;
	var peer = data.readUInt16BE(4);
	var channel = data.readUInt8(5);
	console.log('d', peer, channel);
	return [peer, channel];
}
function checkData(data) {
	var ok = true;
	if (!checkVal(data[0], 0x4F)) ok = false;
	if (!checkVal(data[1], 0x45)) ok = false;
	if (!checkVal(data[2], 0x74)) ok = false;
	if (!checkVal(data[3], 0x03)) ok = false;
	return ok;
}
function checkVal(data, corrVal) {
	if (data == corrVal) return true;
	return false;
}