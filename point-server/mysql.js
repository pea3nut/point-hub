const Path = require('path');
const Fs = require('fs');
const Mysql = require('mysql');
const conf = require('../conf.json');
const debug = require('debug')('e:server');

let connection = null;

// Init
(async function (onInit) {
    console.log('After 3s to init mysql');
    await new Promise(r => setTimeout(r, 3000)); // FIXME: waiting for mysql up and --test

    const initConn = Mysql.createConnection({
        host : conf.mysql.host,
        port : conf.mysql.port,
        user : conf.mysql.user,
        password : conf.mysql.password,
        multipleStatements: true,
    });
    initConn.connect();

    initConn.query(`use ${conf.mysql.database};`, function (error, results, fields) {
        if (error && error.code === 'ER_BAD_DB_ERROR') {
            console.log('Creating a new database...');
            const sqlSource = Fs.readFileSync(Path.join(__dirname, './create.sql'))
                .toString()
                .replace(/<PEA_DATABASE_NAME>/g, conf.mysql.database)
            ;
            initConn.query(sqlSource, function (error) {
                if (error) {
                    console.log('Create fail');
                    throw error;
                    process.exit(1);
                }
                console.log(`Created database "${conf.mysql.database}"`);
                initConn.end();
                onInit();
            });
        } else {
            console.log(`Using a existed database "${conf.mysql.database}"`);
            initConn.end();
            onInit();
        }
    });
})(function () {
    connection = Mysql.createConnection({
        host : conf.mysql.host,
        port : conf.mysql.port,
        user : conf.mysql.user,
        password : conf.mysql.password,
        database: conf.mysql.database,
    });
    connection.connect();
});

module.exports = function (req, res, next) {
    res.mysql = connection;
    next();
};
