const client = require("./../server/redis");

const editMysql = require('./../module/index');

// const throttle = require('lodash.throttle');

let arr = [];

//订阅一个频道
const sub = function (c) {
    var c = 'zhang_*';
    client.on('connect', function () {
        client.psubscribe(c);
    });
};
sub();
client.on('error', function (error) {
    console.log(error);
    sub();
});

//订阅处理函数
client.on('message', (channel, message) => {
    // console.log(channel, message, '============')
    
    update(arr = [], message)
});

const update = (arr, message) => {
    console.log(message, '+++++')
    console.log(arr)
// if (message % 200 !== 0) {
    //     console.log(arr,'|||||||||||||')
    //     message = message + arr[1].sum;
    //     new editMysql().updatePlugDownId(arr[1], message, arr[3]).then(d => {
    //         console.log(d,'+++++++++++++++++')
    //         global.e = {};
    //         global.a = 0;
    //         global.b = {};
    //         client.del(arr[1].name);
    //     })
    // }
}

const getData = (key, key1, member, projectId) => {
    arr = [];
    arr.push(key, key1, member, projectId);
    console.log(arr[1].sum)
    update(arr, message = 0);
}
module.exports = getData;