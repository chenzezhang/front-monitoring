/**
 * @param node + redis 实现一个消息队列。
 * 虽然使用了内存存储可以暂时解决高并发的下载量统计，但是，始终是还是会出现问题的。
 * 
 */

const redis = require('./../server/redis');

module.exports = () => {

    redis.on('error', function (err) {
        console.log('\n哈喽：\n亲爱的小伙。\n请启动redis！！！\n');
        redis.disconnect();
        console.log(err);
        throw err;
    });
}