const config = require('../config/default');
const redis = require('ioredis');

if (config.redis) {
    if (config.redis.clusterNodes) {
        const clusterNodes = config.redis.clusterNodes; //用作集群处理
        delete config.redis.clusterNodes;
        module.exports = new redis.Cluster(clusterNodes, config.redis);
    } else {
        module.exports = new redis(config.redis);
    }
}