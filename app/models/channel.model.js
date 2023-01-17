module.exports = (sequelize, Sequelize) => {
	const Channel = sequelize.define("channels", {
		name: {
			type: Sequelize.STRING,
			allowNull: false
		},
		type: {
			type: Sequelize.STRING
		},
	});

	return Channel;
};
