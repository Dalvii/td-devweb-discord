const db = require("../models");
const PrivateMessage = db.pm;
const User = db.user;
const Op = db.Sequelize.Op;


exports.send = async (req, res) => {
    try {
        const sender = await User.findByPk(req.username) 
        const recipient = await User.findByPk(req.body.recipientId);
        const message = await PrivateMessage.create({
            senderId: sender.username,
            recipientId: recipient.username,
            content: req.body.content,
        });
        res.status(201).json({ message });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.get = async (req, res) => {
    try {
        const messages = await PrivateMessage.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.username, recipientId: req.params.recipientId },
                    { senderId: req.params.recipientId, recipientId: req.username },
                ],
          
            },
            include: [
                { model: User, as: 'sender' },
                { model: User, as: 'recipient' },
            ],
            order: [['createdAt', 'ASC']],
        });
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};