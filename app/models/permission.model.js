module.exports = (sequelize, Sequelize) => {
    const Permission = sequelize.define('permissions', {
        action: {
            type: Sequelize.STRING,
            allowNull: false
        },
        role: {
            type: Sequelize.INTEGER,
            references: {
                model: 'roles',
                key: 'id'
            }
        }
    });
    return Permission;
};