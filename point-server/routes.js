const express = require('express');
const router = express.Router();
const debug = require('debug')('e:server');
const Marked = require('marked');
const Fs = require('fs');
const Path = require('path');

router.get('/', function (req, res) {
    console.log(Marked(Fs.readFileSync(Path.join(__dirname, '../README.md')).toString()));
    res.render('index', {
        title: 'Point Hub',
        content: Marked(Fs.readFileSync(Path.join(__dirname, '../README.md')).toString()),
    });
});
router.post('/events', function(req, res, next) {
    let date = null;
    const keys = ['uid', 'time', 'date', 'ip', 'sdk_version', 'app_name', 'duration', 'referer', 'event_page', 'event_flag', 'content'];
    const sql = 'INSERT INTO `events`' +
        '(`' + keys.join('`, `') + '`)' +
        `VALUES (${Array(keys.length).fill('?').join(', ')});`
    ;
    const dataList = keys.map(key => {
        if (key === 'ip' && req.ip) return req.ip;
        if (key === 'referer' && req.get('Referer')) return req.get('Referer');
        if (key === 'time') {
            const time = req.body.time || new Date().toISOString();
            date = time.substr(0, 10).replace(/-/g, '');
            return time;
        }
        if (key === 'date') return date;
        return req.body[key] || 'NULL';
    });

    debug(req.body);

    if (typeof req.body === 'string') {
        try {
            req.body = JSON.parse(req.body)
        } catch (e) {
            res.json({
                errcode: 1,
                errmsg: 'not a json',
            });
            return;
        }
    }


    res.mysql.query(sql, dataList, function (error, results, fields) {
        if (error) {
            debug(error);
            res.json({
                errcode: 1,
                errmsg: error.message,
            });
        } else {
            res.json({
                errcode: 0,
                errmsg: 'ok',
            });
        }
    });
});

module.exports = router;
