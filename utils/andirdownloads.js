/**
 * @param 统计插件下载量
 * @param 1、区分渠道下载量
 * @param 2、总下载量
 */

const editMysql = require('./../module/index');

const client = require('./../server/redis');

/**
 * 根据redis数组数据的下标进行取值。
 */

let updateDate, _obj, incrDate = [], indexStart = 0, indexStop = 1000, speed = 5000;

const setDate = (name, version, obj) => {

    let n = name;
    let v = version;
    let o = obj;

    /**
     * 使用setinterval 发现内存使用率上涨。
     * 改用setTimeout 模拟setinterval
     */

    updateDate = setTimeout(async () => {

        let channel = obj && obj.channel || 'undefined';
    
        if (!_obj) {
            incrDate = await clientDate(channel, indexStart, indexStop);
        } else {
            incrDate = await clientDate(channel, _obj.indexStart, _obj.indexStop);
        }
    
        if (Array.isArray(incrDate) && incrDate.length === 0) {
            global.clearTimeout(updateDate);
            updateDate = undefined;
            _obj = undefined;
            incrDate = [];
            client.del('gm_front_' + obj.channel);
            return;
        }

        incrDate = incrDate.map(JSON.parse);
        
        let d = await new editMysql().getPlugAnListInfoId(name, version, obj.projectId);

        if (!d) { 
            incrDate = [];
            global.clearTimeout(updateDate);
            client.del('gm_front_' + obj.channel);
            return;
        }
        
        _obj = await new editMysql().plugDown(incrDate, d).then(() => {
            indexStart += 1000;
            indexStop += 1000;
            incrDate = [];
            return obj = {
                indexStart, indexStop, incrDate
            };
        });

        setDate(n, v, o);

    }, speed);
};

const clientDate = async (channel, indexStart, indexStop) => {
    return await client.lrange('gm_front_' + channel, indexStart, indexStop);
};

module.exports = async (ctx, obj, homeDir) => {

    if (obj) {

        let name = homeDir.split('/')[homeDir.split('/').length - 3];
        let version = homeDir.split('/')[homeDir.split('/').length - 2];

        client.lpush('gm_front_' + obj.channel, JSON.stringify(obj));

        if (updateDate != undefined) return;
        setDate(name, version, obj);
    }
    
};