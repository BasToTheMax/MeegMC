const { Vec3 } = require("vec3");

class Player {
    constructor(server, uuid, username) {
        this.server = server;
        this.uuid = uuid;
        this.username = username;

        this.position = new Vec3(0, 0, 0);
        this.look = { yaw: 0, pitch: 0 };
        this.gamemode = 0;
        this.health = 20;
        this.food = 20;
        this.xp = 0;
        
        this.heldItemSlot = 0;
        this.onGround = true;

        this.inventory = {};
    }

    setUsername(name) {
        if (name) this.username = name;
    }
    getUUID() { return this.uuid; }
}
module.exports = Player;