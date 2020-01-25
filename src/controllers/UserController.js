const Util = require('../services/Util');
const { Op } = require('sequelize');
const yup = require('yup');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv-safe').config()
const jwt = require('jsonwebtoken');

const AddressController = require('./AddressController');

const { User } = require('../models');
const { Address } = require('../models');
const { LogInfo } = require('../models');

module.exports = {
    async login(req, res) {
        let { user, password } = req.body, action = 'LOGIN';

        try {
            const query = await User.findOne({
                where: {
                    [Op.or]: [{ user }, { email: user }]
                },
                attributes: ['id', 'name', 'password']
            });

            if (query) {
                const { id, name } = query, hash = query.password;

                const isValid = await bcrypt.compareSync(password, hash);

                if (isValid) {
                    const token = jwt.sign({ id }, process.env.SECRET, {
                        //expiresIn: "12h"
                    })

                    Util.saveLogInfo(action, id)
                    res.status(200).send(
                        {
                            status: true,
                            response: { token, id, name },
                            code: 10
                        })
                }
                else {
                    res.status(200).send(
                        {
                            status: false,
                            response: 'invalid password',
                            code: 12
                        }
                    );
                    Util.saveLogInfo(`${action} INVALID PASSWORD`, id);
                }

            }
            else {
                res.status(200).send(
                    {
                        status: false,
                        response: 'invalid user/email',
                        code: 11
                    });
            }

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err)
            res.status(500).send({ status: false, response: err })
        }
    },

    async create(req, res) {
        const { user, UserId } = req.body, action = 'CREATE USER';

        if (await schema.isValid(user)) {
            try {
                //cria um novo endereço e recupera seu id
                const { id } = await AddressController.create(req, res);
                //insere id do novo endereço
                user.AddressId = id;

                //criptografa senha 
                user.password = bcrypt.hashSync(user.password, saltRounds);
                const query = await User.create(user);

                Util.saveLogInfo(action, UserId)
                res.status(200).send({ status: true, response: query });
            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId)
                res.status(500).send({ status: false, response: err })
            }
        }
        else {
            res.status(400).send({ status: false, response: 'invalid user info' })
        }
    },

    async getAll(req, res) {
        const { UserId } = req.body, action = 'SELECT ALL USERS'

        try {
            const query = await User.findAll({
                where: {},
                attributes: [
                    "id", "name", "email", "phone", "user", "createdAt"
                ],
                order: [['name', 'ASC']],
                include: [{
                    model: Address,
                    attributes: [
                        "id", "cep", "state",
                        "city", "district", "street",
                        "complement", "number"
                    ]
                }],
            });

            res.status(200).send({ status: true, response: query });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err })
        }
    },

    async get(req, res) {
        const { id } = req.params, action = 'SELECT USER';
        const { UserId } = req.body;

        try {
            const query = await User.findOne({
                where: { id },
                attributes: [
                    "id", "name", "email", "phone",
                    "user", "birth", "createdAt"
                ],
                include: [{
                    model: Address,
                    attributes: [
                        "id", "cep", "state",
                        "city", "district", "street",
                        "complement", "number"
                    ]
                }],
            })

            res.status(200).send({ status: true, response: query });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err })
        }
    },

    async getUserLogs(req, res) {
        const { id } = req.params, action = 'SELECT USER LOGS';
        const { UserId } = req.body;

        try {
            const query = await User.findOne({
                where: { id },
                attributes: [
                    "id", "name"
                ],
                include: [
                    {
                        model: LogInfo,
                        attributes: ["action", "createdAt"]
                    }
                ],
            })

            res.status(200).send({ status: true, response: query });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err })
        }
    },

    async getByUser(req, res) {

        const { UserId } = req.body, { user } = req.query, action = 'GET USER BY USER';

        try {
            const query = await User.findOne({
                where: { user },
                attributes: ['id']
            });

            res.status(200).send({ status: true, response: query });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err })
        }
    },

    async getByEmail(req, res) {

        const { UserId } = req.body, { email } = req.query, action = 'GET USER BY EMAIL';

        try {
            const query = await User.findOne({
                where: { email },
                attributes: ['id']
            });

            res.status(200).send({ status: true, response: query });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err })
        }
    },

    async update(req, res) {
        const { user, UserId } = req.body, { id } = req.params, action = 'UPDATE USER';

        if (await schema.isValid(user)) {
            try {
                //atualiza endereço
                await AddressController.update(req, res);

                const query = await User.update(
                    user,
                    {
                        return: true,
                        where: {
                            id
                        }
                    });

                Util.saveLogInfo(action, UserId)
                res.status(200).send({ status: true, response: query });

            } catch (error) {
                const err = error.stack || error.errors || error.message || error;
                Util.saveLogError(action, err, UserId)
                res.status(500).send({ status: false, response: err })
            }
        }
        else {
            res.status(400).send({ status: false, response: 'invalid user info', code: 406 })
        }
    },

    async delete(req, res) {
        const { UserId } = req.body, { id } = req.params, action = 'DELETE USER';

        try {
            const query = await User.destroy({
                where: {
                    id
                }
            });

            Util.saveLogInfo(action, UserId)
            res.status(200).send({ status: true, response: query });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err })
        }
    }
}

//validação de campos
let schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required(),
    user: yup.string().min(3).required(),
    oldPassword: yup.string().min(8),
    password: yup.string().min(8).
        when('oldPassword', (oldPassword, field) => {
            oldPassword ? field.required() : field
        }),
    phone: yup.string().min(8).required(),
    birth: yup.date().required()
});