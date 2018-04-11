
/**
 * @param 2017-12-14 今天天气不怎么好，遇到一个问题。
 * 由于，a服务需要调取b服务的接口，导致前端跨域无法访问。
 * 运维的同学现在限制nginx转发代理。
 * 由于这个问题长久存在，特增加getway模块，用于做路由转发。
 * 设计思路：
 *     1、pc端和手机端的接口请求监控平台服务层getway模块。
 *     2、getway模块只做转发，数据透传，不对数据接口进行操作。
 *     3、区分客户端和移动端。
 *     4、请求域名可配置，接口可配置，可修改。（使用数据库）;
 *     5、提供接口配置页面。
 * 需要解决的问题：
 *     1、接口怎么请求过来？nginx代理？还是对外提供一个高并发、高可用的接口。
 * 有可能遇到的问题：
 *     1、全部请求过来，导致监控平台压力增加。
 * --------------------------------------
 * 突然发现前面的都是扯淡，直接简单，打过来，转过去。
 * --------------------------------------
 */

const request = require('request-promise-native');
const querystring = require('querystring');

const getWay = async (ctx, next) => {
    let isRoot = false;
    const agendomain = ctx.headers['agentdomain'] ? (ctx.protocol + '://' + ctx.headers['agentdomain']) : isRoot = true;

    const url = agendomain + ctx.originalUrl;
  
    const method = ctx.method.toLowerCase();
    let body;
    switch (method) {
    case 'get':
        body = querystring.stringify(ctx.query);
        break;
    case 'post':
        body = querystring.stringify(ctx.request.body);
        break;    
    default:
        body = '';    
        break;
    }
   
    try {
        if (!isRoot) {
            const res = await request[method]({ url: url, form: body });
            ctx.body = JSON.parse(res); 
        }
        return;
    } catch (error) {
        ctx.status = Number(error.statusCode) || 500;
        ctx.body = {
            success: false,
            error: error.error,
            msg: '服务器返回' + Number(error.statusCode)
        };
    }
};


module.exports = getWay;
