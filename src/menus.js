var menus;
menus = {};

menus.help = () => {
    var res = 'Usage: ./server <args>\n';

    res += '\t--help ++ Shows this menu\n';
    res += '\t--version ++ Shows the version\n\n';

    res += '\t--host ++ Sets the host ( 0.0.0.0 )\n';
    res += '\t--port ++ Sets the port ( 25565 )\n';
    res += '\t--online ++ Enables minecraft authentication ( true )\n';

    return res;
};

menus.version = () => {
    var res = 'Version: ';

    res += require('../package.json').sysver;

    return res;
};

module.exports = menus;