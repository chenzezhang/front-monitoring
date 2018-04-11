
/**
 * @param 权限表
 * @param 权限表对应---》role表
 * 权限id暂时只分为app端和前端
 * permissionsId： 
 * 1 是整个前端，包含app
 * 2 只是前端
 * 3 只是app
 * 现在暂时不分app还是前端，这张表是为了以后扩展而创建的，permissionsId 的默认值为 ‘1’.
 * 重要的是现在暂时没有什么用。
 */

module.exports = function (sequelize, DataTypes) {
    const Project = sequelize.define('projects', {
        id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true},
        permissionsId: { type: DataTypes.STRING}   // 权限id
    },
        {
            
        // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': true,

        // 将updatedAt字段改个名
            'updatedAt': 'utime',

        // 将deletedAt字段改名
            'deletedAt': 'dtime'
        });
    
    Project.associate = (models) => {
        Project.belongsTo(models.role);
    };
    
    return Project;
};