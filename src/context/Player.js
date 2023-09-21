class Player {
    constructor(server, uuid, username) {
        this.server = server;
        this.uuid = uuid;
        this.username = username;
    }

    setUsername(name) {
        if (name) this.username = name;
    }
    getUUID() { return this.uuid; }
}
module.exports = Player;