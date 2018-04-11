/**
 * url: 地址
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

module.exports = function (sequelize, DataTypes) {
    const Rendtime = sequelize.define('rendtime', {
        id: { type: DataTypes.BIGINT(1), autoIncrement: true, primaryKey: true, unique: true },
        DNS: { type: DataTypes.STRING },
        TCP: { type: DataTypes.STRING },
        DR: { type: DataTypes.STRING },
        ONL: { type: DataTypes.STRING },
        ALLRT: { type: DataTypes.STRING },
        PRDOM: { type: DataTypes.STRING },
        FXHR: { type: DataTypes.STRING },
        loadTime: { type: DataTypes.STRING },
        deactivated: { type: DataTypes.STRING }
    },
        {

            // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': true,

            // 将updatedAt字段改个名
            'updatedAt': 'utime',

            // 将deletedAt字段改名
            'deletedAt': 'dtime'
        });
    
    Rendtime.associate = (models) => {
        Rendtime.belongsTo(models.projects);
    };
    
    return Rendtime;
};