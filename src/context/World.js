const FlatWorldGenerator = require('../worldGenerators/FlatWorld');
const { QuickDB } = require("quick.db");

const registry = require('prismarine-registry')('1.18.2')
const ChunkColumn = require('prismarine-chunk')('1.18.2')

const Keyv = require('keyv');

function rand(min, max) {

    min = Math.ceil(min);
    
    max = Math.floor(max);
    
    return Math.floor(Math.random() * (max - min + 1)) + min;
    
}

class World {
    constructor(srv, generator = FlatWorldGenerator, hasNether = true, hasEnd = true, worldPath) {

        var { log } = srv;

        this.log = log;

        this.seed = 0;
        this.hasNether = hasNether;
        this.hasEnd = hasEnd;
        this.path = worldPath;

        this.db = new QuickDB({
            filePath: worldPath + '/level.db',
            table: 'level'
        });
        this.worldDB = new QuickDB({
            filePath: worldPath + '/world.db'
        });
        this.dbChunk = new Keyv(`sqlite://${worldPath}/chunks.db`);
        this.dbLight = this.worldDB.table('light');

        this.loadSeed();

        this.generator = new generator(this.seed);

    }

    async loadSeed() {
        if (!await this.db.get('seed')) {
            var seed = rand(0, Math.pow(2, 64))
            this.log.info('Seed generated!');
            await this.db.set('seed', seed)
        }

        var seed = await this.db.get('seed');
        this.log.info(`World seed: ${seed}`);
    }

    async chunkExists(x, y, dimension = 'overworld') {
        if (
            await this.dbChunk.get(dimension + '-' + x + '-' + y) &&
            await this.dbLight.get(dimension + '-' + x + '-' + y)
        ) {
            return true;
        }

        return false;
    }
    async getChunk(x, y, dimension = 'overworld') {
        if (!await this.chunkExists(x, y, dimension)) {
            var chunk = new ChunkColumn({
                minY: -64,
                worldHeight: 320
            });

            chunk = this.generator.generateChunk(chunk, x, y);

            await this.dbChunk.set(`${dimension}-${x}-${y}`, chunk.dump());
            await this.dbLight.set(`${dimension}-${x}-${y}`, chunk.dumpLight());

            this.log.info(`Generated chunk ${x}, ${y} (${dimension})`);

            return [false, chunk];
        }

        var chunkD = new ChunkColumn({
            minY: -64,
            worldHeight: 320
        });

        console.log(chunkD);

        chunkD.load( await this.dbChunk.get(`${dimension}-${x}-${y}`) , 0xFFFF, false, true );
        chunkD.loadLight( await this.dbLight.get(`${dimension}-${x}-${y}`) );

        return [true, chunkD];
    }

    async saveChunk(x, y, dimension = 'overworld', blocks, light) {

        await this.dbChunk.set(`${dimension}-${x}-${y}`, blocks);
        await this.dbLight.set(`${dimension}-${x}-${y}`, light);

        return true;
    }

    async dumpChunkBlocks(x, y, difficulty = 'overworld') {
        var chunk = await this.getChunk(x, y, dimension);

        return chunk.dump();
    }
    async dumpChunkBlocks(x, y, difficulty = 'overworld') {
        var chunk = await this.getChunk(x, y, dimension);
        
        return chunk.dumpLight;
    }

}

module.exports = World;