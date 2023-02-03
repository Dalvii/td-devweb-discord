const db = require("../models");
const User = db.user;
const Channel = db.channel;
const Permission = db.permission;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  console.log("Checking username or email")
  // Username
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Username is already in use!"
      });
      return;
    }

    // Email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: "Failed! Email is already in use!"
        });
        return;
      }

      next();
    });
  });
};


const checkPermission = (action) => {
	return async (req, res, next) => {
		const userUsername = req.username;
		const channelId = req.params.channelId;
		const messageId = req.params.messageId;

		let targetId = channelId;
		if (messageId) targetId = messageId;

		const permission = await Permission.findOne({
			where: {
				userUsername,
				channelId: targetId
			}
		});

		if (!permission || !permission[action]) {
      return res.status(401).send({
        message: "Unauthorized"
      });
		}
		next();
	};
}


const assignPermission = async (userId, channelId, ) => {
  const user = await User.findByPk(userId);
  const channel = await Channel.findByPk(channelId);
  const permission = await Permission.create({
    canDelete: view,
    userId: user.id,
    channelId: channel.id
  });
  return permission;
}


const sendPermission = (action) => {
	return async (req, res, next) => {
		const userUsername = req.username;
		const channelId = req.params.channelId;
		const messageId = req.params.messageId;

		let targetId = channelId;
		if (messageId) targetId = messageId;

		const permission = await Permission.findOne({
			where: {
				userUsername,
				channelId: targetId
			}
		});

		if (!permission || !permission[action]) {
      return res.status(401).send({
        message: "Unauthorized"
      });
		}
    req.permission = permission;
		next();
	};
}

module.exports = {
  checkDuplicateUsernameOrEmail,
  checkPermission,
  sendPermission
};;
