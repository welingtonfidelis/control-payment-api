const Util = require('../services/Util');
const { Op } = require('sequelize');
const yup = require('yup');

const { Payment } = require('../models');

module.exports = {
    async create(req, res) {
        const { payment, UserId } = req.body, action = 'CREATE PAYMENT';

        if (await schema.isValid(payment)) {
            try {
                const query = await Payment.create(payment);
                Util.saveLogInfo(action, UserId)
                return query.dataValues;

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId);
            }
        }
        else {
            return null;
        }
    },

    async update(req, res) {
        const { payment, UserId } = req.body, action = 'UPDATE PAYMENT';

        if (await schema.isValid(payment)) {
            try {
                const query = await Payment.update(
                    payment,
                    {
                        return: true,
                        where: {
                            id: payment.id
                        }
                    });

                Util.saveLogInfo(action, UserId)
                return query.dataValues;

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId);
            }
        }
        else {
            return null;
        }
    }
}

//validação de campos
let schema = yup.object().shape({
    value: yup.number().required(),
    expiration: yup.number().required(),
    hourStart: yup.date().required(),
    hourEnd: yup.date().required()
});