
/**
 * abtest
 */
 
module.exports = function (sequelize, DataTypes) {
    const ABtest = sequelize.define('abtest', {
        id: { type: DataTypes.BIGINT(1), autoIncrement: true, primaryKey: true, unique: true },
        uuid: { type: DataTypes.STRING },
        channel: { type: DataTypes.STRING },
        version: { type: DataTypes.STRING },
        deviceType: { type: DataTypes.STRING },
        gmtestname: { type: DataTypes.STRING },  // 实验key
        gmstrategy: { type: DataTypes.STRING },  // 策略key
        gmflowgroup: { type: DataTypes.STRING }, //流量组，用于上报。每个流量组只属于一个策略。
        gmfinished: { type: DataTypes.BOOLEAN } //标识实验是否终止，如果已经终止，则不上报数据，不影响试验策略
    },
        {

            // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': true,

            // 将updatedAt字段改个名
            'updatedAt': 'utime',

            // 将deletedAt字段改名
            'deletedAt': 'dtime'
        });
    
    ABtest.associate = (models) => {
        ABtest.belongsTo(models.projects);
    };
    
    return ABtest;
};