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


	// Lister les messages d'un channel
	app.get(
		"/api/channel/:channelId",
		[authJwt.verifyToken],
		messageController.findAllFromChannel
	);

	// Envoyer un message dans un channel
	app.post(
		"/api/channel/:channelId",
		[authJwt.verifyToken],
		messageController.create
	)

	// Modifier un message dans un channel
	app.put(
		"/api/channel/:channelId/:messageId",
		[authJwt.verifyToken],
		messageController.update
	)

	// Modifier un message dans un channel
	app.delete(
		"/api/channel/:channelId/:messageId",
		[authJwt.verifyToken],
		messageController.delete
	)

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
