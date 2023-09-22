const FlatWorldGenerator = require('../worldGenerators/FlatWorld');

class World {
    constructor(seed, generator = FlatWorldGenerator, hasNether = true, hasEnd = true) {

        this.seed = seed;
        this.generator = new generator(seed);
        this.hasNether = hasNether;
        this.hasEnd = hasEnd;

    }
}

module.exports = World;