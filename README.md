# [point-hub](https://github.com/pea3nut/point-hub) <img src="https://api.travis-ci.org/pea3nut/point-hub.svg?branch=master" />

The point platform which can collect the events of user.

Require:

- Nodejs
- MySQL

## Run for production

### For server site

Edit `conf.json` file, fill your mysql info.

Run:

```bash
npm install
npm start
```

It will listen 3000 port and receive data form '/events'

### For client

Import sdk:

```html
<script src="https://example.com/sdk/1.0/browser.js"></script>
```

Init sdk to set built-in info and send a point:

```js
(function () {
    const eventSender = new EventSender('https://example.com/events', {
        // ses sdk/browser.ts#EventBody
        uid: 123456,
        app_name: 'my-app',
        get referer() { return location.href; },
    });
    eventSender.setContent({
        ua: navigator.userAgent,
    });
    
    // Send a point
    eventSender.send('pv', {
        // extra data
    });
})();
```

## Deploy using docker

```bash
docker run pea3nut/point-hub:master
```

It will expose 80, 3000 and 3306 port for:

- 80: PhpMyAdmin
- 3000: point-server
- 3306: MySQL

## MySQL Password

The first time that you run your container, a new user admin with all privileges will be created in MySQL with a random password. To get the password, check the logs of the container by running:

```bash
docker logs $CONTAINER_ID
```

## Transfer From Older

### 1.0 -> 1.1

1. Run sql below:

```sql
ALTER TABLE `events` ADD `date` INT NULL AFTER `uid`;
ALTER TABLE `events` ADD INDEX(`date`);
```

2. update `point-server`

3. Run sql, it need some time:

```sql
UPDATE `events` SET `date` = date_format(time, '%Y%m%d') where date is NULL;
```

