
const client = require('./../server/redis');

const getData = require('./getDate');


/**
 * @param 更新redis数据库
 * @param {*} key 
 * @param {*} member 
 */

const zadd = (key, key1, member, projectId) => {
    client.incr(key1.name);
    client.publish(key, member);
    getData(key, key1, member, projectId)
}

/**
 * @param 获取累加的默认值
 */

const getIncr = (value) => {
    return redis.get(value);
}

module.exports = {
    zadd,
    getIncr
}