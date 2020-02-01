const { Op } = require('sequelize');

const { Donation } = require('../models');
const { Taxpayer } = require('../models');
const { Address } = require('../models');
const { Payment } = require('../models');

const Util = require('../services/Util');

const date = new Date(), y = date.getFullYear(), m = date.getMonth();
const firstDay = new Date(y, m, 1);
const lastDay = new Date(y, m + 1, 0);

module.exports = {
    async getAllMonth(req, res) {
        const { UserId } = req.body, action = 'SELECT ALL RECEIVEMENT MONTH';
       
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
                        ['$Taxpayer.id$']: {[Op.notIn]: arrayTaxpayerId}
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
                            "id", "value", "expiration"
                        ],
                        as: 'Payment'
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