const { Op } = require('sequelize');

const { Donation } = require('../models');
const { Taxpayer } = require('../models');
const { Address } = require('../models');

const TaxpayerController = require('./TaxpayerController');

const Util = require('../services/Util');

const yup = require('yup');

module.exports = {
    async create(req, res) {
        let { donation, UserId, OngId } = req.body, action = 'CREATE DONATION';

        if (await schema.isValid(donation)) {
            donation = validValues(donation);

            try {
                const query = await Donation.create(donation);

                Util.saveLogInfo(action, UserId)
                res.status(200).send({ status: true, response: query, code: 20 });
            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId)
                res.status(500).send({ status: false, response: err, code: 22 })
            }
        }
        else {
            res.status(400).send({ status: false, response: 'invalid donation info', code: 21 })
        }
    },

    async getAll(req, res) {
        const { UserId, OngId } = req.body, action = 'SELECT ALL DONATIONS';

        try {
            let query = await Donation.findAll({
                where: { '$Taxpayer.OngId$': OngId },
                attributes: [
                    "id", "value", "paidIn", "observation", "createdAt"
                ],
                order: [['createdAt', 'ASC']],
                include: [{
                    model: Taxpayer,
                    attributes: [
                        "id", "name", "phone1",
                        "phone2"
                    ],
                    include: [{
                        model: Address,
                        attributes: [
                            "id", "cep", "state",
                            "city", "district", "street",
                            "complement", "number"
                        ]
                    }],
                }],
            });

            query = validateDonations(query);

            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async getAllMonth(req, res) {
        const { UserId, OngId } = req.body;

        const resp = await this.returnDonationReceive(UserId, OngId, res);
        res.status(200).send({ status: true, response: resp, code: 20 });
    },

    async getByDate(req, res, cashRegister = null) {
        const { UserId, OngId } = req.body, { start, end } = req.query,
            action = 'SELECT DONATION BYDATE';

        try {
            const query = await Donation.findAll({
                where: {
                    paidIn: { [Op.between]: [start, end] },
                    '$Taxpayer.OngId$': OngId
                },
                attributes: ['id', 'TaxpayerId', 'value', 'paidIn', 'createdAt'],
                order: [['paidIn', 'ASC']],
                include: [
                    {
                        model: Taxpayer,
                        attributes: ["id", "name"],
                        as: 'Taxpayer'
                    }]
            })

            //chamada para relatório vindo do CashRegisterController
            if (cashRegister) return query;
            //chamada para relatório apenas de dações
            else res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async getByTaxpayer(req, res) {
        let { UserId } = req.body, { start, end, arrayTaxpayerId } = req.query,
            action = 'SELECT DONATION BYTAXPAYER';

        arrayTaxpayerId = JSON.parse(arrayTaxpayerId);

        try {
            const query = await Donation.findAll({
                where: {
                    paidIn: { [Op.between]: [start, end] },
                    '$Taxpayer.id$': { [Op.in]: arrayTaxpayerId }
                },
                attributes: ['id', 'TaxpayerId', 'value', 'paidIn', 'observation'],
                order: [['TaxpayerId', 'ASC']],
                include: [{
                    model: Taxpayer,
                    attributes: [
                        "id", "name"
                    ]
                }]
            })

            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async get(req, res) {
        const { UserId } = req.body, { id } = req.params, action = 'SELECT DONATION';

        try {
            let query = await Donation.findOne({
                where: { id },
                attributes: [
                    "id", "value", "paidIn", "observation", "createdAt"
                ],
                order: [['createdAt', 'ASC']],
                include: [{
                    model: Taxpayer,
                    attributes: [
                        "id", "name", "phone1",
                        "phone2"
                    ],
                    include: [{
                        model: Address,
                        attributes: [
                            "id", "cep", "state",
                            "city", "district", "street",
                            "complement", "number"
                        ]
                    }],
                }],
            });

            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async update(req, res) {
        let { donation, UserId } = req.body, { id } = req.params, action = 'UPDATE DONATION';

        donation = validValues(donation);

        try {
            const query = await Donation.update(
                donation,
                {
                    return: true,
                    where: {
                        id
                    }
                }
            );

            Util.saveLogInfo(action, UserId);
            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async delete(req, res) {
        const { UserId } = req.body, { id } = req.params, action = 'DELETE DONATION';

        try {
            const query = await Donation.destroy({
                where: {
                    id
                }
            });

            Util.saveLogInfo(action, UserId);
            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async returnDonationReceive(UserId, OngId = null, res = null, obj = null) {
        const action = 'SELECT ALL DONATIONS MONTH';

        const today = new Date(), y = today.getFullYear(), m = today.getMonth();
        const firstDay = new Date(y, m, 1), lastDay = new Date(y, m + 1, 0);
        let resp = {};

        try {
            let query = await Donation.findAll({
                where: {
                    paidIn: { [Op.between]: [firstDay, lastDay] },
                    '$Taxpayer.OngId$': OngId
                },
                attributes: [
                    "id", "value", "paidIn", "createdAt"
                ],
                order: [['paidIn', 'ASC']],
                include: [{
                    model: Taxpayer,
                    attributes: ["id", "name"],
                    as: 'Taxpayer'
                }]
            });

            query = validateDonations(query);

            resp['donation'] = query;

            const arrayTaxpayerId = query.map(el => {
                const { Taxpayer } = el;
                if (Taxpayer) return Taxpayer.id;
            })

            //chamada server/side
            if (obj) {
                query = await TaxpayerController.getByExpiratioEqualDate(UserId, arrayTaxpayerId, obj)
            }
            //chamada client/side
            else {
                query = await TaxpayerController.getByExpiratioWeek(UserId, OngId, arrayTaxpayerId);
            }

            resp['taxpayer'] = query;

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            if (res) res.status(500).send({ status: false, response: err, code: 22 });
        }
        return resp;
    }
}

//verifica se campos de endereço foram preenchidos
function validValues(obj) {
    obj.observation = obj.observation === '' ? null : obj.observation;

    return obj;
}

//envia ao usuário doações feitas apenas por contribuintes
//não excluidos do sistema (solução temporária -> corrigir com query no bd)
function validateDonations(array) {
    array = array.filter(el => {
        if (el.Taxpayer) return el;
    });

    return array;
}

//validação de campos
let schema = yup.object().shape({
    value: yup.number().required(),
    paidIn: yup.date().required(),
    TaxpayerId: yup.number().required(),
});