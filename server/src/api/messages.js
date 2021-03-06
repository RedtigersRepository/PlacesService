const express = require('express');
const Joi = require('joi');

const db = require('../db');
const messages = db.get('messages');

const router = express.Router();

const schema = Joi.object().keys({
    name: Joi.string().min(1).max(50).required(),
    message: Joi.string().min(1).max(500).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    details: Joi.object().required()
});

router.get('/', (req, res) => {
    messages
        .find()
        .then(allMessages => {
            res.json(allMessages);
        });
});

router.post('/', (req, res, next) => {
    const result = Joi.validate(req.body, schema);
    if (result.error === null) {
        // add current time
        // insert into DB
        const { name, message, latitude, longitude, details } = req.body;
        const userMessage = {
            name,
            message,
            latitude,
            longitude,
            details,
            date: new Date()
        };
        messages
            .insert(userMessage)
            .then(insertedMessage => {
                res.json(insertedMessage);
            });
    } else {
        next(result.error);
    }
});


module.exports = router;
