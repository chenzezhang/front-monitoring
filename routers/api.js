
const moment = require('moment');

const fs = require('fs');
const path = require('path');
const client = require('./../server/redis');

/**
 * @param edit redis
 */

const editMysql = require('./../module/index');

import { getProjectId } from './../utils/getProjectId';


/**
 * @param 接口暂时统一处理
 */
class ApiController {

    // 存储用户版本信息
    static async setBasic(ctx, next) {
        
        let set = setTimeout(() => {
            setBasicDate(ctx, set);
        }, 5000);

        ctx.body = {
            msg: '成功',
            success: true
        };
        
        await next();
    }

    //获取用户版本信息    
    static async getBasic(ctx, next) {
        let project = await new getProjectId(ctx).getId();
        await paging(ctx, 'browser', project);
        await next();
    }

    // 存储端页面报错信息
    static async setHtmlError(ctx, next) {
        
        let setHtml = setTimeout(() => {
            setHtmlDate(ctx, setHtml);
        }, 5000);

        ctx.body = {
            msg: '成功',
            success: true
        };
        
        await next();
    }

    // 获取前端页面报错信息
    static async getHtmlError(ctx, next) {
        let project = await new getProjectId(ctx).getId();
        await paging(ctx, 'errorMessage', project);
        await next();
    }

    // 后端接口报错分页查询pageError

    static async pageError(ctx, next) {
        let project = await new getProjectId(ctx).getId();
        await paging(ctx, 'netErrorMessage', project);
        await next();
    }

    // 对返回错误信息进行处理 
    static async getTypeErr(ctx, next) {
        let project = await new getProjectId(ctx).getId();
        const d = await new editMysql().getErrorMessageCount(project);

        let array, pieArray = [],
            obj = {};
        d.map((v) => {
            array = [];
            for (let j = 6; j >= 0; j--) {
                let date = moment().subtract(j, 'days').format('YYYY-MM-DD'),
                    count = 0;

                if (date == v.sTime) {
                    count = v.count;
                } else if (obj[v.type] && obj[v.type][6 - j] !== 0) {
                    count = obj[v.type][6 - j];
                }
                array.push(count);
            }
            obj[v.type] = array;
        });

        if (d && d.length > 0) {
            d.reduce((pre, cur, index, arr) => {
                if (pre.type === cur.type) {
                    cur.count = pre.count + cur.count;
                } else {
                    pieArray.push({
                        value: pre.count,
                        name: pre.type
                    });
                }

                if (index === arr.length - 1) {
                    pieArray.push({
                        value: cur.count,
                        name: cur.type
                    });
                }
                return cur;
            });

            obj['pieData'] = pieArray;
            ctx.body = {
                success: true,
                data: obj,
                msg: '成功'
            };
        } else {
            ctx.body = {
                success: false,
                data: {},
                msg: '失败'
            };
        }

        await next();
    }

    // 对接口错误信息返回进行处理

    static async getUrlErr(ctx, next) {

        let project = await new getProjectId(ctx).getId();

        const d = await new editMysql().getErrorMessageSet(project);

        let array, obj = {};
        d.map(v => {
            array = [];
            if (!obj[v.source]) {
                obj[v.source] = {};
            }
            if (!obj[v.source][v.method]) {
                obj[v.source][v.method] = [];
            }

            array.push(new Date(v.time).getTime());
            array.push(v.t.replace('ms', ''));
            array.push(v.status);
            array.push(v.method);
            array.push(v.originalUrl);

            obj[v.source][v.method].push(array);
        });

        ctx.body = {
            success: true,
            data: obj,
            msg: '成功'
        };
        await next();
    }

    // 添加项目

    static async setPlug(ctx, next) {

        let m = ctx.request.body;

        let project = await new getProjectId(ctx).getId();

        let data = await new editMysql().getPlugAn(m.account, project);

        data = !data ? {} : data;

        if (data.plugName != m.account) {

            m.id = data.projectId ? data.projectId : project;

            new editMysql().plugAnSet(m);

            ctx.body = {
                msg: '成功',
                success: true
            };
        } else {
            ctx.body = {
                msg: '失败',
                success: false
            };
        }
        await next();
    }

    // 获取项目

    static async getPlug(ctx, next) {

        let project = await new getProjectId(ctx).getId();

        const data = await new editMysql().getPlugAnAll(project);

        if (data && data.length > 0) {

            ctx.body = {
                data: data,
                msg: '成功',
                success: true
            };

        } else {
            ctx.body = {
                data: [],
                msg: '成功',
                success: true
            };
        }
        await next();
    }

    // 添加项目--添加分组项目

    static async setPlugList(ctx, next) {
        let m = {};
        m = ctx.request.body;
        m.time = moment().format('YYYY-MM-DD HH:mm:ss');

        if (m.plugName) {

            let project = await new getProjectId(ctx).getId();

            const data = await new editMysql().getPlugAn(m.category, project);

            const dt = await new editMysql().getPlugAnListId(ctx.request.body.plugName, project);

            m.plugAnId = data.id;

            m.id = dt && dt.projectId ? dt.projectId : data.projectId;

            if (dt && dt.plugListName == ctx.request.body.plugName) {
                return ctx.body = {
                    msg: '插件不能重复命名，请检查插件命名，重新输入。。',
                    success: false
                };
            } else {

                new editMysql().plugAnList(m);

                return ctx.body = {
                    msg: '成功',
                    success: true
                };
            }
        } else {
            ctx.body = {
                msg: '失败',
                success: false
            };
        }
        await next();
    }

    // 添加项目--获取分组项目

    static async getPlugList(ctx, next) {

        const str = ctx.query.category;

        let project = await new getProjectId(ctx).getId();

        const data = await new editMysql().getPlugAn(str, project);

        const d = await new editMysql().getPlugFindAndCountAll(data.id, project);

        if (d && d.length > 0) {

            ctx.body = {
                data: d,
                msg: '成功',
                success: true
            };

        } else {
            ctx.body = {
                data: [],
                msg: '成功',
                success: true
            };
        }

        await next();
    }

    // 添加项目--添加分组项目--添加分组项目详情插件

    static async setPlugListInfo(ctx, next) {

        /**
         * 存储文件
         */

        const file = ctx.request.body.files.file;

        let version = ctx.request.body.fields.plugVersion;

        /**
         * 防止没有上传文件直接提交
         */

        if (!file.name) {

            ctx.redirect(ctx.headers.referer);

            ctx.body = {
                success: false,
                msg: '请选择上传文件'
            };
        }

        if (!version) {
            version = new Date() - 0;
        }

        const reader = fs.createReadStream(file.path);
        const homeDir = path.resolve(__dirname, '..');
        const baseUrl = homeDir + '/public/download/' + ctx.request.body.fields.name;
        const baseUrla = homeDir + '/public/download/' + ctx.request.body.fields.name + '/' + version;
        let fileName = file.name;
        let newpath = homeDir + '/public/download/' + ctx.request.body.fields.name + '/' + version + '/' + fileName;

        /**
         * 检查插件组文件夹是否存在，不存在创建
         */

        if (!fs.existsSync(baseUrl)) {
            fs.mkdirSync(baseUrl);
            if (!fs.existsSync(baseUrla)) {
                fs.mkdirSync(baseUrla);
            }
        } else {
            if (!fs.existsSync(baseUrla)) {
                fs.mkdirSync(baseUrla);
            }
        }

        const stream = fs.createWriteStream(newpath);
        const fileSize = (file.size / 1024).toFixed(2);
        reader.pipe(stream);

        /**
         * 存储
         */

        let o = ctx.request.body.fields;
        o.time = moment().format('YYYY-MM-DD HH:mm:ss');
        o.plugName = fileName;
        o.fileSize = fileSize;
        o.path = '/public/download';

        /**
         * 用于分页，供前端分页查看
         */

        let data = await new editMysql().getPlugAnListId(ctx.request.body.fields.name, ctx.request.body.fields.id, ctx.request.body.fields.projectId);

        data = !data ? {} : data;

        if (data.id) {

            o.plugAnListId = data.id;
            o.id = data.projectId;

            new editMysql().plugAnListInfo(o);
        }

        ctx.redirect(ctx.headers.referer);

        await next();
    }

    // 查看项目 -- 分组项目 -- 详情插件

    static async getPlugListInfo(ctx, next) {

        let project = await new getProjectId(ctx).getId();
        const plugAnListId = ctx.query.id;

        await paging(ctx, 'plugAnListInfo', project, plugAnListId);
        await next();
    }

    /**
     * @param {obj} 项目--插件-控制
     * @param {num}
     * 1、停用 2、启用 3、删除
     */

    static async settingPlug(ctx, next) {

        const {
            num,
            pathName,
            id,
            version
        } = ctx.request.body;

        let project = await new getProjectId(ctx).getId();

        let isEnable = {};

        if (num == '1') {

            isEnable.isEnable = 'true';

        } else if (num == '2') {

            isEnable.isEnable = 'false'; // 是否停用

        }

        /**
         * 根据num 来区分功能
         * 1、启用
         * 2、停用
         * 3、删除
         * 根据oeder 定位插件的位置
         * 进行插件属性修改以及删除操作
         */

        if (num == '1' || num == '2') {

            new editMysql().updatePlugAnListId(id, isEnable, project);

            ctx.body = {
                success: true,
                msg: '操作成功'
            };
        } else {

            /**
             * 删除数据库字段
             */

            const data = await new editMysql().getData('plugAnListInfo', id);
            if (data && data.length > 0) {
                const homeDir = path.resolve(__dirname, '..');
                const newpath = homeDir + '/public/download/' + pathName + '/' + version + '/' + data[0].plugName;
                if (fs.existsSync(newpath)) {
                    fs.unlink(newpath);
                }

                let dt = await new editMysql().getPlugAnListInfoAll(id, project);

                if (dt && dt.length > 0) {
                    new editMysql().deletePlugDownId(dt[0].id, project);
                }

                new editMysql().deletePlugAnListId(id, project);

                ctx.body = {
                    success: true,
                    msg: '删除成功'
                };
            }
        }

        await next();
    }

    /**
     * del 删除分组项目
     */

    static async delPlug(ctx, next) {

        let project = await new getProjectId(ctx).getId();

        const plugName = ctx.request.body.plugName;

        const id = ctx.request.body.id;

        const homeDir = path.resolve(__dirname, '..');

        const newpath = homeDir + '/public/download/' + plugName;


        /**
         * 遍历删除文件
         */

        deleteFolder(newpath);
        const data = await new editMysql().getPlugAnListId(plugName, project);

        const dataAll = await new editMysql().getPlugAnListInfoAll(data.id, project);

        if (dataAll.length) {

            await new editMysql().deletePlugAnId(dataAll[0].plugAnListId, project);

            await new editMysql().deletePlugAnList(plugName, project);

        } else {
            await new editMysql().deletePlugAnList(id, project);
        }

        ctx.body = {
            success: true,
            msg: '操作成功'
        };

        await next();
    }

    /**
     * 判断登录
     */

    static async isLogin(ctx, next) {

        const token = require('./../utils/getToken')(ctx);

        if (!token) {
            return ctx.body = {
                msg: '请登录',
                success: false
            };
        }

        const val = await new editMysql().selectToken(token);

        if (!val) {
            ctx.body = {
                msg: '请登录',
                success: false
            };
        } else {
            ctx.body = {
                msg: '成功',
                success: true
            };
        }
        await next();
    }

    // 获取下载量（一周）

    static async getPlugDownloads(ctx, next) {

        let project = await new getProjectId(ctx).getId();
        const data = await new editMysql().getPlugDownLoads(project);
        const modelData = await new editMysql().getPlugDownLoads(project, 1);

        let arr, obj = {},
            pieArray = [];
        
        data.map(async (v) => {
            arr = [];
            for (let j = 6; j >= 0; j--) {
                
                let date = moment().subtract(j, 'days').format('YYYY-MM-DD'),
                    count = 0;
                
                if (date == v.time) {
                    count = v.sum;
                } else if (obj[v.mobileModel] && obj[v.mobileModel][6 - j] !== 0) {
                    count = obj[v.mobileModel][6 - j];
                }
                
                arr.push(count);
            }
            obj[v.name] = arr;
        });

        if (data && data.length > 0) {

            const modelCount = forEachArr(modelData);

            if (data.length !== 1) {

                data.reduce((pre, cur, index, arr) => {
                    if (pre.name === cur.name) {
                        cur.sum = parseInt(pre.sum) + parseInt(cur.sum);
                    } else {
                        pieArray.push({
                            value: pre.sum,
                            name: pre.name
                        });
                    }

                    if (index === arr.length - 1) {
                        pieArray.push({
                            value: cur.sum,
                            name: cur.name
                        });
                    }
                    return cur;
                });
            } else {
                pieArray.push({
                    value: data[0].sum,
                    name: data[0].mobileModel
                });
            }

            const pieData = forEachArr(pieArray);
            let pieDataArr = [];

            for (let i in pieData) {
                pieDataArr.push(pieData[i]);
            }
    
            obj['pieData'] = pieDataArr;
            obj['modelCount'] = modelCount;

            ctx.body = {
                success: true,
                data: obj,
                msg: '成功'
            };
        } else {
            ctx.body = {
                success: false,
                data: null,
                msg: '暂无数据'
            };
        }

        await next();
    }

    static async getPlugSearch(ctx, next) {

        let project = await new getProjectId(ctx).getId();
        let channelList = await new editMysql().getPlugChannelList(project);
        let nameList = await new editMysql().getPlugNamelList(project);
        let versionList = await new editMysql().getPlugVersionlList(project);
        let modelList = await new editMysql().getMobileModel(project);

        let data = {
            channelList: channelList || [],
            nameList: nameList || [],
            versionList: versionList || [],
            modelList: modelList || []
        };

        ctx.body = {
            success: true,
            data: data,
            msg: '成功'
        };

        next();
    }

    // 获取下载量（全部）

    static async getPlugDownList(ctx, next) {

        let project = await new getProjectId(ctx).getId();
        let currentPage = ctx.query.page ? ctx.query.page : 1;
        let countPerPage = ctx.query.pageSize ? ctx.query.pageSize : 10;
        let plugChannel = ctx.query.channel || '';
        let plugName = ctx.query.name || '';
        let plugVersion = ctx.query.version || '';
        let mobileModel = ctx.query.mobileModel || '';

        let data = await new editMysql().getPlugDownList(Number(currentPage), Number(countPerPage), plugChannel,
            plugName, plugVersion, mobileModel, project);
        let obj = await new editMysql().getPlugDownList(Number(currentPage), Number(countPerPage), plugChannel,
            plugName, plugVersion, mobileModel, project, true);

        if (obj.length > 0 && obj[0].count > 0) {
            ctx.body = {
                success: true,
                data: {
                    list: data,
                    totalCount: Math.ceil(obj[0].count / Number(countPerPage))
                },
                msg: '成功',
                pageSize: Math.ceil(data.length / Number(countPerPage))
            };
        } else {
            ctx.body = {
                success: false,
                data: {
                    list: [],
                    totalCount: 0
                },
                msg: '失败'
            };
        }

        await next();
    }

    /**
     * @param 页面渲染
     * @param window.performance 目前有问题
        url: 地址
        DNS: dns查询时间
        TCP: TCP连接耗时
        WT: 白屏时间
        DR: ready时间，脚本加载完成时间
        ONL: 执行onload事件耗时
        ALLRT: 所有请求耗时
        PRDOM: dom解析耗时
        FXHR: 第一个请求发起时间
        loadTime: 首页渲染时间
        deactivated: 区分权限
     */

    static async rendTimeUrl(ctx) {
        if (!ctx.request.body) return;

        /**
         * 使用settimeout 模拟setinterval
         * 
         */
        const speed = 5000;

        let indedStar = 0, indexStop = 1000, clientDate, result;
        

        // 解决高并发暂时存在redis中。
        client.lpush('gm_front_loadTime', JSON.stringify(ctx.request.body));

        ctx.body = {
            msg: '成功',
            success: true
        };

        // 延时从缓存中拿，完事清空。
        // 话说逻辑上没事错，但是总感觉有问题。
        let d = setTimeout(async () => {

            clientDate = [];

            if (!result) {
                clientDate = await client.lrange('gm_front_loadTime', indedStar, indexStop);
            } else {
                indedStar += 1000;
                indexStop += 1000;
                clientDate = await client.lrange('gm_front_loadTime', indedStar, indexStop);
            }

            if (Array.isArray(clientDate) && clientDate.length === 0) {
                d = undefined;
                result = undefined;
                global.clearTimeout(d);
                client.del('gm_front_loadTime');
                return;
            }

            clientDate = clientDate.map(JSON.parse);

            // 放入数据库。
            // 这里需要改。

            result = await new editMysql().browerSet(clientDate).then(() => {
                /**
                 * 这里只是判断有没有返回什么东西，只要不为空都行。
                 */
                return 1;
            });
            
            d();  // 自己调用自己
            
        }, speed);
    }

}

/**
 * 分页处理
 */

const paging = async(ctx, str, projectId, plugAnListId) => {

    let currentPage = ctx.query.page ? ctx.query.page : 1;
    let countPerPage = ctx.query.pageSize ? ctx.query.pageSize : 10;

    let data = await new editMysql().getFindAllData(str, Number(currentPage), Number(countPerPage), projectId, plugAnListId);

    if (data.rows.length) {
        ctx.body = {
            success: true,
            data: data.rows,
            msg: '成功',
            pageSize: Math.ceil(data.count / Number(countPerPage))
        };
    } else {
        ctx.body = {
            success: false,
            data: {},
            msg: '失败'
        };
    }

};

/**
 * delete files
 */

let deleteFolder = (newpath) => {

    let files = [];
    let filess = [];

    if (fs.existsSync(newpath)) {

        files = fs.readdirSync(newpath);

        if (fs.existsSync(newpath + '/' + files)) {

            filess = fs.readdirSync(newpath + '/' + files);

            filess.forEach(function (file) {

                let curPath = newpath + '/' + files + '/' + file;


                if (fs.statSync(curPath).isDirectory()) { // recurse

                    this.deleteFolter(curPath);

                } else {

                    fs.unlinkSync(curPath);

                }
            });
            fs.rmdirSync(newpath + '/' + files);
            fs.rmdirSync(newpath);
        }
    }
};

/**
 * @param 获取浏览器信息接口
 */

const setBasicDate = async (ctx, set) => {
    
    global.clearTimeout(set);
    
    const dt = await new editMysql().selectProjects(ctx.request.body.departmentId);

    if (!dt) { 
        return;
    }
        
    let data = await new editMysql().getBrowerSet(ctx.request.body.account, dt.id);
        
    let d = !data ? {} : data;
        
    if (ctx.request.body.account != d.account) {
        
        let da = ctx.request.body;
        
        da.id = dt.id;
        
        new editMysql().browerSet(da);
        
    }

};
    
/**
 * @param 存储页面报错信息接口
 */
    
const setHtmlDate = async (ctx, setHtml) => {
    
    global.clearTimeout(setHtml);
    
    const data = ctx.request.body;
        
    if (!Object.keys(data).length || Object.keys(data)[0] === 'departmentId') return;
        
    const dt = await new editMysql().selectProjects(data.departmentId);

    if (!dt) return;
        
    delete data.departmentId;
        
    const browerType = require('./../utils/getBrowserType')(ctx.headers['user-agent']);
        
    for (let i in data) {
        
        let d = JSON.parse(data[i]);
        
        d.browerType = browerType;
        
        d.id = dt.id;
        
        new editMysql().errorMessageSet(d);
    }
};

/**
 * @param 对返回数据进行遍历处理
 */

const forEachArr = (data) => {

    let obj = {};
    let firstArra = [];
    let secendArray = {};
    let threeArray = [];

    data.map(v => {
        let c = v.mobileModel ? v.mobileModel : v.name;
        if (!secendArray[c]) {
            firstArra.push(c);
            secendArray[c] = true;
        }
    });

    firstArra.forEach((w, c) => {
        threeArray[c] = [];
        let temp = [];
        data.forEach((e) => {
            let f = e.mobileModel ? e.mobileModel : e.name;
            if (firstArra[c] === f) {
                temp.push(e);
            }
        });
        threeArray[c].push(temp);
    });

    threeArray.forEach((e) => {
        e.forEach(v => {
            let arr = {};
            let sum = 0;
            v.forEach(b => {
                let a = b.mobileModel ? b.mobileModel : b.name;
                if (b.sum) {
                    obj[a] = Object.assign(arr, { [b.name]: parseInt(b.sum) });
                } else {
                    sum += parseInt(b.value);           
                    arr['name'] = b.name;
                    arr['value'] = sum;
                    obj[a] = Object.assign(arr, { ['name']: b.name, 'value': sum });        
                }
            });
        });
    });

    return obj;
};
    

module.exports = ApiController;