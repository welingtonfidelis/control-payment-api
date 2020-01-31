const { Address } = require('../models');
const { State } = require('../models');

const Util = require('../services/Util');

module.exports = {
    async create(req, res) {
        let { address, UserId } = req.body, action = 'CREATE ADDRESS';

        address = validValues(address);

        try {
            const query = await Address.create(address);
            Util.saveLogInfo(action, UserId)
            return query.dataValues;

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId);
        }
    },

    async getState(req, res) {
        const action = 'SELECT ALL STATES';
        const { UserId } = req.body;
    
        try {
          const query = await State.findAll({
            where: {},
            attributes: [
              "name", "code"
            ],
            order: [['name', 'ASC']],
          });
    
          res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
          const err = error.stack || error.errors || error.message || error;
          Util.saveLogError(action, err, UserId)
          res.status(500).send({ status: false, response: err, code: 22 })
        }
      },

    async update(req, res) {
        let { UserId, address } = req.body, action = 'UPDATE ADDRESS';

        address = validValues(address);
        
        try {
            const query = await Address.update(
                address,
                {
                    return: true,
                    where: {
                        id: address.id
                    }
                }
            );   

            Util.saveLogInfo(action, UserId)        
            return query.dataValues;

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            console.log(err);
        }
    },

    async delete(req, res) {
        const { id, UserId } = req.body.address, action = 'DELETE ADDRESS';

        try {
            await Address.destroy({
                where: {
                    id
                }
            });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            console.log(err);
        }
    }
}

//verifica se campos de endereço foram preenchidos
function validValues(address) {
    address.cep = address.cep === '' ? null : address.cep;
    address.state = address.state === '' ? null : address.state;
    address.city = address.city === '' ? null : address.city;
    address.district = address.district === '' ? null : address.district;
    address.street = address.street === '' ? null : address.street;
    address.complement = address.complement === '' ? null : address.complement;
    address.number = address.number === '' ? null : address.number;

    return address;
}