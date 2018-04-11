const koa = require('koa');
const app = new koa();
const path = require('path');
const cors = require('koa-cors');
const koaBody = require('koa-body');
const getInterface = require('./utils/logs');

app.use(cors());

app
  .use(koaBody({
      multipart: true
  }));

/**
 * 请求入口
 */    
const apiRouter = require('./routers/router');

app.use(apiRouter.routes())
    .use(apiRouter.allowedMethods());

app
    .use(getInterface());

const fs = require('fs');

const baseUrl = path.join(__dirname, '/public/');
const baseUrlList = path.join(__dirname, '/public/download');

if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl);
    if (!fs.existsSync(baseUrlList)) {
        fs.mkdirSync(baseUrlList);
    }
}

const redis = require('./server/redis');

redis.on('error', function (err) {
    console.log('\n哈喽：\n亲爱的小伙。\n请启动redis！！！\n');
    redis.disconnect();
    console.log(err);
    throw err;
});

const getWay = require('./getway/index');

app.use(async (ctx, next) => {
    await getWay(ctx, next);
    await next();
});

/**
 * 下载文件
 */

const setDate = require('./utils/andirdownloads');

app.use(async (ctx, next) => {
   
    /**
     * 兼容api不走下载
     */
   
    if (ctx.originalUrl.includes('/public/download') && ctx.method === 'GET') {

        try {
            const homeDir = decodeURIComponent(ctx.path);
            let filePath = path.join(__dirname, homeDir);
            let obj = {
                channel: ctx.headers['channel'],
                mobileModel: ctx.headers['mobile_model'] || '',
                mobileVersion: ctx.headers['os_version'] || '',
                networkType: ctx.headers['network_type'] || '',
                romInfo: ctx.headers['rom_info'] || '',
                appVersion: ctx.headers['sver'] || '',
                imei: ctx.headers['imei'] || '',
                projectId: ctx.headers['projectId'] ? ctx.headers['projectId'] : (ctx.headers['projectid'] || 1)
            };

            setDate(ctx, obj, homeDir, next);
            ctx.response.attachment(filePath);

        } catch (error) {
            console.log(error);
            throw error;
        }

    }

    await next();
});

const staticServer = require('koa-static');

app.use(staticServer(path.join(__dirname)));

const getKoaLogger = require('koa2-loggers');

app.use(getKoaLogger({ level: 'auto' }));

app.on('error', function(err){
    console.error(err);
});  
process.on('uncaughtException', function (err) {
    console.log(err);
}); //监听未捕获的异常

process.on('unhandledRejection', function (err, promise) {
    console.log(err);
}); //监听Promise没有被捕获的失败

require('./utils/socket')(app);

module.exports = { app };