const redis = require('redis');
require('dotenv').config();

let redisClient

if (!global.redisClient) {

    redisClient = redis.createClient({
        url: process.env.REDIS
      });
     redisClient.on('error', err => console.log('Redis Client Error', err));
    redisClient.connect();
    global.redisClient = redisClient;

} else {
  
  redisClient = global.redisClient
}

module.exports = redisClient