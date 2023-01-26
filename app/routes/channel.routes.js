const { authJwt } = require("../middleware");
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
		"/api/channel",
		[authJwt.verifyToken],
		channelController.findAll
	);

	// Creer un channel
	app.post(
		"/api/channel",
		[authJwt.verifyToken],
		channelController.create
	);

	// Supprimer un channel
	app.delete(
		"/api/channel/:channelId",
		[authJwt.verifyToken],
		channelController.delete
	);


	// app.get(
	//   "/api/test/mod",
	//   [authJwt.verifyToken, authJwt.isModerator],
	//   controller.moderatorBoard
	// );

	// app.get(
	//   "/api/test/admin",
	//   [authJwt.verifyToken, authJwt.isAdmin],
	//   controller.adminBoard
	// );
};
