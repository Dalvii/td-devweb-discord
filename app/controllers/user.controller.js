const db = require("../models");
const User = db.user;
const Op = db.Sequelize.Op;

// Create and Save a new User
exports.create = (req, res) => {
	// Validate request
	if (!req.body.username || !req.body.email || !req.body.password) {
		res.status(400).send({
			message: "Content can not be empty!"
		});
		return;
	}

	// Create a User
	const { username, email, password } = req.body

	// Save User in the database
	User.create({ username, email, password })
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while creating the User."
			});
		});
};

// Retrieve all Users from the database.
exports.findAll = (req, res) => {
	const username = req.query.username;
	const condition = username ? { username: { [Op.like]: `%${username}%` } } : null;

	User.findAll({ where: condition })
		.then(data => {
			res.send(data);
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while retrieving user."
			});
		});
};

// Find a single User with an id
exports.findOne = (req, res) => {
	const id = req.params.id;

	User.findByPk(id)
		.then(data => {
			if (data) {
				res.send(data);
			} else {
				res.status(404).send({
					message: `Cannot find Tutorial with id=${id}.`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error retrieving Tutorial with id=" + id
			});
		});
};

// Update a User by the id in the request
exports.update = (req, res) => {
	const id = req.params.id;

	Tutorial.update(req.body, {
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "User was updated successfully."
				});
			} else {
				res.send({
					message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Error updating User with id=" + id
			});
		});
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
	const id = req.params.id;

	User.destroy({
		where: { id: id }
	})
		.then(num => {
			if (num == 1) {
				res.send({
					message: "User was deleted successfully!"
				});
			} else {
				res.send({
					message: `Cannot delete User with id=${id}. Maybe User was not found!`
				});
			}
		})
		.catch(err => {
			res.status(500).send({
				message: "Could not delete User with id=" + id
			});
		});
};

// Delete all User from the database.
exports.deleteAll = (req, res) => {
	User.destroy({
		where: {},
		truncate: false
	})
		.then(nums => {
			res.send({ message: `${nums} User were deleted successfully!` });
		})
		.catch(err => {
			res.status(500).send({
				message:
					err.message || "Some error occurred while removing all users."
			});
		});
};

