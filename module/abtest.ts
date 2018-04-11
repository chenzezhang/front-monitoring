/**
 * ios abtest 单独提出来。
 * 分类
 */

const ormModel = require('./orm');

interface abtestModle {
    uuid: string;
    channel: string;
    version: string;
    deviceType: string;
    gmtestname: string;
    gmstrategy: string;
    gmflowgroup: string;
    gmfinished: boolean;
    projectId: string;
}

class setABtest implements abtestModle {

    public uuid: string;
    public channel: string;
    public version: string;
    public deviceType: string;
    public gmtestname: string;
    public gmstrategy: string;
    public gmflowgroup: string;
    public gmfinished: boolean;
    public projectId: string;

    constructor(id: string, ch: string, ve: string, de: string, gmt: string, gms: string, gmf: string, gmfiif: boolean, getId: string) {
        this.uuid = id;
        this.channel = ch;
        this.version = ve;
        this.deviceType = de;
        this.gmtestname = gmt;
        this.gmstrategy = gms;
        this.gmflowgroup = gmf;
        this.gmfinished = gmfiif;
        this.projectId = getId;
    }

    setting() { 
        new ormModel({
            uuid: this.uuid,
            channel: this.channel,
            version: this.version,
            deviceType: this.deviceType,
            gmtestname: this.gmtestname,
            gmstrategy: this.gmstrategy,
            gmflowgroup: this.gmflowgroup,
            gmfinished: this.gmfinished,
            projectId: this.projectId
        }).creat('abtest');
    }
}

/**
 * 操作数据库逻辑
 */

abstract class updateModel {
    id: number;
    gmfinished: boolean;
    projectId: number;
    abstract updatePlugAnListId(): void;

    constructor( id: number, gmfinished: boolean, projectId: number ) {
        this.id = id;
        this.gmfinished = gmfinished;
        this.projectId = projectId;
    }
}

class updateDate extends updateModel {

    // 更新数据字段
    updatePlugAnListId() {
        new ormModel().update('abtest', { gmfinished: this.gmfinished }, { where: { id: this.id, projectId: this.projectId } });
    }
}

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
        return new ormModel().findAndCountAll('abtest', { where: { projectId: this.projectId }, 'limit': this.countPerPage, 'offset': this.countPerPage * (this.currentPage - 1) });
    }
}

export { setABtest, updateDate, findDate };