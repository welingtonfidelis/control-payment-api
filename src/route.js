const express = require('express')
const routes = express.Router()
require('dotenv-safe').config()
const jwt = require('jsonwebtoken');

const UserController = require('./controllers/UserController');
const TaxpayerController = require('./controllers/TaxpayerController');
const AddressController = require('./controllers/AddressController');
const DonationController = require('./controllers/DonationController');
const ReceiveController = require('./controllers/ReceiveController');
const CashRegisterController = require('./controllers/CashRegisterController');

//login
routes.post('/user/login', UserController.login);

//reset de senha
routes.post('/user/resetmail', UserController.resetMail);

//rota usada para manter o servidor heroku ativo (sem dormir por falta de uso em 1 hora)
routes.get('/hello', (req, res) => {
    res.send('Hello');
})

//Validação de token para acesso às rotas
routes.use(verifyJWT);

//Usuário
routes.post('/user/resetpswd', (req, res) => {
    UserController.resetPswd(req, res);
});
routes.post('/user', (req, res) => {
    UserController.create(req, res);
});
routes.get('/user', (req, res) => {
    UserController.getAll(req, res)
});
routes.get('/user/byuser', (req, res) => {
    UserController.getByUser(req, res)
});
routes.get('/user/byemail', (req, res) => {
    UserController.getByEmail(req, res)
});
routes.get('/user/:id', (req, res) => {
    UserController.get(req, res)
});
routes.get('/user/logs/:id', (req, res) => {
    UserController.getUserLogs(req, res)
});
routes.put('/user/:id', (req, res) => {
    UserController.update(req, res)
});
routes.delete('/user/:id', (req, res) => {
    UserController.delete(req, res)
});

//Contribuinte
routes.post('/taxpayer', (req, res) => {
    TaxpayerController.create(req, res);
});
routes.get('/taxpayer/byemail', (req, res) => {
    TaxpayerController.getByEmail(req, res);
});
routes.get('/taxpayer', (req, res) => {
    TaxpayerController.getAll(req, res);
});
routes.get('/taxpayer/:id', (req, res) => {
    TaxpayerController.get(req, res);
});
routes.put('/taxpayer/:id', (req, res) => {
    TaxpayerController.update(req, res);
});
routes.delete('/taxpayer/:id', (req, res) => {
    TaxpayerController.delete(req, res);
});

//Endereço
routes.get('/address/state', (req, res) => {
    AddressController.getState(req, res);
});

//Doações
routes.post('/donation', (req, res) => {
    DonationController.create(req, res);
});
routes.get('/donation', (req, res) => {
    DonationController.getAll(req, res);
});
routes.get('/donation/bymonth', (req, res) => {
    DonationController.getAllMonth(req, res);
});
routes.get('/donation/bydate', (req, res) => {
    DonationController.getByDate(req, res);
});
routes.get('/donation/bytaxpayer', (req, res) => {
    DonationController.getByTaxpayer(req, res);
});
routes.get('/donation/:id', (req, res) => {
    DonationController.get(req, res);
});
routes.put('/donation/:id', (req, res) => {
    DonationController.update(req, res);
});
routes.delete('/donation/:id', (req, res) => {
    DonationController.delete(req, res);
});

//Pagamentos à receber
routes.get('/receive/month', (req, res) => {
    ReceiveController.getAllMonth(req, res);
});
routes.get('/receive/bydate', (req, res) => {
    ReceiveController.getByDate(req, res);
});
routes.get('/receive/bytaxpayer', (req, res) => {
    ReceiveController.getByTaxpayer(req, res);
});

//Entrada/Saída de caixa
routes.post('/cashregister', (req, res) => {
    CashRegisterController.create(req, res);
});
routes.get('/cashregister', (req, res) => {
    CashRegisterController.getAll(req, res);
});
routes.get('/cashregister/byfilter', (req, res) => {
    CashRegisterController.getAllByFilter(req, res);
});
routes.get('/cashregister/:id', (req, res) => {
    CashRegisterController.get(req, res);
});
routes.put('/cashregister/:id', (req, res) => {
    CashRegisterController.update(req, res);
});
routes.delete('/cashregister/:id', (req, res) => {
    CashRegisterController.delete(req, res);
});


//Validação de Token para continuar a executar requizição
function verifyJWT(req, res, next) {
    let token = req.headers['token']

    //let usr_id = req.headers['usr_id']

    if (!token) return res.status(200).send({ status: false, response: 'no token', code: 401 });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return res.status(200).send({ status: false, response: 'invalid token', code: 402 });
        req.body.UserId = decoded.id;
        req.body.isAdm = decoded.isAdm;
        req.body.OngId = decoded.OngId;
        
        //if (usr_id != decoded.usr_id) {
        //    return res.status(500).send({ status: false, response: 'invalid user' });
        //};

        // se tudo estiver ok, deixa a requisição prosseguir
        next()
    });
}

//-------- CÓDIGOS INTERNOS DE RESPOSTAS AO USUÁRIO ----------//
//401 sem token para validação de rota
//402 token inválido para validação de rota

//10 login efetuado com sucesso
//11 erro login - usuario/email incorreto (não existe no banco)
//12 erro login - senha incorreta

//20 sucesso na requisição (create, update, select, delete)
//21 informações inválidas (fora do padrão esperado. Ex: criar usuário sem email)
//22 problema interno da aplicação

module.exports = routes