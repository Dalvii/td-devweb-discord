const { authJwt, permissions } = require("../middleware");
const messageController = require("../controllers/message.controller");
const channelController = require("../controllers/channel.controller");

module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});


	// Get list des channels
	app.get(
		"/api/channels",
		[authJwt.verifyToken],
		channelController.findAll
	);

	// Creer un channel
	app.post(
		"/api/channel",
		authJwt.verifyToken,
		channelController.create
	);

	// Modifier un channel
	app.put(
		"/api/channel/:channelId",
		authJwt.verifyToken,
		channelController.update
	);

	// Supprimer un channel
	app.delete(
		"/api/channel/:channelId",
		[authJwt.verifyToken],
		// permissions.checkPermission('canDelete'),
		channelController.delete
	);
};
