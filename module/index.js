
/**
 * @param 进行orm实现
 * @param 处理数据库存储
 * @param 所有的数据库操作通过次类来进行
 * @param 对现有的‘表’存储，进行‘规范化’处理
 * @param 根据现有数据库存储结构
 */

const ormModel = require('./orm');

class editMysql {
    /**
     * @param 部门分类
     */

    roleSet(department) {
        return new ormModel({ 'roleName': department }).creat('role');
    }

    /**
     * @param 权限分类
     */

    projectsSet(id) {
        new ormModel({ 'permissionsId': '1','roleId': id }).creat('projects');
    }

    /**
     * @param 查看权限分类
     */

    selectProjects(id) {
        return new ormModel().select('projects', { where: { roleId: id } });
    }

    /**
     * @param 登录方法操作
     */

    userSet(name, nickname, password, roleId) {
        return new ormModel({ 'username': name, 'nickname': nickname, 'password': password, 'roleId': roleId }).creat('user');
    }

    /**
     * @param 登录态方法操作
     */

    tokenSet(token, userId, roleId) {
        new ormModel({ 'id': token, 'userId': userId, 'roleId': roleId }).creat('token');
    }

    /**
     * @param 查看部门是否存在
     */

    selectRole(name) {
        return new ormModel().select('role', { where: { roleName: name } });
    }

    /**
     * @param 查询用户是否存在，单表查询
     */

    selectUser(name) {
        return new ormModel().select('user', { where: { username: name } });
    }

    /**
     * @param 1对1数据表查询
     */

    selectToken(token) {
        return new ormModel().select('token', { where: { id: token } });
    }

    /**
     * @param 根据token id 查询用户信息
     */
    
    selectTokenIdUser(id) {
        return new ormModel().select('user', { where: { id: id } });
    }
    
    /**
     * @param 退出删除登录态方法
     */

    userLayout(token) {
        new ormModel().delete('token', { where: { id: token } });
    }

    /**
     * @param 返回浏览器account 
     */

    getBrowerSet(account, projectId) {
        return new ormModel().select('browser', { where: { account: account, projectId: projectId} });
    }

    /**
     * @param browser 用户浏览器信息
     */

    browerSet(data) {
        new ormModel({
            account: data.account,
            jfVersion: data.jfVersion,
            openTime: data.openTime,
            source: data.source,
            userAgent: data.userAgent,
            appName: data.appName,
            platform: data.platform,
            appVersion: data.appVersion,
            domain: data.domain,
            localUrl: data.localUrl,
            title: data.title,
            referrer: data.referrer,
            lang: data.lang,
            sh: data.sh,
            sw: data.sh,
            cd: data.sh,
            projectId: data.id
        }).creat('browser');
    }

    /**
     * @param getErrorMessageSet
     */

    getErrorMessageSet(projectId) {
        return new ormModel().query('select source, method, originalUrl, status, t, time from netErrorMessages where projectId=' + projectId + ' and DATE_FORMAT(time, \'%Y-%m-%d\') >=  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 DAY), \'%Y-%m-%d\')');
    }

    /**
     * @param getErrorMessageCount
     */

    getErrorMessageCount(projectId) {
        return new ormModel().query('SELECT type, DATE_FORMAT(sTime, \'%Y-%m-%d\') AS sTime, count(*) AS count FROM `errorMessages` AS `errorMessage` where projectId = ' + projectId + ' and DATE_FORMAT(sTime, \'%Y-%m-%d\') >=  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 DAY), \'%Y-%m-%d\') GROUP BY DATE_FORMAT(sTime, \'%Y-%m-%d\') ,type ORDER BY type, DATE_FORMAT(sTime, \'%Y-%m-%d\') asc');
    }

    /**
     * @param errorMessage
     */

    errorMessageSet(data) {
        let msg = [];
        let oArr = [];
        if (data.sMsg.length > 244) {
            msg.push(data.sMsg.split('at')[3]);
            msg.push(data.sMsg.split('at')[5]);
        }
        if (data.eObj.length > 244) {
            oArr.push(data.eObj.split('at')[3]);
            oArr.push(data.eObj.split('at')[5]);
        }
        msg = msg.toString();
        oArr = oArr.toString();
        new ormModel({
            type: data.type,
            sMsg: msg || data.sMsg,
            sUrl: data.sUrl,
            sLine: data.sLine,
            sColu: data.sColu,
            eObj: oArr || data.eObj,
            sTime: data.sTime,
            browerType: data.browerType,
            projectId: data.id
        }).creat('errorMessage');
    }

    /**
     * @param netMessageSet
     */

    netMessageSet(data) {
        new ormModel({
            source: data.source||'management',
            method: data.method,
            originalUrl: data.originalUrl,
            status: data.status,
            t: data.t,
            time: data.time,
            msg: data.msg,
            projectId: data.id
        }).creat('netErrorMessage');
    }

    /**
     * @param 分页查看message
     */

    messageFindAll(currentPage, countPerPage, projectId) {
        return new ormModel().findAndCountAll('messPush', { where: { projectId: projectId }, 'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
    }

    /**
     * @param messagePush
     */

    messPush(data) {
        new ormModel({
            channl: data.channl,
            content: data.content,
            isEnable: data.isEnable,
            time: data.time,
            uerTypes: data.uerTypes,
            projectId: data.id,
            plant: data.plant
        }).creat('messPush');
    }

    /**
     * @param 获取所有安卓插件项目
     */

    getPlugAnAll(projectId) {
        return new ormModel().findAll('plugAn', { where: { projectId: projectId } });
    }

    /**
     * @param andir 插件项目查询
     */

    getPlugAn(name, projectId) {
        return new ormModel().select('plugAn', { where: { name: name, projectId: projectId } });
    }

    /**
     * @param andir 插件项目管理
     */

    plugAnSet(data) {
        return new ormModel({
            name: data.account,
            version: data.version,
            time: data.time,
            projectId: data.id
        }).creat('plugAn');
    }

    /**
     * @param andir 插件列表id
     */
    
    getPlugAnListId(name, id, projectId) {
        return new ormModel().select('plugAnList', { where: { plugListName: name, id: id, projectId: projectId } });
    }

    /**
     * @param 查询所有插件列表
     */

    getPlugFindAndCountAll(plugAnId, projectId) {
        return new ormModel().findAll('plugAnList', { where: { plugAnId: plugAnId, projectId: projectId } });
    }

    /**
     * @param andir 插件列表
     */
    
    plugAnList(data) {
        new ormModel({
            plugListName: data.plugName,
            describe: data.describe,
            category: data.category,
            time: data.time,
            plugAnId: data.plugAnId,
            projectId: data.id
        }).creat('plugAnList');
    }

    /**
     * @param 删除插件数据
     */
    
    deletePlugAnList(id, projectId) {
        return new ormModel().delete('plugAnList', { where: { id: id, projectId: projectId } });
    }

    /**
     * @param andir 插件列表id
     */

    getPlugAnListInfoId(name, version, projectId) {
        return new ormModel().select('plugAnListInfo', { where: { name: name, plugVersion: version, projectId: projectId } });
    }

    /**
     * @param 根据插件列表id，查询其所有列表详情插件
     */

    getPlugAnListInfoAll(id, projectId) {
        return new ormModel().findAll('plugAnListInfo', { where: { plugAnListId: id, projectId: projectId } });
    }

     /**
     * @param 设置插件版本插件的状态
     */

    updatePlugAnListId(id, isEnable, projectId) {
        new ormModel().update('plugAnListInfo', { isEnable: isEnable.isEnable }, { where: { id: id, projectId: projectId } });
    }

    /**
     * @param 设置长连接信息状态
     */

    updateMessage(id, isEnable, projectId) {
        new ormModel().update('messPush', { isEnable: isEnable.isEnable }, { where: { id: id, projectId: projectId } });
    }

    /**
     * @param 根据id删除插件数据
     */

    deletePlugAnListId(id, projectId) {
        new ormModel().delete('plugAnListInfo', { where: { id: id, projectId: projectId } });
    }

    /**
     * @param 根据id删除下载量统计
     */

    deletePlugDownId(id, projectId) {
        new ormModel().delete('plugDown', { where: { id: id, projectId: projectId } });
    }

    /**
     * @param 根据id删除长连接信息
     */

    deleteMessageId(id, projectId) {
        new ormModel().delete('messPush', { where: { id: id, projectId: projectId } });
    }

    /**
     * @param 根据plugAnId 删除插件数据
     */

    deletePlugAnId(id, projectId) {
        new ormModel().delete('plugAnListInfo', { where: { id: id, projectId: projectId } });
    }

    /**
     * @param andir 插件列表版本
     */
  
    plugAnListInfo(data) {
        new ormModel({
            channl: data.channl,
            fileSize: data.fileSize,
            isEnable: data.isEnable,
            name: data.name,
            optionsRadios: data.optionsRadios,
            path: data.path,
            plugName: data.plugName,
            plugVersion: data.plugVersion,
            systemVer: data.systemVer,
            textarea: data.textarea,
            time: data.time,
            version: data.version,
            plugAnListId: data.plugAnListId,
            projectId: data.id
        }).creat('plugAnListInfo');
    }

    /**
     * @param 下载量累加
     */

    getPlugDownId(channl, obj) {
        return new ormModel().findAll('plugDown', { where: { name: channl, plugAnListInfoId: obj.id, projectId: obj.projectId } });
    }

    /**
     * @param 插件下载量统计
     */

    async plugDown(data, obj) {

        const model = data.map(v => ({
            name: v.channel,
            sum: 1,
            mobileModel: v.mobileModel,
            mobileVersion: v.mobileVersion,
            networkType: v.networkType,
            romInfo: v.romInfo,
            appVersion: v.appVersion,
            imei: v.imei,
            plugAnListInfoId: obj && obj.id || 2,
            projectId: obj && obj.projectId || 1
        }));

        return new ormModel(model).bulkCreate('plugDown');
    }

    /**
     * @param 更新下载量id
     */

    updatePlugDownId(name, sum, projectId) {
        return new ormModel().update('plugDown', { sum: sum}, { where: { name: name, projectId: projectId } });  
    }

	/**
     * 获取一周内下载量
     * @returns {*}
     */
    getPlugDownLoads(projectId, num) {
        if (!num) {
            return new ormModel().query('select mobileModel, name, SUM(sum) as sum, DATE_FORMAT(utime, \'%Y-%m-%d\') as time from plugDowns where projectId = ' + projectId + ' and DATE_FORMAT(utime, \'%Y-%m-%d\') >=  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 DAY), \'%Y-%m-%d\') group by mobileModel, name, DATE_FORMAT(utime, \'%Y-%m-%d\')');
        }
        return new ormModel().query('select mobileModel, name, SUM(sum) as sum from plugDowns where projectId = ' + projectId + ' and DATE_FORMAT(utime, \'%Y-%m-%d\') >=  DATE_FORMAT(DATE_SUB(NOW(), INTERVAL 6 DAY), \'%Y-%m-%d\') group by mobileModel, name');
    }

    /**
     * @param 插件列表分页查看
     */

    getFindAllData(str, currentPage, countPerPage, projectId, plugAnListId) {
        if (plugAnListId) {
            return new ormModel().findAndCountAll(str, { where: { projectId: projectId, plugAnListId: plugAnListId }, 'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
        } else {
            return new ormModel().findAndCountAll(str, { where: { projectId: projectId }, 'limit': countPerPage, 'offset': countPerPage * (currentPage - 1) });
        }
    }

    /**
     * @param 插件下载对外地址
     */

    getPlugAnListInfoData(version, channl, systemVer, projectId, plugName) {
        if (plugName) {
            return new ormModel().findAll('plugAnListInfo', { where: { channl, version, systemVer, projectId, plugName } });
        } else {
            return new ormModel().findAll('plugAnListInfo', { where: { channl, version, systemVer, projectId } });
        }
        
    }

	/**
     * 根据状态和平台获取数据
     * @param plant
     * @returns {*}
     */

    getMessageByStatus(plant, projectId) {
        return new ormModel().query('select content from messPushes where projectId = ' + projectId +' and isEnable = TRUE and plant like "%' + plant + '%"');
    }

	/**
     * 根据where条件查询数据
     * @param str
     * @param where
     * @returns {*}
     */

    getData(str, id) {
        return new ormModel().findAll(str, { where: { id: id } });
    }

    /**
     * 根据where查找下载数据，分页
     * @param currentPage
     * @param pageSize
     * @param plugChannel
     * @param plugName
     * @param plugVersion
     * @returns {*}
	 */

    getPlugDownList(currentPage, pageSize, plugChannel, plugName, plugVersion, mobileModel, projectId, isCount) {
        let sql = 'SELECT a.*, b.name AS plugName, b.plugVersion FROM plugDowns a LEFT JOIN plugAnListInfos b ON a.plugAnListInfoId = b.id', str = '';
        let sqlCount = 'SELECT count(*) AS count FROM plugDowns a LEFT JOIN plugAnListInfos b ON a.plugAnListInfoId = b.id';

        if (plugChannel != '') {
            if (str !== '') {
                str += ' AND ';
            }
            str = str + 'a.name = ' + '"' + plugChannel + '"' + ' and a.projectId = ' + projectId;
        }

        if (plugName != '') {
            if (str !== '') {
                str += ' AND ';
            }
            str = str + 'b.name = ' + '"' + plugName + '"' + ' and a.projectId = ' + projectId;
        }

        if (plugVersion != '') {
            if (str !== '') {
                str += ' AND ';
            }
            str = str + 'b.plugVersion = ' + '"' + plugVersion + '"' + ' and a.projectId = ' + projectId;
        }

        if(mobileModel != '') {
            if(str !== '') {
                str += ' AND ';
            }
            str = str + 'a.mobileModel = ' + '"' + mobileModel + '"' + ' and a.projectId = ' + projectId;
        }

        if (str !== '') {
            str = ' WHERE ' + str;
        }

        if (isCount) {
            sqlCount += str;
            return new ormModel().query(sqlCount);
        } else {
            sql += str;
            if (currentPage && pageSize) {
                sql = sql + ' limit ' + (currentPage - 1) * pageSize + ', ' + pageSize;
            }
            return new ormModel().query(sql);
        }
    }

	/**
     * 获取所有的插件下载渠道
     * @returns {*}
     */

    getPlugChannelList(projectId) {
        const sql = 'SELECT DISTINCT(name) AS channel from plugDowns where projectId = ' + projectId;
        return new ormModel().query(sql);
    }

	/**
     * 获取所有的插件下载的名称
     * @returns {*}
     */

    getPlugNamelList(projectId) {
        const sql = 'SELECT DISTINCT(b.name) AS name FROM plugDowns a LEFT JOIN plugAnListInfos b ON a.plugAnListInfoId = b.id where a.projectId = +' + projectId;
        return new ormModel().query(sql);
    }

	/**
     * 获取所有的插件下载的版本
     * @returns {*}
     */

    getPlugVersionlList(projectId) {
        const sql = 'SELECT DISTINCT(b.plugVersion) AS version FROM plugDowns a LEFT JOIN plugAnListInfos b ON a.plugAnListInfoId = b.id where a.projectId =' + projectId;
        return new ormModel().query(sql);
    }

    /**
     * @param 获取所有下载的手机版本
     */
    
    getMobileModel(projectId) {
        const sql = 'SELECT DISTINCT(a.mobileModel) FROM plugDowns a LEFT JOIN plugAnListInfos b ON a.plugAnListInfoId = b.id where a.projectId =' + projectId;
        return new ormModel().query(sql);
    }
}

module.exports = editMysql;