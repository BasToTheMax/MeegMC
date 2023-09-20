class ExamplePlugin {

    constructor(server) { this.server = server; }
    
    onStart() {
        this.server.log('The plugin system works!');
    }

}

module.exports = ExamplePlugin;