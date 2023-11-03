const FlatWorldGenerator = require('../worldGenerators/FlatWorld');
const { QuickDB } = require("quick.db");

const ChunkColumn = require('prismarine-chunk')('1.18');

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
            filePath: worldPath + '/light.db'
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
                worldHeight: 384
            });

            var start = Date.now();
            chunk = await this.generator.generateChunk(chunk, x, y);

            // await this.dbChunk.set(`${dimension}-${x}-${y}`, chunk.dump());
            // await this.dbLight.set(`${dimension}-${x}-${y}`, chunk.toJson());

            await this.dbChunk.set(`${dimension}-${x}-${y}`, chunk.toJson());
            await this.dbLight.set(`${dimension}-${x}-${y}`, []);

            var end = Date.now();
            var time = end-start;

            this.log.info(`Generated chunk ${x}, ${y} in ${dimension} in ${time}ms`);

            return [false, chunk];
        }

        // console.log(typeof ChunkColumn.fromJson)
        // var chunkD = new ChunkColumn({
        //     minY: -64,
        //     worldHeight: 384
        // });
        var chunkD = ChunkColumn.fromJson( await this.dbChunk.get(`${dimension}-${x}-${y}`) );

        // chunkD.load( await this.dbChunk.get(`${dimension}-${x}-${y}`), 0xFFFF, false, true );
        // chunkD.fromJson( await this.dbLight.get(`${dimension}-${x}-${y}`) );

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
    async dumpChunkLight(x, y, difficulty = 'overworld') {
        var chunk = await this.getChunk(x, y, dimension);
        
        return chunk.toJson;
    }

}

module.exports = World;