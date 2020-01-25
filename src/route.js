const express = require('express')
const routes = express.Router()
require('dotenv-safe').config()
const jwt = require('jsonwebtoken');

const UserController = require('./controllers/UserController');

//login
routes.post('/user/login', UserController.login);



//Validação de Token para continuar a executar requizição
function verifyJWT(req, res, next) {
    let token = req.headers['token']

    //let usr_id = req.headers['usr_id']

    if (!token) return res.status(401).send({ status: false, response: 'no token', code: 401 });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(401).send({ status: false, response: 'invalid token', code: 402 });
        req.body.UserId = decoded.id
        //if (usr_id != decoded.usr_id) {
        //    return res.status(500).send({ status: false, response: 'invalid user' });
        //};

        // se tudo estiver ok, deixa a requisição prosseguir
        next()
    });
}

//códigos internos de respostas
//10 login efetuado com sucesso
//11 erro login - usuario/email incorreto (não existe no banco)
//12 erro login - senha incorreta

module.exports = routes