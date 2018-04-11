/**
 * rendTime 单独提出来
 */

import { rendTime, findDate }from '../module/rendtime';
import { getProjectId } from './../utils/getProjectId';
import { Context } from "koa";
const redis = require('./../server/redis');

/**
 * 实现分页对外接口
 * 
 */
class getRendTime {

    static async setRendTime(ctx: Context) {

        if (!ctx.request.body) return;

        let project = await new getProjectId(ctx).getId();

        const { url, dns, wt, dr, onl, allrt, prdom, fxhr, loadTime } = ctx.request.body;
        
        new rendTime(url, dns, wt, dr, onl, allrt, prdom, fxhr, loadTime, project).setting();
    }

    static async getRendTimePage(ctx: Context) {
        if (!ctx.query) return;

        let project = await new getProjectId(ctx).getId();

        const { page, pageSize } = ctx.query;

        new findDate(project, page, pageSize).findPagingDate();
    }
    
}

export { getRendTime };