module.exports = (sequelize, Sequelize) => {
    const PrivateMessage = sequelize.define('PrivateMessage', {
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
    });
    return PrivateMessage;
};