const mysql = require('mysql');
const conf = require('../conf.json');
const debug = require('debug')('e:server');

const connection = mysql.createConnection(conf.mysql);
connection.connect();
debug(`Mysql connected by ${JSON.stringify(conf.mysql, null, '  ')}`);

module.exports = function (req, res, next) {
    next();
};
