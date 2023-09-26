const FlatWorldGenerator = require('../worldGenerators/FlatWorld');
const { QuickDB } = require("quick.db");

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

}

module.exports = World;