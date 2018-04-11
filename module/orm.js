
/**
 * @param orm 数据库操作方法
 */

const db = require('./orm/concat.js');
const { sequelize } = require('./orm/index');

class ormModel {

    constructor(...args) {
        this.args = args;
    }

    /**
     * @param 同步数据库model事件
     */

    creat(str) {                                 
        return db[str].create(...this.args);
    }

    /**
     * @param 同步数据model事件，同时创建多条记录
     */

    bulkCreate(str) {
        return db[str].bulkCreate(...this.args);
    }

    /**
     * @param 数据查询方法
     */

    select(str, where) {
        return db[str].findOne(where);
    }

    /**
     * @param 数据库更新方法
     */

    update(str, where, where1) { 
        return db[str].update(where, where1);
    }
  
    /**
     * @param 数据库删除方法
     */

    delete(str, where) {
        db[str].destroy(where);
    }

    /**
     * @param 数据库查看分页方法
     */

    findAndCountAll(str, where) {
        return db[str].findAndCountAll(where);
    }

    /**
     * @param 数据库不分页查询方法
     */

    findAll(str, where) {
        return db[str].findAll(where);
    }

    /**
     * @param 数据库不分页查询方法 sql
     */

    query(sql) {
        return sequelize.query(sql).spread(function (results, metadata) {
            return metadata;
        });
    }
    
	/**
     *
     * @param str
     * @param where
     * @returns {*|Promise.<Array.<Model>>}
     */
    
    findData(str, where) {
        // return db[str].findAll({ where: where });
        return db[str].getCount('select count(*) from messPushes where isEnable = TRUE');
    }

}

module.exports = ormModel;

