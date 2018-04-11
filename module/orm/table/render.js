
/**
 * @param 页面耗时表，render
 */

module.exports = function (sequelize, DataTypes) {
    const Render = sequelize.define('render', {
        id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true },
        ALLRT: { type: DataTypes.STRING},
        DNS: { type: DataTypes.INTEGER },
        DR: { type: DataTypes.STRING},
        FXHR: { type: DataTypes.STRING},
        loadTime: { type: DataTypes.STRING},
        ONL: { type: DataTypes.STRING},
        PRDOM: { type: DataTypes.STRING},
        TCP: { type: DataTypes.STRING },
        WT:{ type: DataTypes.STRING },
        url:{ type: DataTypes.STRING }
    },
        {

        // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': true,

        // 将updatedAt字段改个名
            'updatedAt': 'utime',

        // 将deletedAt字段改名
            'deletedAt': 'dtime'
        });
    
    
    Render.associate = (models) =>{
        // Using additional options like CASCADE etc for demonstration
        // Can also simply do Task.belongsTo(models.User);
        Render.belongsTo(models.projects);
    };

    return Render;
};                        