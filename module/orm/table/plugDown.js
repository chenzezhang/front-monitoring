
/**
 * @param 创建角色表
 * @param admin 
 */

module.exports = function (sequelize, DataTypes) {
    const PlugDown = sequelize.define('plugDown', {
        id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true },
        name: { type: DataTypes.STRING}, // channel
        sum: { type: DataTypes.INTEGER },
        mobileModel: { type: DataTypes.STRING}, // 手机型号
        mobileVersion: { type: DataTypes.STRING}, // 手机版本号
        networkType: { type: DataTypes.STRING}, // 网络类型
        romInfo: { type: DataTypes.STRING}, // 剩余内存
        appVersion: { type: DataTypes.STRING}, // app版本
        imei: { type: DataTypes.STRING} // imei唯一标示
    },
        {

        // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': true,

        // 将updatedAt字段改个名
            'updatedAt': 'utime',

        // 将deletedAt字段改名
            'deletedAt': 'dtime'
        });
    
    
    PlugDown.associate = (models) =>{
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        PlugDown.belongsTo(models.plugAnListInfo);
        PlugDown.belongsTo(models.projects);
    };

    return PlugDown;
};