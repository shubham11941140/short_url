const Redis = require('ioredis');
const redis = new Redis({
    host: 'localhost',
    port: 6379
});

// Open a connection to Redis
// 'foo' has been set to 'bar'.
// ...
redis.on('connect', () => {
    console.log("connected");
    redis.get('foo', (err, reply) => {
        if (err) throw err;
        console.log(reply);
        redis.del('name', (err, reply) => {
            if (err) console.log(err);
            else console.log(reply);
        })
    });
})