
/**
 * @param IOS ABtest 控制。
 * 1、不考虑日志。
 * 2、采用输入的方式。
 * ----------------------------
 * 调用方式：get 。
 *      根据参数控制策略生效，返回相应的数据。
 *  数据格式。Object
 *  {
 *      "data": [
            {
                "gmtestname": "test1",//实验key
                "gmstrategy": "strategy1",      //策略key，客户端根据策略key选择策略方案
                "gmflowgroup”: "flow1",      //流量组，用于上报。每个流量组只属于一个策略。
                “gmfinished": false       //标识实验是否终止，如果已经终止，则不上报数据，不影响试验策略
            }
        ]
 *    }
 */

import { setABtest, updateDate, findDate } from '../module/abtest';
import { getProjectId } from './../utils/getProjectId';
import { Context } from "koa";

const redis = require('./../server/redis');

/**
 * 实现分页对外接口
 */

class IosABtest {

    static async setIosABtest<T>(ctx: Context, next: Function) {
        // 后端配置入口。
        if (!ctx.request.body) return;

        let project = await new getProjectId(ctx).getId();

        const gmfinished = false;
        
        const { uuid, channel, version, deviceType, gmtestname, gmstrategy, gmflowgroup } = ctx.request.body;

        new setABtest(uuid, channel, version, deviceType, gmtestname, gmstrategy, gmflowgroup, gmfinished, project).setting();

        redis.lpush('IosABtest', JSON.stringify(ctx.request.body));
        
        ctx.body = {
            success: true,
            msg: '成功'
        }

        await next();

    }

    static async getIosABtest<T>(ctx: Context, next: Function) {

        let project = await new getProjectId(ctx).getId();

        let currentPage = ctx.query.page || 1;
        let countPerPage = ctx.query.pageSize || 10;

        const result = await new findDate(project, Number(currentPage), Number(countPerPage)).findPagingDate();

        if (result.rows) {
            ctx.body = {
                success: true,
                data: result.rows,
                msg: '成功',
                page: Math.ceil(result.count / Number(countPerPage))
            };
        } else {
            ctx.body = {
                success: false,
                data: [],
                msg: "成功"
            };
        }

        await next();
        // 获取数据展示
    }

    static async iosABtestSetting<T>(ctx: Context, next: Function) {
        // 更新字段

        // if (!ctx.request.body) return;

        let project = await new getProjectId(ctx).getId();
        
        const { order } = ctx.request.body;

        console.log(ctx.request.body)

        let gmfinished;

        if (ctx.request.body.gmfinished == '1') {
            gmfinished = true;
        } else {
            gmfinished = false;
        }

        let result = await redis.lrange('IosABtest', order, order);

        result = JSON.parse(result);

        result.gmfinished = gmfinished;

        redis.lset('IosABtest', order, JSON.stringify(result));

        new updateDate(order, gmfinished, project).updatePlugAnListId();
        
        ctx.body = {
            success: true,
            msg: "成功"
        }

        await next();
    }

    // 对客户端输出数据,需要高并发处理。
    // 1、高并发访问。
    // 2、第一次从数据库取值，放入redis中，前端访问redis.
    // --------------------------------
    // 问题出现：
    // redis中的值什么时候更新？怎么更新？
    // 服气了，真是瞎考虑问题，都不在点上。
    /**
     *  解决方案如下：
     *    1、虽然说前端数据是高并发接口，但是后台设置的地方不是高并发，不可能每秒去改n次吧。
     *    2、那我就根据后台的设置改更新缓存数据库。
     *    3、后台设置修改 --- 》 mysql（根据mysql返回值 === 》去更新redis中的数据。）
     *    4、前端数据从redis中获取。
     *  
     */ 
    static async GMABTestpolicydata<T>(ctx: any) {
        
        if (!ctx.query) return;
    
        ctx.body = {
            success: true,
            data: {
                "fundType":[
                    {
                        "gmabtestkey": "fundhomepagekey",
                        "gmstrategy": "A",
                        "gmflowgroup": "flow1",
                        "gmfinished": false
                    }
               ]
            },
            msg: "成功"
        };
       
    }


}

export { IosABtest };
