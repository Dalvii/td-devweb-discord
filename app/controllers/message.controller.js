const db = require("../models");
const Message = db.message;
const Op = db.Sequelize.Op;

// Create and Save a new Message
exports.create = (req, res) => {
	// Validate request
	if (!req.body.content || !req.body.channel || !req.body.sender) {
		res.status(400).send({
			message: "Content can not be empty!"
		});
		return;
	}

	// Create a Message
	const { content, channel, sender } = req.body

	// Save Message in the database
	Message.create({ content, sender, channel })
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

// Retrieve all Messages from the database.
exports.findAll = (req, res) => {
	const message = req.query.message;
	const condition = message ? { message: { [Op.like]: `%${message}%` } } : null;

	Message.findAll({ where: condition })
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving messages."
			});
		});
};

// Find a single Message with an id
exports.findOne = (req, res) => {
	const id = req.params.id;
	Message.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Cannot find Message with id=${id}.`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Message with id=" + id
			});
		});
};

// Find Messages from Channel id
exports.findByChannel = (req, res) => {
	const channel = req.params.channelId;
	Message.findAll({ where: { channel } })
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving messages."
			});
		});
};


// Find Messages from Sender id
exports.findBySender = (req, res) => {
	const sender = req.params.senderId;
	Message.findAll({ where: { sender } })
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving messages."
			});
		});
};

// Update a Message by the id in the request
exports.update = (req, res) => {
	const id = req.params.id;

	Message.update(req.body, {
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Message was updated successfully."
				});
			} else {
				res.send({
					message: `Cannot update Message with id=${id}. Maybe Message was not found or req.body is empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error updating Message with id=" + id
			});
		});
};

// Delete a Message with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	Message.destroy({
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "Message was deleted successfully!"
				});
			} else {
				res.send({
					message: `Cannot delete Message with id=${id}. Maybe Message was not found!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Could not delete Message with id=" + id
			});
		});
};

// Delete all Message from the database.
exports.deleteAll = (req, res) => {
	Message.destroy({
		where: {},
		truncate: false
	})
		.then(nums => {
			res.send({ message: `${nums} Message were deleted successfully!` });
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while removing all Messages."
			});
		});
};

