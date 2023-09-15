const mcData = require('minecraft-data')('1.18.2');
const Chunk = require('prismarine-chunk')('1.18.2')
const Vec3 = require('vec3');

const chunkSave = require('./chunks');

function sendChunk(client, x, y) {
  
  var chunk = new Chunk({
    minY: -64,
    worldHeight: 384
  });

  var ch = chunkSave.getChunk('world', x, y);
  if (ch[0] == false) {
    for (let x = 0; x < 16; x++) {
      for (let z = 0; z < 16; z++) {
        chunk.setBlockType(new Vec3(x, 100, z), mcData.blocksByName.grass_block.id)
        chunk.setBlockData(new Vec3(x, 100, z), 1)
        for (let y = 0; y < 256; y++) {
          chunk.setSkyLight(new Vec3(x, y, z), 15)
        }
      }
    }
    
    var skyLight = [], blockLight = [];
    chunk.skyLightSections.forEach(e => e !== null && skyLight.push(new Uint8Array(e.data.buffer)));
    chunk.blockLightSections.forEach(e => e !== null && blockLight.push(new Uint8Array(e.data.buffer)));

    chunkSave.saveChunk('world', x, y, 1, chunk.dump());
    chunkSave.saveChunk('world', x, y, 1, chunk.dumpLight());
    chunkSave.saveChunk('world', x, y, 1, chunk.loadLight());
  } else {
    chunk.load(ch[1], 0xFFFF, false, true);
  }

  client.write('map_chunk', {
    x: x,
    z: y,
    groundUp: true,
    biomes: chunk.dumpBiomes && chunk.dumpBiomes(),
    heightmaps: {
      type: 'compound',
      name: '',
      value: {} // Client will accept fake heightmap
    },
    chunkData: chunk.dump(),
    blockEntities: [],
    trustEdges: true,
    blockLightMask: chunk.blockLightMask.toLongArray(),
    emptyBlockLightMask: chunk.emptyBlockLightMask.toLongArray(),
    skyLightMask: chunk.skyLightMask.toLongArray(),
    emptySkyLightMask: chunk.emptySkyLightMask.toLongArray(),
    skyLight,
    blockLight
  });

}



async function main(srv) {
  const loginPacket = mcData.loginPacket
  var [server, log, ars] = srv;

  server.on('login', (client) => {

    log.info(`${client.username} logged in`);

    client.registerChannel('minecraft:brand', ['string', []])
    client.on('minecraft:brand', console.log)

    client.write('login', {
      entityId: client.id,
      isHardcore: false,
      gameMode: 0,
      previousGameMode: -1,
      worldNames: loginPacket.worldNames,
      dimensionCodec: loginPacket.dimensionCodec,
      dimension: loginPacket.dimension,
      worldType: 'minecraft:overworld',
      worldName: 'minecraft:overworld',
      hashedSeed: loginPacket.hashedSeed,
      maxPlayers: server.maxPlayers,
      viewDistance: 10,
      simulationDistance: 10,
      reducedDebugInfo: false,
      enableRespawnScreen: true,
      isDebug: false,
      isFlat: false
    });

    for(let i=0; i<=10; i++) {
      for(let o=0; o<=10; o++) {
        sendChunk(client, i, o);
      }
    }
  

    client.write('position', {
      x: 0,
      y: 105,
      z: 0,
      yaw: 0,
      pitch: 0,
      flags: 0x00
    });

    log.log('> Chunk sent!');

    client.writeChannel('minecraft:brand', 'Retslav');

    client.on('end', (reason) => {
      log.info(`${client.username} left the game. Reason: ${reason}`);
      delete client;
    });

  });
}

module.exports = {
  main
}