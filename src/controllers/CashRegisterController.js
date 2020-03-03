const Util = require('../services/Util');
const { Op } = require('sequelize');
const yup = require('yup');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv-safe').config()
const jwt = require('jsonwebtoken');

const DonationController = require('./DonationController');
const OngController = require('./OngController');

const { User } = require('../models');
const { Address } = require('../models');
const { LogInfo } = require('../models');
const { CashRegister } = require('../models');

module.exports = {
    async create(req, res) {
        const { cashregister, UserId, OngId } = req.body, action = 'CREATE CASHREGISTER';

        if (await schema.isValid(cashregister)) {
            try {
                cashregister.OngId = OngId;
                cashregister.UserId = UserId;
                const query = await CashRegister.create(cashregister);

                Util.saveLogInfo(action, UserId)
                res.status(200).send({ status: true, response: query, code: 20 });
            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId)
                res.status(500).send({ status: false, response: err, code: 22 })
            }
        }
        else {
            res.status(400).send({ status: false, response: 'invalid user info', code: 21 })
        }
    },

    async getAll(req, res) {
        const { UserId, OngId, dateStart, dateEnd } = req.body, action = 'SELECT ALL CASHREGISTERS'

        try {
            const query = await CashRegister.findAll({
                where: { OngId },
                attributes: [
                    "id", "description", "type", "value",
                    "paidIn", "createdAt", "observation"
                ],
                order: [['paidIn', 'DESC']],
                include: [{
                    model: User,
                    attributes: [
                        "id", "name"
                    ]
                }],
            });

            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async getAllByFilter(req, res) {
        let { UserId, OngId } = req.body,
            { start, end, type, donation } = req.query,
            action = 'SELECT ALL BY FILTER CASHREGISTERS';
        const [tIn = '', tOut = ''] = ((type.replace(' ', '')).split(','));
       
        try {
            let query = await CashRegister.findAll({
                where: {
                    OngId,
                    paidIn: { [Op.between]: [start, end] },
                    type: { [Op.or]: [tIn, tOut] }
                },
                attributes: [
                    "id", "description", "type", "value",
                    "paidIn", "createdAt", "observation"
                ],
                order: [['paidIn', 'DESC']],
                include: [
                    {
                        model: User,
                        attributes: [
                            "id", "name"
                        ]
                    }],
            });

            if (donation){
                const donations = await DonationController.getByDate(req, res, true);
                
                for(const donation of donations){
                    const { Taxpayer } = donation;
                    query.push({
                        id: donation.id,
                        description: `Doação - ${Taxpayer.name}`,
                        type: 'in',
                        value: donation.value,
                        paidIn: donation.paidIn,
                        createdAt: donation.createdAt,
                        observation: '',
                        User: {
                            id: 0,
                            name: "ND"
                        }
                    })
                }
            } 


            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async get(req, res) {
        const { id } = req.params, action = 'SELECT CASHREGISTER';
        const { UserId } = req.body;

        try {
            const query = await CashRegister.findOne({
                where: { id },
                attributes: [
                    "id", "description", "type", "value",
                    "paidIn", "createdAt", "observation"
                ],
                include: [{
                    model: User,
                    attributes: [
                        "id", "name"
                    ]
                }],
            })

            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err })
        }
    },

    async update(req, res) {
        const { cashregister, UserId } = req.body, { id } = req.params, action = 'UPDATE CASHREGISTER';

        if (await schema.isValid(cashregister)) {
            try {
                const query = await CashRegister.update(
                    cashregister,
                    {
                        return: true,
                        where: {
                            id
                        }
                    });

                Util.saveLogInfo(action, UserId)
                res.status(200).send({ status: true, response: query, code: 20 });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId)
                res.status(500).send({ status: false, response: err, code: 22 })
            }
        }
        else {
            res.status(400).send({ status: false, response: 'invalid user info', code: 21 })
        }
    },

    async delete(req, res) {
        const { UserId } = req.body, { id } = req.params, action = 'DELETE CASHREGISTER';

        try {
            const query = await CashRegister.destroy({
                where: { id }
            });

            Util.saveLogInfo(action, UserId)
            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    }
}

//validação de campos
let schema = yup.object().shape({
    value: yup.number().required(),
    type: yup.string().required(),
    description: yup.string().required(),
    paidIn: yup.date().required(),
});