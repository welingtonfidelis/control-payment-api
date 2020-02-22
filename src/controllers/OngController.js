const yup = require('yup');

const { Ong } = require('../models');
const Util = require('../services/Util');

module.exports = {
    async create(req, res) {
        let { ong, UserId } = req.body, action = 'CREATE ONG';

        if (await schema.isValid(ong)) {
            try {
                const query = await Ong.create(ong);

                Util.saveLogInfo(action, UserId)
                res.status(200).send({ status: true, response: query, code: 20 });
            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId)
                res.status(500).send({ status: false, response: err, code: 22 })
            }
        }
        else {
            res.status(400).send({ status: false, response: 'invalid ong info', code: 21 })
        }
    },

    async getLogo(req, id) {
        const action = 'SELECT LOGO ONG', { UserId } = req.body;

        try {
            const query = await Ong.findOne({
                where: { id },
                attributes: [
                    "name", "logo"
                ]
            });

            return query;
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
        }
        return;
    },
}

//validação de campos
let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    logo: yup.string().required(),
    cnpj: yup.string().required()
});