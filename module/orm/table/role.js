
/**
 * @param 部门表
 * @param {理财、消金等} 
 */

module.exports = function (sequelize, DataTypes) {
    const Role = sequelize.define('role', {
        id: { type: DataTypes.BIGINT(11), autoIncrement: true, primaryKey: true, unique: true, comment:'角色Id' },
        roleName: { type: DataTypes.STRING }
    },
        {
            tableName: 'role',   
            
        // 是否需要增加createdAt、updatedAt、deletedAt字段
            'timestamps': true,

        // 将updatedAt字段改个名
            'updatedAt': 'utime',

        // 将deletedAt字段改名
            'deletedAt': 'dtime'
        });
    return Role;
};