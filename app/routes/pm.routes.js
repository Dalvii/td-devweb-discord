const { authJwt, permissions } = require("../middleware");
const pmController = require('../controllers/pm.controller');


module.exports = function (app) {
	app.use(function (req, res, next) {
		res.header(
			"Access-Control-Allow-Headers",
			"x-access-token, Origin, Content-Type, Accept"
		);
		next();
	});


	// Lister messages privé entre l'utilisateur actuel et un utilisateur donné 
	app.get(
		"/api/pm/:recipientId",
		[authJwt.verifyToken],
		pmController.get
	);

	// Envoyer un msg mrivé
	app.post(
		"/api/pm",
		[authJwt.verifyToken],
		pmController.send
	);

};
