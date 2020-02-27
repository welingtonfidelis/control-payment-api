const Util = require('../services/Util');
const { Op } = require('sequelize');
const yup = require('yup');

const AddressController = require('./AddressController');
const PaymentController = require('./PaymentController');

const { Taxpayer } = require('../models');
const { Address } = require('../models');
const { Payment } = require('../models');
const { Ong } = require('../models');

module.exports = {
    async create(req, res) {
        const { taxpayer, UserId, OngId } = req.body, action = 'CREATE TAXPAYER';

        if (await schema.isValid(taxpayer)) {
            try {
                //cria um novo endereço e recupera seu id
                const AddressId = (await AddressController.create(req, res)).id;
                //insere id do novo endereço
                taxpayer.AddressId = AddressId;

                //cria um novo pagamento recorrente e recupera seu id
                const PaymentId = (await PaymentController.create(req, res)).id;
                //insere id do novo pagamento
                taxpayer.PaymentId = PaymentId;

                //inclui id da ong, com base no usuário logado (token)
                taxpayer.OngId = OngId;

                const query = await Taxpayer.create(taxpayer);

                Util.saveLogInfo(action, UserId)
                res.status(200).send({ status: true, response: query, code: 20 });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId)
                res.status(500).send({ status: false, response: err, code: 22 })
            }
        }
        else {
            res.status(400).send({ status: false, response: 'invalid taxpayer info', code: 21 })
        }
    },

    async getAll(req, res) {
        const { UserId, OngId } = req.body, action = 'SELECT ALL TAXPAYER';

        try {
            const query = await Taxpayer.findAll({
                where: {OngId},
                attributes: [
                    "id", "name", "email", "phone1",
                    "phone2", "birth", "createdAt"
                ],
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Address,
                        attributes: [
                            "id", "cep", "state",
                            "city", "district", "street",
                            "complement", "number"
                        ]
                    },
                    {
                        model: Payment,
                        attributes: [
                            "id", "value", "expiration", "hourStart", "hourEnd"
                        ]
                    }
                ],
            });

            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async get(req, res) {
        const { UserId } = req.body, { id } = req.params, action = 'SELECT TAXPAYER';

        try {
            const query = await Taxpayer.findOne({
                where: { id },
                attributes: [
                    "id", "name", "email", "phone1",
                    "phone2", "birth", "createdAt"
                ],
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Address,
                        attributes: [
                            "id", "cep", "state",
                            "city", "district", "street",
                            "complement", "number"
                        ]
                    },
                    {
                        model: Payment,
                        attributes: [
                            "id", "value", "expiration", "hourStart", "hourEnd"
                        ]
                    }
                ],
            });

            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async getByEmail(req, res) {

        const { UserId } = req.body, { email } = req.query, action = 'GET TAXPAYER BY EMAIL';

        try {
            const query = await Taxpayer.findOne({
                where: { email },
                attributes: ['id']
            });

            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId);
            res.status(500).send({ status: false, response: err, code: 22 });
        }
    },

    async getByExpiratioWeek(UserId, OngId, arrayTaxpayerId) {
        const action = 'GET TAXPAYER BY EXPIRATION WEEK', today = new Date();
        let query = [];

        try {
            query = await Taxpayer.findAll({
                where: {
                    '$Payment.expiration$': { [Op.lte]: today.getDate() + 7 },
                    [Op.and]: {
                        ['$Taxpayer.id$']: { [Op.notIn]: arrayTaxpayerId },
                        ['$Taxpayer.OngId$']: OngId
                    }
                },
                attributes: [
                    "id", "name", "email", "phone1",
                    "phone2", "birth", "createdAt"
                ],
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Payment,
                        attributes: [
                            "id", "value", "expiration"
                        ],
                        as: 'Payment'
                    }
                ],
            });


        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId);
        }
        return query;
    },

    async getByExpiratioEqualDate(UserId, arrayTaxpayerId, obj) {
        const action = 'GET TAXPAYER BY EXPIRATION EQUAL DATE', today = new Date();
        let { first, second } = obj, query = [];

        first = (new Date(today.setDate(today.getDate() + first))).getDate(),
        second = (new Date(today.setDate(today.getDate() + second))).getDate();

        try {
            query = await Taxpayer.findAll({
                where: {
                    ['$Taxpayer.id$']: { [Op.notIn]: arrayTaxpayerId },
                    [Op.or]: [
                        {'$Payment.expiration$': { [Op.eq]: first }},
                        {'$Payment.expiration$': { [Op.eq]: second }}                      
                    ],
                },
                attributes: [
                    "id", "name", "email", "phone1",
                    "phone2", "birth", "createdAt"
                ],
                order: [['name', 'ASC']],
                include: [
                    {
                        model: Payment,
                        attributes: [
                            "id", "value", "expiration"
                        ],
                        as: 'Payment'
                    },
                    {
                        model: Ong,
                        attributes: [
                            "id", "name", "cnpj", "email",
                            "statelaw", "municipallaw", "logo"
                        ],
                        as: 'Ong'
                    }
                ],
            });


        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId);
        }
        return query;
    },

    async update(req, res) {
        const { taxpayer, UserId } = req.body, { id } = req.params, action = 'UPDATE TAXPAYER';

        if (await schema.isValid(taxpayer)) {
            try {
                //atualiza endereço
                await AddressController.update(req, res);

                //atualiza pagamento recorrente
                await PaymentController.update(req, res);

                const query = await Taxpayer.update(
                    taxpayer,
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
            res.status(400).send({ status: false, response: 'invalid taxpayer info', code: 21 })
        }
    },

    async delete(req, res) {
        const { UserId } = req.body, { id } = req.params, action = 'DELETE TAXPAYER';

        try {
            const query = await Taxpayer.destroy({
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
}

//validação de campos
let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    phone1: yup.string().min(9).required(),
    phone2: yup.string().min(9),
    birth: yup.date().required()
});