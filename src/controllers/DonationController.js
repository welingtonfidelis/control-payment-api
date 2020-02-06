const { Op } = require('sequelize');

const { Donation } = require('../models');
const { Taxpayer } = require('../models');
const { Address } = require('../models');

const Util = require('../services/Util');

const yup = require('yup');

module.exports = {
    async create(req, res) {
        let { donation, UserId } = req.body, action = 'CREATE DONATION';
        
        if(await schema.isValid(donation)){
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
        const { UserId } = req.body, action = 'SELECT ALL DONATIONS';

        try {
          const query = await Donation.findAll({
            where: {},
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

    async getAllMonth(req, res) {
        const { UserId } = req.body, action = 'SELECT ALL DONATIONS MONTH';

        const date = new Date(), y = date.getFullYear(), m = date.getMonth();
        const firstDay = new Date(y, m, 1);
        const lastDay = new Date(y, m + 1, 0);

        try {            
          const query = await Donation.findAll({
            where: {
                paidIn: {[Op.between]: [firstDay, lastDay]}
            },
            attributes: [
              "id", "value", "paidIn", "createdAt"
            ],
            order: [['paidIn', 'ASC']],
            include: [{
                model: Taxpayer,
                attributes: [
                    "id", "name", "phone1",
                    "phone2"
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

    async get(req, res) {
        const { UserId } = req.body, { id } = req.params, action = 'SELECT DONATION';
    
        try {
          const query = await Donation.findOne({
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
    }
}

//verifica se campos de endereço foram preenchidos
function validValues(obj) {
    obj.observation = obj.observation === '' ? null : obj.observation;

    return obj;
}

//validação de campos
let schema = yup.object().shape({
    value: yup.number().required(),
    paidIn: yup.date().required(),
    TaxpayerId: yup.number().required(),
});