/**
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
 */

const ormModel = require('./orm');

interface rendtimeModle {
    url: string;
    dns: string;
    wt: string;
    dr: string;
    onl: string;
    allrt: string;
    prdom: string;
    fxhr: string;
    loadTime: string;
    projectId: string;
}

class rendTime implements rendtimeModle {

    public url: string;
    public dns: string;
    public wt: string;
    public dr: string;
    public onl: string;
    public allrt: string;
    public prdom: string;
    public fxhr: string;
    public loadTime: string;
    public projectId: string;

    constructor(url: string, dns: string, wt: string, dr: string, onl: string, allrt: string, prdom: string, fxhr: string, loadTime: string, getId: string) {
        this.url = url;
        this.dns = dns;
        this.wt = wt;
        this.dr = dr;
        this.onl = onl;
        this.allrt = allrt;
        this.prdom = prdom;
        this.fxhr = fxhr;
        this.loadTime = loadTime;
        this.projectId = getId;
    }

    setting() { 
        new ormModel({
            url: this.url,
            dns: this.dns,
            wt: this.wt,
            dr: this.dr,
            onl: this.onl,
            allrt: this.allrt,
            prdom: this.prdom,
            fxhr: this.fxhr,
            loadTime: this.loadTime,
            projectId: this.projectId
        }).creat('abtest');
    }
}

/**
 * 操作数据库逻辑
 */

abstract class findModel {

    projectId: number;
    currentPage: number;
    countPerPage: number;

    constructor(projectId: number, currentPage: number, countPerPage: number) {
        this.projectId = projectId;
        this.currentPage = currentPage;
        this.countPerPage = countPerPage;
    }
}

class findDate extends findModel {
    // 分页查询数据
    findPagingDate() {
        return new ormModel().findAndCountAll('rendtime', { where: { projectId: this.projectId }, 'limit': this.currentPage, 'offset': this.countPerPage * (this.currentPage - 1) });
    }
}

export { rendTime, findDate };