const { Op } = require('sequelize');

const { Donation } = require('../models');
const { Taxpayer } = require('../models');
const { Address } = require('../models');
const { Payment } = require('../models');
const { Ong } = require('../models');

const Util = require('../services/Util');

const date = new Date(), y = date.getFullYear(), m = date.getMonth();
const firstDay = new Date(y, m, 1);
const lastDay = new Date(y, m + 1, 0);

module.exports = {
    async getAllMonth(req, res) {
        const { UserId, OngId } = req.body, action = 'SELECT ALL RECEIVEMENT MONTH';
       
        try {
            let query = await Donation.findAll({
                where: {
                    paidIn: {[Op.between]: [firstDay, lastDay]}
                },
                attributes: ['TaxpayerId']
              
            })
            
            const arrayTaxpayerId = query.map(el => {
                const { TaxpayerId } = el;
                return TaxpayerId;
            })
            
            query = await Taxpayer.findAll({
                where: {
                    '$Payment.expiration$': {[Op.lte]: 31},
                    [Op.and]: {
                        ['$Taxpayer.id$']: {[Op.notIn]: arrayTaxpayerId},
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
                        model: Address,
                        attributes: [
                            "id", "cep", "state",
                            "city", "district", "street",
                            "complement", "number"
                        ],
                        as: 'Address'
                    },
                    {
                        model: Payment,
                        attributes: [
                            "id", "value", "expiration", "hourStart", "hourEnd"
                        ],
                        as: 'Payment'
                    },
                    {
                        model: Ong,
                        attributes: [
                            "id", "name", "cnpj", "email", "statelaw", 
                            "municipallaw", "social1", "social2"
                        ],
                        as: 'Ong'
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

    async getByDate(req, res) {
        const { UserId, OngId } = req.body, { start, end } = req.query,
            action = 'SELECT BYDATE RECEIVEMENT MONTH',
            sDay = ((start).split('-'))[2], eDay = ((end).split('-'))[2];

        try {
            let query = await Donation.findAll({
                where: {
                    paidIn: {[Op.between]: [start, end]}
                },
                attributes: ['TaxpayerId']
              
            })
            
            const arrayTaxpayerId = query.map(el => {
                const { TaxpayerId } = el;
                return TaxpayerId;
            })
            
            query = await Taxpayer.findAll({
                where: {
                    '$Payment.expiration$': {[Op.lte]: eDay},
                    [Op.and]: {
                        '$Taxpayer.id$': {[Op.notIn]: arrayTaxpayerId},
                        '$Payment.expiration$': {[Op.gte]: sDay},
                        '$Taxpayer.OngId$': OngId
                    }
                },
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
                        ],
                        as: 'Address'
                    },
                    {
                        model: Payment,
                        attributes: [
                            "id", "value", "expiration", "hourStart", "hourEnd"
                        ],
                        as: 'Payment'
                    },
                    {
                        model: Ong,
                        attributes: [
                            "id", "name", "cnpj", "email", "statelaw", 
                            "municipallaw", "social1", "social2"
                        ],
                        as: 'Ong'
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

    async getByTaxpayer(req, res) {
        let { UserId } = req.body, { arrayTaxpayerId } = req.query,
            action = 'SELECT BYTAXPAYER RECEIVEMENT MONTH';
            
            arrayTaxpayerId = JSON.parse(arrayTaxpayerId);

        try {
            let query = await Donation.findAll({
                where: {
                    paidIn: {[Op.between]: [firstDay, lastDay]}
                },
                attributes: ['TaxpayerId']
            })
            
            //Compara se existem contribuintes que já pagaram no mês corrente
            //mas estão na lista (arrayTaxpayerId) enviada pelo usuário
            query.forEach(el => {
                const { TaxpayerId } = el;
                
                const index = arrayTaxpayerId.findIndex((elem) => {
                    return elem == TaxpayerId
                })

                if(index > 0) arrayTaxpayerId.splice(index, 1);
            });

            query = await Taxpayer.findAll({
                where: {
                    '$Payment.expiration$': {[Op.lte]: 31},
                    [Op.and]: {
                        ['$Taxpayer.id$']: {[Op.in]: arrayTaxpayerId}
                    }
                },
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
                        ],
                        as: 'Address'
                    },
                    {
                        model: Payment,
                        attributes: [
                            "id", "value", "expiration", "hourStart", "hourEnd"
                        ],
                        as: 'Payment'
                    },
                    {
                        model: Ong,
                        attributes: [
                            "id", "name", "cnpj", "email", "statelaw", 
                            "municipallaw", "social1", "social2"
                        ],
                        as: 'Ong'
                    }
                ],
            });

            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
          const err = error.stack || error.errors || error.message || error;
          Util.saveLogError(action, err, UserId)
          res.status(500).send({ status: false, response: err, code: 22 })
        }
    }
}