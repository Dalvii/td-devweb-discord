module.exports = (sequelize, Sequelize) => {
    const Permission = sequelize.define('permissions', {
        canCreate: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        canDelete: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
        canView: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    });
    return Permission;
};