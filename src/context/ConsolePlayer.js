const Player = require('./Player')
class ConsolePlayer extends Player {
    constructor(server) {
        super(server, '0000', 'Console');

        this.setUsername('Console')
    }
}
module.exports = ConsolePlayer;