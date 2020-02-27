const Util = require('../services/Util');
const { Op } = require('sequelize');
const yup = require('yup');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv-safe').config()
const jwt = require('jsonwebtoken');

const AddressController = require('./AddressController');
const OngController = require('./OngController');

const { User } = require('../models');
const { Address } = require('../models');
const { LogInfo } = require('../models');

module.exports = {
    async login(req, res) {
        console.log(bcrypt.hashSync('admteste', saltRounds));
        console.log(bcrypt.hashSync('userteste', saltRounds));
        
        let { user, password } = req.body, action = 'LOGIN';

        try {
            const query = await User.findOne({
                where: {
                    [Op.or]: [{ user }, { email: user }]
                },
                attributes: ['id', 'name', 'password', 'isAdm', 'OngId']
            });

            if (query) {
                const { id, name, isAdm, OngId } = query, hash = query.password;

                const isValid = await bcrypt.compareSync(password, hash);
                
                if (isValid) {
                    //Recupera informações sobre a ong que o usuário pertence
                    const Ong = await OngController.getLogo(req, OngId);                
                    const nameOng = Ong.name ? Ong.name : 'Ong Não identificada';
                    const logoOng = Ong.logo ? Ong.logo : 'logo';

                    //qualifica usuário como adm ou comum
                    let crypt = isAdm ? '#isAdm@' : '#notAdm@';
                    crypt = bcrypt.hashSync(crypt, saltRounds);

                    const token = jwt.sign({ id, isAdm: crypt, OngId }, process.env.SECRET, {
                        //expiresIn: "12h"
                    })

                    Util.saveLogInfo(action, id)
                    res.status(200).send(
                        {
                            status: true,
                            response: { token, id, name, isAdm: crypt, nameOng, logoOng },
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
        const { user, UserId, OngId } = req.body, action = 'CREATE USER';

        if (await schema.isValid(user)) {
            try {
                //cria um novo endereço e recupera seu id
                const { id } = await AddressController.create(req, res);
                //insere id do novo endereço
                user.AddressId = id;
                
                //inclui id da ong, com base no usuário logado (token)
                user.OngId = OngId;

                //criptografa senha 
                user.password = bcrypt.hashSync(user.password, saltRounds);
                const query = await User.create(user);


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
        const { UserId, OngId } = req.body, action = 'SELECT ALL USERS'

        try {
            const query = await User.findAll({
                where: {OngId},
                attributes: [
                    "id", "name", "email", "phone", "user", "isAdm", "createdAt"
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

            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
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
                    "user", "birth", "isAdm", "createdAt"
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

            res.status(200).send({ status: true, response: query, code: 20 });

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

            res.status(200).send({ status: true, response: query, code: 20 });

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async getByUser(req, res) {

        const { UserId } = req.body, { user } = req.query, action = 'GET USER BY USER';

        try {
            const query = await User.findOne({
                where: { user },
                attributes: ['id']
            });

            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async getByEmail(req, res) {

        const { UserId } = req.body, { email } = req.query, action = 'GET USER BY EMAIL';

        try {
            const query = await User.findOne({
                where: { email },
                attributes: ['id']
            });

            res.status(200).send({ status: true, response: query, code: 20 });
        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, UserId)
            res.status(500).send({ status: false, response: err, code: 22 })
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
        const { UserId } = req.body, { id } = req.params, action = 'DELETE USER';

        try {
            const query = await User.destroy({
                where: {
                    [Op.not]: { id: UserId }, id
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
    user: yup.string().min(3).required(),
    oldPassword: yup.string().min(8),
    password: yup.string().min(8).
        when('oldPassword', (oldPassword, field) => {
            oldPassword ? field.required() : field
        }),
    phone: yup.string().min(8).required(),
    birth: yup.date().required()
});