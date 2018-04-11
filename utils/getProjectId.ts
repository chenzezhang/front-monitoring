/**
 * @param 返回权限id
 */

const editMysql = require('./../module/index');

import { Context } from 'koa';

class getProjectId{
    
    ctx: Context;

    constructor(ctx: Context) {
        this.ctx = ctx;
    }

    async getId() {

        const token = require('./../utils/getToken')(this.ctx);

        const da = await new editMysql().selectToken(token);
        
        if (!da && this.ctx) {
            return this.ctx.body = {
                success: false,
                msg: '失败'
            };
        }
    
        const dt = await new editMysql().selectProjects(da.roleId);
    
        return dt.id;
    }

}

export  { getProjectId };
