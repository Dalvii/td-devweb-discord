module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
			allowNull: false,
			validate: {
				isEmail: true
			}
    },
    password: {
      type: Sequelize.STRING
    }
  });

  return User;
};
