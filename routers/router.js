
/**
 * 路由整体控制,重写第三次
 */

const router = require('koa-router')();
const api = require('./api');
const andirApi = require('./andirPlugin');
const addMes = require('./messagePush');
const user = require('./user');
const oauth = require('./../oauth/oauth');
const multer = require('koa-multer');
import { IosABtest } from './../iosabtest/index';
import { getRendTime } from './../rendTime/index';


const storage = multer.diskStorage({
    //文件保存路径  
    destination: function (req, file, cb) {
        cb(null, 'public/download/');
    },
    //修改文件名称  
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split('.');
        cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1]);
    }
});

const upload = multer({ storage: storage });

router
    .post('/plugin/api/login', user.login)
    .post('/plugin/api/register', user.register)
    .get('/plugin/api/userInfo', oauth.user, user.userInfo)
    .post('/plugin/api/setBasic', oauth.pass, api.setBasic)
    .get('/plugin/api/getBasic', oauth.user, api.getBasic)
    .post('/plugin/api/setHtmlError', oauth.pass, api.setHtmlError)
    .get('/plugin/api/getHtmlError', oauth.user, api.getHtmlError)
    .get('/plugin/api/pageError', oauth.user, api.pageError)
    .get('/plugin/api/typeErr', oauth.user, api.getTypeErr)
    .get('/plugin/api/getUrlErr', oauth.user, api.getUrlErr)
    .post('/plugin/api/layout', user.layOut)
    .post('/plugin/api/setPlug', oauth.pass, api.setPlug)
    .get('/plugin/api/getPlug', oauth.pass, api.getPlug)
    .post('/plugin/api/settingPlug', oauth.pass, api.settingPlug)
    .post('/plugin/api/setPlugList', oauth.pass, api.setPlugList)
    .get('/plugin/api/getPlugList', oauth.pass, api.getPlugList)
    .post('/plugin/api/setPlugListInfo', upload.single('file'), api.setPlugListInfo)
    .get('/plugin/api/getPlugListInfo', oauth.pass, api.getPlugListInfo)
    .post('/plugin/api/delPlug', oauth.pass, api.delPlug)
    .get('/plugin/api/getPlugDownloads', oauth.pass, api.getPlugDownloads)
    .get('/plugin/api/getPlugSearch', oauth.pass, api.getPlugSearch)
    .get('/plugin/api/getPlugDownList', oauth.pass, api.getPlugDownList)
    .post('/plugin/api/isLogin', api.isLogin)
    .post('/plugin/api/setRendTime', oauth.pass, getRendTime.setRendTime)
    .get('/plugin/api/getRendTimePage', oauth.user, getRendTime.getRendTimePage);

/**
 * andir app端单独提出来
 */

router
    .get('/plugin/api/andirApi', oauth.pass, andirApi.andirAppPlugin);


/**
 * addMes 消息推送单独提出来
 */

router
    .post('/plugin/api/addMessage', oauth.user, addMes.addMessage)
    .get('/plugin/api/getMessage', oauth.user, addMes.getMessage)
    .get('/plugin/api/getMessageByStatus', oauth.pass, addMes.getMessageByStatus)
    .post('/plugin/api/setMessage', oauth.user, addMes.setMessage);

/**
 * ios abtest 单独提出来
 */

router
    .post('/plugin/api/setIosABtestSetting', oauth.user, IosABtest.setIosABtest)  // 开关控制
    .get('/plugin/api/getIosABtestSetting', oauth.user, IosABtest.getIosABtest)
    .post('/plugin/api/iosABtestSetting', oauth.user, IosABtest.iosABtestSetting)
    .get('/plugin/api/GMABTestpolicydata', oauth.pass, IosABtest.GMABTestpolicydata);

module.exports = router;