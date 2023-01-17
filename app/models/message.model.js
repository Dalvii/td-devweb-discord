module.exports = (sequelize, Sequelize) => {
    const Message = sequelize.define('messages', {
        content: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        sender: {
            type: Sequelize.INTEGER,
            references: {
                model: 'users',
                key: 'id'
            }
        },
        channel: {
            type: Sequelize.INTEGER,
            references: {
                model: 'channels',
                key: 'id'
            }
        }
    });
    return Message;
};
