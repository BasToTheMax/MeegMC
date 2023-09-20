class ExamplePlugin {

    constructor(server) { this.server = server; }
    
    onStart() {
        this.server.log('This is example plugin!');
    }

}

module.exports = ExamplePlugin;