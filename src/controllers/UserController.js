const Util = require('../services/Util');
const { Op } = require('sequelize');
const nodemailer = require('nodemailer');
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

    async resetMail(req, res) {
        const { email } = req.body, action = 'RESET PASSWORD BY EMAIL';

        try {
            const query = await User.findOne({
                where: { email },
                attributes: ['id', 'name']
            });

            if (query) {
                const { id, name } = query;
                const token = jwt.sign({ id }, process.env.SECRET, {
                    expiresIn: 600
                });

                await User.update(
                    { tokenResetPswd: token },
                    {
                        return: true,
                        where: {
                            id
                        }
                    });

                const transporter = nodemailer.createTransport({
                    service: 'hotmail',
                    auth: {
                        user: process.env.MAIL_USER,
                        pass: process.env.MAIL_PASSWD
                    }
                });

                await transporter.sendMail({
                    from: process.env.MAIL_USER,
                    to: email, // list of receivers
                    subject: "Recuperar senha", // Subject line
                    //text: "Hello world?", // plain text body
                    html: `
                        <b>Olá ${name}.</b>
                        <p>Houve um pedido de recuperação de senha no seu e-mail, 
                        caso não tenha sido você, pedimos que ignore esta mensagem. </p>
                        <p>Agora, se gostaria realmente de recuperar sua senha,
                        <a href="${process.env.URL_FRONT}/changepassword/${token}">clique aqui</a> 
                        para ir até a página de alteração de senha.</p>
                        <p><strong>Esta alteração deve ser 
                        feita em até 10 minutos após o recebimento deste email.</strong></p>
                        `
                });
                res.status(200).send({ status: true, response: 'reset password sended', code: 30 });
            }
            else {
                res.status(400).send({ status: false, response: 'mail not found', code: 31 });
            }

        } catch (error) {
            const err = error.stack || error.errors || error.message || error;
            Util.saveLogError(action, err, 1)
            res.status(500).send({ status: false, response: err, code: 22 })
        }
    },

    async resetPswd(req, res) {
        let { password, UserId } = req.body, { token } = req.headers,
            action = 'RESET PASSWORD USER';
        password = bcrypt.hashSync(password, saltRounds);

        if (password.length >= 8) {
            try {
                const query = await User.update(
                    { password, tokenResetPswd: null },
                    {
                        return: true,
                        where: {
                            tokenResetPswd: token
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
                where: { OngId },
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

    async getByToken(req, res) {
        const { UserId } = req.body, action = 'SELECT USER';

        try {
            const query = await User.findOne({
                where: { id: UserId },
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
        const { user, UserId, address } = req.body, { id } = req.params, action = 'UPDATE USER';

        if (await schema.isValid(user)) {
            try {
                //atualiza endereço
                if(address) await AddressController.update(req, res);

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