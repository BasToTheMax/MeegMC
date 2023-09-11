const mcData = require('minecraft-data')('1.20.1');
const Chunk = require('prismarine-chunk')('1.20.1')
const Vec3 = require('vec3')


async function main(srv) {
    const loginPacket = mcData.loginPacket
    var [server, log, ars] = srv;

    server.on('login', (client) => {

        log.info(`${client.username} logged in`);

        client.write('login', {
            entityId: client.id,
            isHardcore: false,
            gameMode: 0,
            previousGameMode: 255,
            worldNames: loginPacket.worldNames,
            dimensionCodec: loginPacket.dimensionCodec,
            dimension: loginPacket.dimension,
            worldName: 'minecraft:overworld',
            hashedSeed: [0, 0],
            maxPlayers: server.maxPlayers,
            viewDistance: 10,
            reducedDebugInfo: false,
            enableRespawnScreen: true,
            isDebug: false,
            isFlat: false
        });

        log.log('> Creating chunk');

        var chunk = new Chunk({
            minY: -64,
            worldHeight: 384
        });

        for (let x = 0; x < 16; x++) {
            for (let z = 0; z < 16; z++) {
              chunk.setBlockType(new Vec3(x, 100, z), mcData.blocksByName.grass_block.id)
              chunk.setBlockData(new Vec3(x, 100, z), 1)
              for (let y = 0; y < 256; y++) {
                chunk.setSkyLight(new Vec3(x, y, z), 15)
              }
            }
          }
          
          var skyLight = [],blockLight = [];
          chunk.skyLightSections.forEach(e=>e!==null&&skyLight.push(new Uint8Array(e.data.buffer)));
          chunk.blockLightSections.forEach(e=>e!==null&&blockLight.push(new Uint8Array(e.data.buffer)));

          log.log('> Chunk created');

          client.write('map_chunk', {
            x: 0,
            z: 0,
            groundUp: true,
            biomes: chunk.dumpBiomes&&chunk.dumpBiomes(),
            heightmaps: {
              type: 'compound',
              name: '',
              value: {} // Client will accept fake heightmap
            },
            chunkData: chunk.dump(),
            blockEntities: [],
            trustEdges:true,
            blockLightMask:chunk.blockLightMask.toLongArray(),
            emptyBlockLightMask:chunk.emptyBlockLightMask.toLongArray(),
            skyLightMask:chunk.skyLightMask.toLongArray(),
            emptySkyLightMask:chunk.emptySkyLightMask.toLongArray(),
            skyLight,
            blockLight
          });

          client.write('position', {
            x: 0,
            y: 105,
            z: 0,
            yaw: 0,
            pitch: 0,
            flags: 0x00
        });

        log.log('> Chunk sent!');

    });
}

module.exports = {
    main
}