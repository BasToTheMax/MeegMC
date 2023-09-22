const Seed = require('seed-random');
const Chunk = require('prismarine-chunk')('1.18.2');
const mcData = require('minecraft-data')('1.18.2');

class BaseGenerator {
    constructor(seed) {
        if (!seed) seed = this.generateSeed();

        this.seed = seed;
    }

    generateSeed() {
        var seed = Seed();
        this.seed = seed;
    }

    getChunk(x, y) {
        const chunk = new Chunk({
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

        let skyLight = [], blockLight = [];
        chunk.skyLightSections.forEach(e => e !== null && skyLight.push(new Uint8Array(e.data.buffer)));
        chunk.blockLightSections.forEach(e => e !== null && blockLight.push(new Uint8Array(e.data.buffer)));

        return chunk;

    }
}

module.exports = BaseGenerator;