const db = require("../models");
const Channel = db.channel;
const Permission = db.permission;
const Op = db.Sequelize.Op;

// Create and Save a new Channel
exports.create = (req, res) => {
	// Validate request
	if (!req.body.name || !req.body.type) {
		res.status(400).send({
			message: "Content can not be empty!"
		});
		return;
	}

	// Create a Channel
	const { name, type } = req.body

	// Save Channel in the database
	Channel.create({ name, type })
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the Tutorial."
			});
		});
};

// Retrieve all Channels from the database.
exports.findAll = (req, res) => {
	const channel = req.params.channelId;
	const condition = channel ? { channel: { [Op.like]: `%${channel}%` } } : null;
	const userUsername = req.username

	Channel.findAll({ where: condition })
		.then(async channels => {
			// const data = await Promise.all(channels.map(async (data) => {
			// 	const channel = data.dataValues
			// 	const permission = await Permission.findOne({
			// 		where: {
			// 			userUsername,
			// 			channelId: channel.id
			// 		}
			// 	});
			// 	if (!permission) return data.dataValues
			// 	data.dataValues.permission = permission.dataValues
			// 	return data.dataValues
			// }));
			// console.log(data)

			res.send(channels);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving channels."
			});
		});
};

// Find a single Channel with an id
exports.findOne = (req, res) => {
	const id = req.params.channelId;

	Channel.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Cannot find Channel with id=${id}.`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Channel with id=" + id
			});
		});
};

// Update a Channel by the id in the request
exports.update = (req, res) => {
	const id = req.params.channelId;

	Channel.update(req.body, {
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Channel was updated successfully."
				});
			} else {
				res.send({
					message: `Cannot update Channel with id=${id}. Maybe Channel was not found or req.body is empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error updating Channel with id=" + id
			});
		});
};

// Delete a Channel with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.channelId;
	Channel.destroy({
		where: { id: +id }
	})
		.then(num => {
			console.log(num)
			if (num == 1) {
				res.send({
					message: "Channel was deleted successfully!"
				});
			} else {
				res.send({
					message: `Cannot delete Channel with id=${id}. Maybe Channel was not found!`
				});
			}
		})
		.catch(err => {
			console.log(err)

			res.status(500).send({
				message: "Could not delete Channel with id=" + id
			});
		});
};

// Delete all Channel from the database.
exports.deleteAll = (req, res) => {
	Channel.destroy({
		where: {},
		truncate: false
	})
		.then(nums => {
			res.send({ message: `${nums} Channel were deleted successfully!` });
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while removing all Channels."
			});
		});
};

