
/**
 * 消息推送
 */

const moment = require('moment');

/**
 * @param edit redis
 */

const editMysql = require('./../module/index');
import { getProjectId } from './../utils/getProjectId';

class messagePush {

    /**
     * 增加message接口
     */

    static async addMessage(ctx, next) {

        let obj = ctx.request.body;
        

        /**
         * 创建时间
         */

        obj.time = moment().format('YYYY-MM-DD HH:mm:ss');

        const dt = await new getProjectId(ctx).getId();
        obj.id = dt.id;

        new editMysql().messPush(obj);

        ctx.body = {
            success: true,
            msg: '成功'
        };

    }

    /**
     * 获取信心用于前端分页显示
     */

    static async getMessage(ctx, next) {

        let data = await new getProjectId(ctx).getId();

        await paging(ctx, data.id);
        await next();
    }

    /**
     * 获取信心用于前端分页显示
     */

    static async getMessageByStatus(ctx) {
    
        const plant = ctx.query.plant;

        let project = await new getProjectId(ctx).getId();

        if (!project) {
            return ctx.body = {
                success: true,
                msg: '暂无数据'
            };
        }
        
        let data = await new editMysql().getMessageByStatus(plant, project);
        if (data && data.length > 0) {
            ctx.body = {
                success: true,
                code: 1,
                msg: data[0].content
            };
        } else {
            ctx.body = {
                success: true,
                code: 0,
                msg: '无数据'
            };
        }
    }

    /**
     * 设置推送消息
     */
    
    static async setMessage(ctx, next) {

        const { num, id } = ctx.request.body;

        let project = await new getProjectId(ctx).getId();
        
        let isEnable = {};
        
        if (num == '1') {
        
            isEnable.isEnable = true;
        
        } else if (num == '2') {
        
            isEnable.isEnable = false; // 是否停用
        
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
            
            await new editMysql().updateMessage(id, isEnable, project);
            
            return ctx.body = {
                success: true,
                msg: '操作成功'
            };
        } else {

            /**
             * 删除数据库字段
             */

            new editMysql().deleteMessageId(id, project);
            ctx.body = {
                success: true,
                msg: '删除成功'
            };
        }

        await next();
    }
}

/**
 * 分页处理
 */

const paging = async(ctx, id) => {
    
    let currentPage = ctx.query.page ? ctx.query.page : 1;
    let countPerPage = ctx.query.pageSize ? ctx.query.pageSize : 10;
    
    let data = await new editMysql().messageFindAll(Number(currentPage), Number(countPerPage), id);
    
    if (data.rows) {
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
    
module.exports = messagePush;