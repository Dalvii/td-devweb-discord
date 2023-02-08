const Sequelize = require("sequelize");

// Initialisation de la bdd SQLite
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: './database.sqlite'
});


const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Importation des modèles 
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
db.message = require("../models/message.model.js")(sequelize, Sequelize);
db.channel = require("../models/channel.model.js")(sequelize, Sequelize);
db.permission = require("../models/permission.model.js")(sequelize, Sequelize);
db.pm = require("../models/pm.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
	through: "user_roles",
	foreignKey: "roleId",
	otherKey: "userId"
});
db.user.belongsToMany(db.role, {
	through: "user_roles",
	foreignKey: "userId",
	otherKey: "roleId"
});


db.channel.hasMany(db.message, {
	onDelete: 'cascade',
	hooks: true,
});

// Gestion des relations pour les permissions avec channels/msg/users
db.user.hasMany(db.permission, {
	as: 'permissions',
	onDelete: 'cascade',
	hooks: true
});
db.channel.hasMany(db.permission, {
	as: 'permissions',
	onDelete: 'cascade',
	hooks: true
});
db.message.hasMany(db.permission, {
	as: 'permissions',
	onDelete: 'cascade',
	hooks: true
});


// Gestion de relation pour pour les messages privés
db.user.hasMany(db.pm, { as: 'sentMessages', foreignKey: 'senderId' });
db.user.hasMany(db.pm, { as: 'receivedMessages', foreignKey: 'recipientId' });

db.pm.belongsTo(db.user, { as: 'sender', foreignKey: 'senderId' });
db.pm.belongsTo(db.user, { as: 'recipient', foreignKey: 'recipientId' });



// Ajoute les roles dans la bdd si ils n'existent pas
db.ROLES = ["user", "admin", "moderator"];
const roles = [
	{ id: 1, name: 'user' },
	{ id: 2, name: 'admin' },
	{ id: 3, name: 'moderator' }
];
roles.forEach(async role => {
	const existingRole = await db.role.findOne({ where: { id: role.id } });
	if (!existingRole) {
		await db.role.create({
			id: role.id,
			name: role.name
		});
	}
});

module.exports = db;


// INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('1', 'user', '2022-12-11 20:24:50.000000', '2022-12-11 20:24:50.000000');
// INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('2', 'admin', '2022-12-11 20:26:04.000000', '2022-12-11 20:26:04.000000');
// INSERT INTO `roles` (`id`, `name`, `createdAt`, `updatedAt`) VALUES ('3', 'moderator', '2022-12-11 20:26:20.000000', '2022-12-11 20:26:20.000000');